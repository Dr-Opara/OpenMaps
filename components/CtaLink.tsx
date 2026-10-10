"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

type Variant = "primary" | "secondary" | "small";

const styles: Record<Variant, string> = {
  primary:
    "h-12 px-6 sm:h-14 sm:px-8 bg-brand text-white font-semibold shadow-[0_6px_28px_-8px_rgba(47,123,255,0.9)] hover:bg-brand-hi active:bg-brand-press",
  secondary:
    "h-12 px-4 sm:h-14 sm:px-8 border border-brand/60 bg-ink/40 text-white font-medium hover:bg-brand/15",
  small: "h-9 px-4 sm:h-10 text-[13px] rounded-xl bg-brand text-white font-semibold hover:bg-brand-hi active:bg-brand-press",
};

export function CtaLink({
  href,
  location,
  variant = "primary",
  trackClick = false,
  className = "",
  children,
}: {
  href: string;
  /** Where on the page the link lives, sent with the analytics event. */
  location: string;
  variant?: Variant;
  trackClick?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={trackClick ? () => track("waitlist_cta_clicked", { location }) : undefined}
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan ${styles[variant]} ${className}`}
    >
      {children}
    </a>
  );
}
