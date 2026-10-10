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

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("SupabaseWaitlistStore.add", () => {
  it("inserts sms_opt_in / sms_opt_in_at / phone_number when opting in", async () => {
    let insertBody: Record<string, unknown> = {};
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string | URL, init?: RequestInit) => {
        insertBody = JSON.parse(String(init?.body));
        return new Response(null, { status: 201 });
      }),
    );

    const result = await newStore().add(baseEntry({ email: "new@example.com", phoneNumber: PHONE, smsOptIn: true }));

    expect(result).toEqual({ status: "created" });
    expect(insertBody.phone_number).toBe(PHONE);
    expect(insertBody.sms_opt_in).toBe(true);
    expect(typeof insertBody.sms_opt_in_at).toBe("string");
  });

  it("inserts null phone_number/sms_opt_in_at and sms_opt_in=false when not opting in", async () => {
    let insertBody: Record<string, unknown> = {};
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string | URL, init?: RequestInit) => {
        insertBody = JSON.parse(String(init?.body));
        return new Response(null, { status: 201 });
      }),
    );

    await newStore().add(baseEntry({ email: "nosms@example.com" }));

    expect(insertBody.phone_number).toBeNull();
    expect(insertBody.sms_opt_in).toBe(false);
    expect(insertBody.sms_opt_in_at).toBeNull();
  });

  it("treats a 409 as a duplicate and never PATCHes when the resubmission does not opt in", async () => {
    const methods: Array<string | undefined> = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string | URL, init?: RequestInit) => {
        methods.push(init?.method);
        return new Response(null, { status: 409 });
      }),
    );

    const result = await newStore().add(baseEntry({ email: "dup@example.com" }));

    expect(result).toEqual({ status: "duplicate" });
    expect(methods).not.toContain("PATCH");
  });

  it("lets a returning duplicate add SMS consent via PATCH, without creating a second row", async () => {
    let patchUrl = "";
    let patchBody: Record<string, unknown> = {};
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL, init?: RequestInit) => {
        if (init?.method === "PATCH") {
          patchUrl = String(url);
          patchBody = JSON.parse(String(init.body));
          return new Response(null, { status: 204 });
        }
        return new Response(null, { status: 409 }); // insert attempt: already exists
      }),
    );

    const result = await newStore().add(
      baseEntry({ email: "returning@example.com", phoneNumber: PHONE, smsOptIn: true }),
    );

    expect(result).toEqual({ status: "duplicate" });
    expect(patchUrl).toContain("email=eq.returning%40example.com");
    expect(patchBody.phone_number).toBe(PHONE);
    expect(patchBody.sms_opt_in).toBe(true);
    expect(typeof patchBody.sms_opt_in_at).toBe("string");
  });

  it("never logs the phone number, even when the SMS consent PATCH fails", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string | URL, init?: RequestInit) => {
        if (init?.method === "PATCH") return new Response("server error", { status: 500 });
        return new Response(null, { status: 409 });
      }),
    );

    const result = await newStore().add(
      baseEntry({ email: "returning2@example.com", phoneNumber: PHONE, smsOptIn: true }),
    );

    expect(result).toEqual({ status: "duplicate" }); // the base signup is never lost
    const logged = errorSpy.mock.calls.flat().map((v) => JSON.stringify(v)).join(" ");
    expect(logged).not.toContain(PHONE);
  });

  it("throws on an unexpected insert error status", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 500 })));

    await expect(newStore().add(baseEntry({ email: "broken@example.com" }))).rejects.toThrow(
      "Supabase insert failed with HTTP 500",
    );
  });
});
