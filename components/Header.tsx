import { CtaLink } from "./CtaLink";
import { Wordmark } from "./Logo";
import { InstagramGlyph, XGlyph } from "./Brand";
import { INSTAGRAM_URL, X_URL } from "@/lib/site";

/** Thin light bar. `base="/"` on non-home pages. Icon + "OpenMaps" only — no tagline here. */
export function Header({ base = "" }: { base?: "" | "/" }) {
  const link =
    "hidden h-9 items-center rounded-lg px-4 text-[13px] font-medium text-ink-soft transition-colors hover:bg-surface hover:text-ink sm:inline-flex";
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between rounded-2xl border border-line bg-white/85 pl-4 pr-1.5 text-ink shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.2)] backdrop-blur-md sm:h-14">
        <a href={base || "#top"} aria-label="OpenMaps home"><Wordmark /></a>
        <nav aria-label="Primary" className="flex items-center gap-2">
          <a href={`${base}#concept`} className={link}>Concept</a>
          <a href={`${base}#waitlist`} className={link}>Early Access</a>
          {X_URL && (
            <a href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="OpenMaps on X" className={`${link} px-3`}>
              <XGlyph />
            </a>
          )}
          {INSTAGRAM_URL && (
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="OpenMaps on Instagram" className={`${link} px-3`}>
              <InstagramGlyph />
            </a>
          )}
          <CtaLink href={`${base}#waitlist`} location="header" variant="small" trackClick>
            <span className="sm:hidden">Join</span>
            <span className="hidden sm:inline">Join Early Access</span>
          </CtaLink>
        </nav>
      </div>
    </header>
  );
}
