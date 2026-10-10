import type { ReactNode } from "react";

export const XGlyph = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/** Distribution note used under the hero and in the waitlist section. */
export function PlatformNote({ className = "" }: { className?: string }): ReactNode {
  return (
    <p className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-ink-soft ${className}`}>
      <span>Install directly from the web</span>
      <span className="hidden h-4 w-px bg-line sm:block" />
      <span>No app store required</span>
    </p>
  );
}
