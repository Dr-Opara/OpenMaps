import { normalizeUsPhone } from "@/lib/phone";
import type { WaitlistEntry, WaitlistSource } from "./types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeSource(raw: unknown): WaitlistSource {
  if (typeof raw !== "string") return "direct";
  const v = raw.trim().toLowerCase();
  if (!v) return "direct";
  if (v === "twitter" || v === "x" || v === "t.co") return "twitter";
  if (v === "direct") return "direct";
  return "other";
}

function clean(raw: unknown, max: number): string | null {
  if (typeof raw !== "string") return null;
  // strip control characters, collapse whitespace
  const v = raw.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  return v ? v.slice(0, max) : null;
}

export type ParseResult =
  | { ok: true; entry: WaitlistEntry; honeypot: false }
  | { ok: true; honeypot: true }
  | { ok: false; error: string };

export function parseSignup(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Invalid request." };
  const b = body as Record<string, unknown>;

  // Bots fill hidden fields; pretend success without storing anything.
  if (typeof b.company === "string" && b.company.trim() !== "") {
    return { ok: true, honeypot: true };
  }

  const email = clean(b.email, 254)?.toLowerCase() ?? "";
  if (!EMAIL_RE.test(email)) return { ok: false, error: "Please enter a valid email address." };

  // Phone is only collected (and only validated) for SMS consent: unchecked, the field is
  // ignored outright rather than stored unused, regardless of what's typed into it.
  const smsOptIn = b.smsOptIn === true;
  let phoneNumber: string | null = null;
  if (smsOptIn) {
    const rawPhone = clean(b.phoneNumber, 20);
    phoneNumber = rawPhone ? normalizeUsPhone(rawPhone) : null;
    if (!phoneNumber) return { ok: false, error: "A valid phone number is required to receive text updates." };
  }

  return {
    ok: true,
    honeypot: false,
    entry: {
      email,
      firstName: clean(b.firstName, 60),
      cityState: clean(b.cityState, 80),
      alphaInterest: b.alphaInterest === true,
      phoneNumber,
      smsOptIn,
      source: normalizeSource(b.source),
    },
  };
}
