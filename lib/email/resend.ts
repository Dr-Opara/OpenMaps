import { serverEnv } from "@/lib/env";
import { CONTACT_EMAIL } from "@/lib/site";
import type { EmailSendResult, EmailTemplate } from "./types";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const FROM = "OpenMaps <updates@openmaps.tech>";

/**
 * Sends via the Resend HTTP API using plain fetch (no SDK): runs unchanged on Cloudflare
 * Workers. SERVER ONLY: reads the RESEND_API_KEY secret at request time. Never throws — a
 * missing key or a provider failure must not cost a caller a valid waitlist signup, so every
 * outcome is returned as a result instead. Never logs the key or the raw provider response body.
 */
export async function sendEmail(to: string, template: EmailTemplate): Promise<EmailSendResult> {
  const apiKey = serverEnv("RESEND_API_KEY");
  if (!apiKey) {
    console.error("[email] RESEND_API_KEY not configured; skipping send");
    return { ok: false, reason: "not_configured" };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to,
        reply_to: CONTACT_EMAIL,
        subject: template.subject,
        html: template.html,
        text: template.text,
      }),
    });

    if (res.ok) return { ok: true };

    console.error("[email] Resend send failed", { status: res.status });
    return { ok: false, reason: "provider_error" };
  } catch (err) {
    console.error("[email] Resend request threw", err instanceof Error ? err.message : "unknown error");
    return { ok: false, reason: "provider_error" };
  }
}
