import { afterEach, describe, expect, it, vi } from "vitest";
import { sendLaunchNotification } from "./sms";

const PHONE = "+12125550147";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("sendLaunchNotification", () => {
  it("is a safe no-op: it does not send anything and reports not_configured", async () => {
    const result = await sendLaunchNotification({ phoneNumber: PHONE });

    expect(result).toEqual({ ok: false, reason: "not_configured" });
  });

  it("never logs the phone number", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await sendLaunchNotification({ phoneNumber: PHONE });

    const logged = errorSpy.mock.calls.flat().map((v) => JSON.stringify(v)).join(" ");
    expect(logged).not.toContain(PHONE);
  });
});
