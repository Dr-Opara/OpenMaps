/**
 * Public site settings. EDIT HERE before launch (single place, no build-time env needed).
 * Both values are public by design: they appear on the page.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://openmaps.tech";

// Contact mailbox shown in the footer "Contact" link and the legal pages.
// Provided by the owner. If you ever empty it, the Contact link and the email lines
// are hidden automatically.
export const CONTACT_EMAIL = "hello@openmaps.tech";

// Full X profile URL, e.g. "https://x.com/yourhandle". Empty = footer link hidden.
export const X_URL = "https://x.com/openmaps_";

export const LEGAL_UPDATED = "October 9, 2026";
