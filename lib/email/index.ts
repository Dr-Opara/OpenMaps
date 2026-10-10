import { sendEmail } from "./resend";
import { earlyAccessInviteTemplate, launchUpdateTemplate, waitlistConfirmationTemplate } from "./templates";
import type { EmailSendResult } from "./types";

export type { EmailSendResult } from "./types";

/** Sent once, right after a *new* waitlist row is created. Never call this for a duplicate. */
export function sendWaitlistConfirmationEmail(to: string, smsOptIn: boolean): Promise<EmailSendResult> {
  return sendEmail(to, waitlistConfirmationTemplate(smsOptIn));
}

/**
 * Reusable for future early-access invitations. Nothing calls this automatically yet — wire it
 * up (e.g. an admin script that lists `openmaps_waitlist` rows) once an access URL exists, and
 * pass that URL in explicitly; it is intentionally not hardcoded here.
 */
export function sendEarlyAccessInviteEmail(to: string, accessUrl: string): Promise<EmailSendResult> {
  return sendEmail(to, earlyAccessInviteTemplate(accessUrl));
}

/** Reusable for future launch announcements. Nothing calls this automatically yet. */
export function sendLaunchUpdateEmail(to: string): Promise<EmailSendResult> {
  return sendEmail(to, launchUpdateTemplate());
}
