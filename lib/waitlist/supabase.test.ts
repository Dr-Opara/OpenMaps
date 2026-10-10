import { afterEach, describe, expect, it, vi } from "vitest";
import { SupabaseWaitlistStore } from "./supabase";
import type { WaitlistEntry } from "./types";

const SUPABASE_URL = "https://supabase.test";
const SERVICE_ROLE_KEY = "service-role-test-key";
const PHONE = "+12125550147";

function baseEntry(overrides: Partial<WaitlistEntry> = {}): WaitlistEntry {
  return {
    email: "person@example.com",
    firstName: null,
    cityState: null,
    alphaInterest: false,
    phoneNumber: null,
    smsOptIn: false,
    source: "direct",
    ...overrides,
  };
}

function newStore() {
  return new SupabaseWaitlistStore(SUPABASE_URL, SERVICE_ROLE_KEY);
}

type Method = "GET" | "POST" | "PATCH";

interface FetchCall {
  url: string;
  method: Method;
  body?: Record<string, unknown>;
}

interface StubOptions {
  /** The authoritative duplicate lookup, which always runs BEFORE any insert. */
  lookup?: { status?: number; rows?: Array<{ id: string }> };
  insert?: { status: number };
  patch?: { status: number };
}

/**
 * Routes the mock by HTTP method rather than by call order: the store issues a GET lookup
 * first, so an order-dependent mock would try to JSON.parse the GET's undefined body.
 */
function stubSupabase(opts: StubOptions = {}): FetchCall[] {
  const calls: FetchCall[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string | URL, init?: RequestInit) => {
      const method = (init?.method ?? "GET").toUpperCase() as Method;
      const call: FetchCall = { url: String(url), method };
      // Only bodies are parsed; the lookup is a GET and carries no body at all.
      if (init?.body) call.body = JSON.parse(String(init.body));
      calls.push(call);

      if (method === "GET") {
        const status = opts.lookup?.status ?? 200;
        if (status >= 400) return new Response("server error", { status });
        return new Response(JSON.stringify(opts.lookup?.rows ?? []), { status });
      }
      if (method === "PATCH") return new Response(null, { status: opts.patch?.status ?? 204 });
      return new Response(null, { status: opts.insert?.status ?? 201 });
    }),
  );
  return calls;
}

const methods = (calls: FetchCall[]) => calls.map((c) => c.method);

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("SupabaseWaitlistStore.add", () => {
  it("inserts sms_opt_in / sms_opt_in_at / phone_number when opting in", async () => {
    const calls = stubSupabase({ lookup: { rows: [] }, insert: { status: 201 } });

    const result = await newStore().add(baseEntry({ email: "new@example.com", phoneNumber: PHONE, smsOptIn: true }));

    expect(result).toEqual({ status: "created" });
    const insert = calls.find((c) => c.method === "POST");
    expect(insert?.body?.phone_number).toBe(PHONE);
    expect(insert?.body?.sms_opt_in).toBe(true);
    expect(typeof insert?.body?.sms_opt_in_at).toBe("string");
  });

  it("inserts null phone_number/sms_opt_in_at and sms_opt_in=false when not opting in", async () => {
    const calls = stubSupabase({ lookup: { rows: [] }, insert: { status: 201 } });

    await newStore().add(baseEntry({ email: "nosms@example.com" }));

    const insert = calls.find((c) => c.method === "POST");
    expect(insert?.body?.phone_number).toBeNull();
    expect(insert?.body?.sms_opt_in).toBe(false);
    expect(insert?.body?.sms_opt_in_at).toBeNull();
  });

  it("looks the email up before inserting, and normalizes it for every call", async () => {
    const calls = stubSupabase({ lookup: { rows: [] }, insert: { status: 201 } });

    await newStore().add(baseEntry({ email: "  MiXeD@Example.COM  " }));

    expect(methods(calls)).toEqual(["GET", "POST"]);
    expect(calls[0].url).toContain("email=eq.mixed%40example.com");
    expect(calls[0].body).toBeUndefined(); // the lookup carries no body to parse
    expect(calls[1].body?.email).toBe("mixed@example.com");
  });

  it("treats a row found by the lookup as a duplicate and never inserts a second one", async () => {
    const calls = stubSupabase({ lookup: { rows: [{ id: "existing-id" }] } });

    const result = await newStore().add(baseEntry({ email: "dup@example.com" }));

    expect(result).toEqual({ status: "duplicate" });
    expect(methods(calls)).toEqual(["GET"]);
  });

  it("never PATCHes SMS consent when the resubmission does not opt in", async () => {
    const calls = stubSupabase({ lookup: { rows: [{ id: "existing-id" }] } });

    const result = await newStore().add(baseEntry({ email: "dup@example.com" }));

    expect(result).toEqual({ status: "duplicate" });
    expect(methods(calls)).not.toContain("PATCH");
    expect(methods(calls)).not.toContain("POST");
  });

  it("lets a returning duplicate add SMS consent via PATCH, without creating a second row", async () => {
    const calls = stubSupabase({ lookup: { rows: [{ id: "existing-id" }] }, patch: { status: 204 } });

    const result = await newStore().add(
      baseEntry({ email: "returning@example.com", phoneNumber: PHONE, smsOptIn: true }),
    );

    expect(result).toEqual({ status: "duplicate" });
    const patch = calls.find((c) => c.method === "PATCH");
    expect(patch?.url).toContain("email=eq.returning%40example.com");
    expect(patch?.body?.phone_number).toBe(PHONE);
    expect(patch?.body?.sms_opt_in).toBe(true);
    expect(typeof patch?.body?.sms_opt_in_at).toBe("string");
    expect(methods(calls)).not.toContain("POST");
  });

  it("treats a 409 on insert as a duplicate when a concurrent request wins the race", async () => {
    const calls = stubSupabase({ lookup: { rows: [] }, insert: { status: 409 } });

    const result = await newStore().add(baseEntry({ email: "racer@example.com" }));

    expect(result).toEqual({ status: "duplicate" });
    expect(methods(calls)).toEqual(["GET", "POST"]);
    expect(methods(calls)).not.toContain("PATCH");
  });

  it("records SMS consent on the existing row when the raced insert loses the 409", async () => {
    const calls = stubSupabase({
      lookup: { rows: [] },
      insert: { status: 409 },
      patch: { status: 204 },
    });

    const result = await newStore().add(
      baseEntry({ email: "racer2@example.com", phoneNumber: PHONE, smsOptIn: true }),
    );

    expect(result).toEqual({ status: "duplicate" });
    const patch = calls.find((c) => c.method === "PATCH");
    expect(patch?.body?.phone_number).toBe(PHONE);
    expect(patch?.body?.sms_opt_in).toBe(true);
    expect(methods(calls).filter((m) => m === "POST")).toHaveLength(1);
  });

  it("never logs the phone number, even when the SMS consent PATCH fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    stubSupabase({ lookup: { rows: [{ id: "existing-id" }] }, patch: { status: 500 } });

    const result = await newStore().add(
      baseEntry({ email: "returning2@example.com", phoneNumber: PHONE, smsOptIn: true }),
    );

    expect(result).toEqual({ status: "duplicate" }); // the base signup is never lost
    const logged = errorSpy.mock.calls.flat().map((v) => JSON.stringify(v)).join(" ");
    expect(logged).not.toContain(PHONE);
  });

  it("throws on an unexpected insert error status", async () => {
    stubSupabase({ lookup: { rows: [] }, insert: { status: 500 } });

    await expect(newStore().add(baseEntry({ email: "broken@example.com" }))).rejects.toThrow(
      "Supabase insert failed with HTTP 500",
    );
  });

  it("throws when the lookup itself fails rather than risking a duplicate insert", async () => {
    const calls = stubSupabase({ lookup: { status: 500 } });

    await expect(newStore().add(baseEntry({ email: "lookup-broken@example.com" }))).rejects.toThrow(
      "Supabase lookup failed with HTTP 500",
    );
    expect(methods(calls)).not.toContain("POST");
  });
});