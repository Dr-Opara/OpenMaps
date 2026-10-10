"use client";

import Image from "next/image";
import { useState } from "react";
import { LogoMark } from "./Logo";

function Placeholder({ label, note, alt }: { label: string; note: string; alt: string }) {
  return (
    <div
      role="img"
      aria-label={alt}
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-navy-800 to-navy-950 px-6 text-center"
    >
      <LogoMark size={44} />
      <span className="text-sm font-medium text-white/80">{label}</span>
      <span className="text-xs text-white/45">{note}</span>
    </div>
  );
}

/** Concept image from /public/concepts. `src={null}` renders the "coming soon" panel. */
export function ConceptImage({
  src,
  alt,
  label,
  priority = false,
  sizes,
  className = "",
  fit = "cover",
}: {
  src: string | null;
  alt: string;
  label: string;
  priority?: boolean;
  sizes: string;
  className?: string;
  fit?: "cover" | "contain";
}) {
  const [failed, setFailed] = useState(false);

  if (!src) return <Placeholder label={label} note="Concept coming soon" alt={alt} />;
  if (failed) return <Placeholder label={label} note="Concept image unavailable" alt={alt} />;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`${fit === "contain" ? "object-contain" : "object-cover"} ${className}`}
      onError={() => {
        console.warn(`[OpenMaps] Missing concept image: ${src}`);
        setFailed(true);
      }}
    />
  );
}
