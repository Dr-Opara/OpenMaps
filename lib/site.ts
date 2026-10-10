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

// Full Instagram profile URL. Empty = header link hidden.
export const INSTAGRAM_URL = "https://www.instagram.com/openmaps.tech";

// Kept separate so editing one legal page's date doesn't falsely imply the other changed too.
export const PRIVACY_UPDATED = "October 10, 2026";
export const TERMS_UPDATED = "October 10, 2026";
