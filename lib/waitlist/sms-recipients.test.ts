import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSmsLaunchRecipients } from "./sms-recipients";

const SUPABASE_URL = "https://supabase.test";
const PHONE = "+12125550147";

const originalEnv = { ...process.env };

beforeEach(() => {
  process.env.SUPABASE_URL = SUPABASE_URL;
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role-test-key";
});

afterEach(() => {
  process.env = { ...originalEnv };
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("getSmsLaunchRecipients", () => {
  it("returns nothing and makes no request when Supabase secrets are missing", async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await getSmsLaunchRecipients();

    expect(result).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("queries only sms_opt_in=true AND phone_number IS NOT NULL and maps the rows", async () => {
    let requestedUrl = "";
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string | URL) => {
        requestedUrl = String(url);
        return new Response(JSON.stringify([{ phone_number: PHONE }]), { status: 200 });
      }),
    );

    const result = await getSmsLaunchRecipients();

    expect(requestedUrl).toContain("sms_opt_in=eq.true");
    expect(requestedUrl).toContain("phone_number=not.is.null");
    expect(result).toEqual([{ phoneNumber: PHONE }]);
  });

  it("returns an empty list on a failed request without throwing or logging the phone number", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => new Response("server error", { status: 500 })));

    const result = await getSmsLaunchRecipients();

    expect(result).toEqual([]);
    const logged = errorSpy.mock.calls.flat().map((v) => JSON.stringify(v)).join(" ");
    expect(logged).not.toContain(PHONE);
  });
});
