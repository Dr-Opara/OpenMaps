import { Wordmark } from "./Logo";
import { CONTACT_EMAIL, INSTAGRAM_URL, X_URL } from "@/lib/site";

const LINKS = [
  ...(X_URL ? [{ label: "X", href: X_URL, external: true }] : []),
  ...(INSTAGRAM_URL ? [{ label: "Instagram", href: INSTAGRAM_URL, external: true }] : []),
  { label: "Privacy", href: "/privacy", external: false },
  { label: "Terms", href: "/terms", external: false },
  ...(CONTACT_EMAIL ? [{ label: "Contact", href: `mailto:${CONTACT_EMAIL}`, external: false }] : []),
];

export function Footer() {
  return (
    <footer className="surface-dark border-t border-white/10 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Wordmark />
          <span className="hidden h-4 w-px bg-white/15 sm:block" />
          <span className="text-sm text-white/55">See What&rsquo;s Ahead</span>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/60">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex min-h-10 items-center hover:text-white"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
