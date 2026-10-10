import { CtaLink } from "./CtaLink";
import { Wordmark } from "./Logo";
import { XGlyph } from "./Brand";
import { X_URL } from "@/lib/site";

/** Thin dark-glass bar. `base="/"` on non-home pages. */
export function Header({ base = "" }: { base?: "" | "/" }) {
  const link =
    "hidden h-9 items-center rounded-lg border border-line bg-white/[0.03] px-4 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white sm:inline-flex";
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <div className="panel mx-auto flex h-12 max-w-6xl items-center justify-between rounded-2xl pl-4 pr-1.5 sm:h-14">
        <a href={base || "#top"} aria-label="OpenMaps home"><Wordmark /></a>
        <nav aria-label="Primary" className="flex items-center gap-2">
          <a href={`${base}#concept`} className={link}>Concept</a>
          <a href={`${base}#waitlist`} className={link}>Alpha</a>
          {X_URL && (
            <a href={X_URL} target="_blank" rel="noopener noreferrer" aria-label="OpenMaps on X" className={`${link} px-3`}>
              <XGlyph />
            </a>
          )}
          <CtaLink href={`${base}#waitlist`} location="header" variant="small" trackClick>
            Join the Alpha
          </CtaLink>
        </nav>
      </div>
    </header>
  );
}
