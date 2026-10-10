import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const SUPABASE_URL = "https://supabase.test";
const VALID_PHONE = "(212) 555-0147";
const VALID_PHONE_E164 = "+12125550147";

// The route's per-isolate rate limiter is a module-level singleton keyed by IP, so every test
// needs its own cf-connecting-ip — otherwise tests sharing one IP bucket start tripping each
// other's 429 after the 8th request in this file, regardless of what each test is actually
// checking.
let ipCounter = 0;
function makeRequest(body: unknown) {
  ipCounter += 1;
  return new Request("https://openmaps.tech/api/waitlist", {
    method: "POST",
    headers: { "content-type": "application/json", "cf-connecting-ip": `10.0.0.${ipCounter}` },
    body: JSON.stringify(body),
  });
}

interface FetchCall {
  url: string;
  method?: string;
  body?: Record<string, unknown>;
}

interface SupabaseHandlers {
  /** Rows the GET duplicate lookup returns. Defaults to "email is free" (200 with []). */
  lookupRows?: Array<{ id: string }>;
  /** Status the POST insert returns. */
  insertStatus?: number;
}

function stubFetch(handlers: { supabase?: SupabaseHandlers; resend?: "ok" | "error" | "unreachable" }) {
  const calls: FetchCall[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string | URL, init?: RequestInit) => {
      const u = String(url);
      const call: FetchCall = { url: u, method: init?.method };
      if (init?.body) call.body = JSON.parse(String(init.body));
      calls.push(call);

      if (u.includes("supabase.test")) {
        // The store looks the email up with a GET (no body to parse) before it ever inserts, so
        // this mock routes on the HTTP method instead of assuming the first call is the insert.
        if (!init?.method) {
          return new Response(JSON.stringify(handlers.supabase?.lookupRows ?? []), { status: 200 });
        }
        // A PATCH only ever happens on the SMS-consent-merge path for an existing row; treat it
        // as succeeding so tests on that path assert the request itself, not this mock's status.
        if (init.method === "PATCH") return new Response(null, { status: 204 });
        return new Response(null, { status: handlers.supabase?.insertStatus ?? 201 });
      }
      if (u.includes("api.resend.com")) {
        if (handlers.resend === "error") return new Response("server error", { status: 500 });
        if (handlers.resend === "unreachable") throw new Error("network down");
        return new Response(JSON.stringify({ id: "abc" }), { status: 200 });
      }
      throw new Error(`unexpected fetch: ${u}`);
    }),
  );
  return calls;
}

const originalEnv = { ...process.env };

beforeEach(() => {
  process.env.SUPABASE_URL = SUPABASE_URL;
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test-key";
  process.env.RESEND_API_KEY = "re_test_key";
});

afterEach(() => {
  process.env = { ...originalEnv };
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/waitlist", () => {
  it("stores a new signup and sends a confirmation email", async () => {
    const calls = stubFetch({ resend: "ok" });

    const res = await POST(makeRequest({ email: "new@example.com" }));
    const json = await res.json();

    expect(json).toEqual({ ok: true, duplicate: false });
    expect(calls.some((c) => c.url.includes("api.resend.com"))).toBe(true);
  });

  it("does not send a confirmation email for a duplicate signup", async () => {
    const calls = stubFetch({ supabase: { lookupRows: [{ id: "existing-id" }] }, resend: "ok" });

    const res = await POST(makeRequest({ email: "dup@example.com" }));
    const json = await res.json();

    expect(json).toEqual({ ok: true, duplicate: true });
    expect(calls.some((c) => c.url.includes("api.resend.com"))).toBe(false);
  });

  it("keeps the signup successful when Resend responds with an error", async () => {
    stubFetch({ resend: "error" });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(makeRequest({ email: "resend-down@example.com" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, duplicate: false });
    expect(errorSpy).toHaveBeenCalled();
  });

  it("keeps the signup successful when the Resend request itself fails", async () => {
    stubFetch({ resend: "unreachable" });
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(makeRequest({ email: "resend-unreachable@example.com" }));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ ok: true, duplicate: false });
  });

  it("succeeds without attempting to send when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const calls = stubFetch({});

    const res = await POST(makeRequest({ email: "nokey@example.com" }));
    const json = await res.json();

    expect(json).toEqual({ ok: true, duplicate: false });
    expect(calls.every((c) => !c.url.includes("api.resend.com"))).toBe(true);
  });

  it("rejects SMS opt-in without a phone number", async () => {
    stubFetch({});

    const res = await POST(makeRequest({ email: "nophone@example.com", smsOptIn: true }));
    const json = (await res.json()) as { ok: boolean; error?: string };

    expect(res.status).toBe(400);
    expect(json.ok).toBe(false);
    expect(json.error).toMatch(/phone number/i);
  });

  it("rejects SMS opt-in with an invalid phone number", async () => {
    stubFetch({});

    const res = await POST(makeRequest({ email: "badphone@example.com", smsOptIn: true, phoneNumber: "12345" }));
    const json = (await res.json()) as { ok: boolean; error?: string };

    expect(res.status).toBe(400);
    expect(json.ok).toBe(false);
  });

  it("does not require a phone number when SMS opt-in is false", async () => {
    const calls = stubFetch({});

    const res = await POST(makeRequest({ email: "noopt@example.com", smsOptIn: false }));
    const json = await res.json();

    expect(json).toEqual({ ok: true, duplicate: false });
    const insertCall = calls.find((c) => c.method === "POST");
    expect(insertCall?.body?.phone_number).toBeNull();
    expect(insertCall?.body?.sms_opt_in).toBe(false);
    expect(insertCall?.body?.sms_opt_in_at).toBeNull();
  });

  it("normalizes a valid phone number to E.164 and stores sms consent with a timestamp", async () => {
    const calls = stubFetch({});

    const res = await POST(
      makeRequest({ email: "smsyes@example.com", smsOptIn: true, phoneNumber: VALID_PHONE }),
    );
    const json = await res.json();

    expect(json).toEqual({ ok: true, duplicate: false });
    const insertCall = calls.find((c) => c.method === "POST");
    expect(insertCall?.body?.phone_number).toBe(VALID_PHONE_E164);
    expect(insertCall?.body?.sms_opt_in).toBe(true);
    expect(typeof insertCall?.body?.sms_opt_in_at).toBe("string");
  });

  it("lets a duplicate safely add SMS consent without creating a second row", async () => {
    const calls = stubFetch({ supabase: { lookupRows: [{ id: "existing-id" }] } });

    const res = await POST(
      makeRequest({ email: "returning@example.com", smsOptIn: true, phoneNumber: VALID_PHONE }),
    );
    const json = await res.json();

    expect(json).toEqual({ ok: true, duplicate: true });
    const patchCall = calls.find((c) => c.method === "PATCH");
    expect(patchCall).toBeDefined();
    expect(patchCall?.body?.sms_opt_in).toBe(true);
    expect(patchCall?.body?.phone_number).toBe(VALID_PHONE_E164);
    expect(calls.filter((c) => c.method === "POST")).toHaveLength(0);
  });

  it("does not touch SMS consent on a duplicate that does not opt in", async () => {
    const calls = stubFetch({ supabase: { lookupRows: [{ id: "existing-id" }] } });

    const res = await POST(makeRequest({ email: "returning2@example.com" }));
    const json = await res.json();

    expect(json).toEqual({ ok: true, duplicate: true });
    expect(calls.some((c) => c.method === "PATCH")).toBe(false);
    expect(calls.filter((c) => c.method === "POST")).toHaveLength(0);
  });

  it("treats a raced insert as a duplicate so a signup is never reported as lost", async () => {
    const calls = stubFetch({ supabase: { lookupRows: [], insertStatus: 409 } });

    const res = await POST(makeRequest({ email: "racer@example.com" }));
    const json = await res.json();

    expect(json).toEqual({ ok: true, duplicate: true });
    expect(calls.filter((c) => c.method === "POST")).toHaveLength(1);
    expect(calls.some((c) => c.method === "PATCH")).toBe(false);
  });

  it("never logs the submitted phone number", async () => {
    stubFetch({ resend: "error" });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await POST(makeRequest({ email: "logcheck@example.com", smsOptIn: true, phoneNumber: VALID_PHONE }));

    const logged = errorSpy.mock.calls.flat().map((v) => JSON.stringify(v)).join(" ");
    expect(logged).not.toContain(VALID_PHONE_E164);
    expect(logged).not.toContain(VALID_PHONE);
  });
});
