import type { ReactNode } from "react";
import { ConceptImage } from "./ConceptImage";

/** A phone. OpenMaps is always shown as a mobile product, never as a desktop app. */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative rounded-[2.4rem] bg-[#04070d] p-[5px] shadow-[0_0_0_1px_rgba(15,23,42,0.08),0_24px_48px_-20px_rgba(15,23,42,0.35)] ${className}`}
    >
      <div className="relative aspect-[9/15] overflow-hidden rounded-[2.05rem] bg-[#07101c]">
        {children}
        <span className="absolute left-1/2 top-[1.5%] z-20 h-[2.4%] w-[27%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  );
}

/**
 * Phone showing a concept screenshot. The concept images are 4:5, so the phone screen is
 * a 9:15 window onto the centre of the image: every card, sign and control stays readable.
 */
export function ConceptPhone({
  src,
  alt,
  label,
  priority = false,
  sizes,
  className = "",
}: {
  src: string;
  alt: string;
  label: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  return (
    <PhoneFrame className={className}>
      <ConceptImage src={src} alt={alt} label={label} priority={priority} sizes={sizes} className="object-[50%_0%]" />
    </PhoneFrame>
  );
}
