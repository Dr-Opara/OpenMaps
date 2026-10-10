/**
 * Lightweight U.S. phone validation/normalization — no external dependency. Accepts common
 * separators (spaces, dashes, dots, parens) and an optional leading +1/1 country code, and
 * returns E.164 (+1XXXXXXXXXX) or null when the input isn't a plausible 10-digit NANP number.
 */
export function normalizeUsPhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const digitsOnly = trimmed.replace(/\D/g, "");

  let national: string;
  if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
    national = digitsOnly.slice(1);
  } else if (digitsOnly.length === 10) {
    national = digitsOnly;
  } else {
    return null;
  }

  // NANP: area code and central-office code can't start with 0 or 1.
  if (!/^[2-9]\d{2}[2-9]\d{6}$/.test(national)) return null;

  return `+1${national}`;
}
