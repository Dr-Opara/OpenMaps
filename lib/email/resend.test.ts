import { afterEach, describe, expect, it, vi } from "vitest";
import { sendEmail } from "./resend";
import type { EmailTemplate } from "./types";

const template: EmailTemplate = { subject: "Subject", html: "<p>hi</p>", text: "hi" };

afterEach(() => {
  delete process.env.RESEND_API_KEY;
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("sendEmail", () => {
  it("skips sending and reports not_configured when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const result = await sendEmail("user@example.com", template);

    expect(result).toEqual({ ok: false, reason: "not_configured" });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("sends via the Resend API with the fixed from/reply-to and never leaks the key in the result", async () => {
    process.env.RESEND_API_KEY = "re_test_secret";
    const fetchSpy = vi.fn(async (url: string | URL, init?: RequestInit) => {
      expect(String(url)).toBe("https://api.resend.com/emails");
      const body = JSON.parse(String(init?.body));
      expect(body).toMatchObject({
        from: "OpenMaps <updates@openmaps.tech>",
        reply_to: "hello@openmaps.tech",
        to: "user@example.com",
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer re_test_secret");
      return new Response(JSON.stringify({ id: "abc" }), { status: 200 });
    });
    vi.stubGlobal("fetch", fetchSpy);

    const result = await sendEmail("user@example.com", template);

    expect(result).toEqual({ ok: true });
    expect(JSON.stringify(result)).not.toContain("re_test_secret");
  });

  it("returns provider_error without throwing when Resend responds with an error status", async () => {
    process.env.RESEND_API_KEY = "re_test_secret";
    vi.stubGlobal("fetch", vi.fn(async () => new Response("bad request", { status: 422 })));

    const result = await sendEmail("user@example.com", template);

    expect(result).toEqual({ ok: false, reason: "provider_error" });
  });

  it("returns provider_error without throwing when the network request itself fails", async () => {
    process.env.RESEND_API_KEY = "re_test_secret";
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );

    const result = await sendEmail("user@example.com", template);

    expect(result).toEqual({ ok: false, reason: "provider_error" });
  });

  it("never prints the API key, even when logging a failure", async () => {
    process.env.RESEND_API_KEY = "re_test_secret";
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );

    await sendEmail("user@example.com", template);

    const logged = errorSpy.mock.calls.flat().map((v) => JSON.stringify(v)).join(" ");
    expect(logged).not.toContain("re_test_secret");
  });
});
