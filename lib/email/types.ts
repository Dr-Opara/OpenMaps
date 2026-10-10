export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export type EmailSendResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "provider_error" };
