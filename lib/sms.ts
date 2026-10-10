/**
 * SMS provider abstraction for future launch-notification delivery. No provider is connected
 * yet, and nothing in this codebase calls sendLaunchNotification automatically — wiring a real
 * send is a deliberate future change, not a side effect of adding this file. See README.md
 * ("SMS (future, not yet implemented)") for the intended end-to-end flow once a provider exists.
 */

export interface SmsSendResult {
  ok: boolean;
  reason?: "not_configured" | "provider_error";
}

/**
 * Intentionally unimplemented: calling this does not send anything and never will until a real
 * provider is wired in here explicitly. The phone number is never logged or forwarded anywhere.
 */
export async function sendLaunchNotification({
  phoneNumber,
}: {
  phoneNumber: string;
}): Promise<SmsSendResult> {
  void phoneNumber;
  console.error("[sms] sendLaunchNotification called but no SMS provider is connected yet");
  return { ok: false, reason: "not_configured" };
}
