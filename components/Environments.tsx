"use client";

import { useEffect, useRef } from "react";
import { ConceptPhone } from "./PhoneFrame";
import { ENVIRONMENTS } from "@/lib/concepts";
import { track } from "@/lib/analytics";

export function Environments() {
  const ref = useRef<HTMLElement>(null);

  // Fire once when the gallery is meaningfully on screen.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("concept_gallery_viewed");
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="concept" ref={ref} aria-labelledby="envs" className="scroll-mt-20 bg-paper px-4 py-14 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Different places. Same OpenMaps.</p>
          <h2 id="envs" className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-5xl">Built for every road.</h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] text-ink-soft">
            Real-world navigation designed for how you actually drive.
          </p>
        </div>

        <ul className="mt-9 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {ENVIRONMENTS.map((e) => (
            <li key={e.id} className="panel overflow-hidden rounded-3xl">
              {/* Phone is cropped by the card, like the reference */}
              <div className="relative flex h-[250px] justify-center overflow-hidden bg-surface px-3 pt-4 sm:h-[330px] lg:h-[310px]">
                <ConceptPhone
                  src={e.image}
                  alt={e.alt}
                  label={e.title}
                  sizes="(min-width: 1024px) 200px, 160px"
                  className="w-[78%] max-w-[210px] shrink-0"
                />
              </div>
              <div className="px-4 pb-5 pt-3">
                <h3 className="text-[13px] font-bold uppercase tracking-[0.12em] text-brand">{e.title}</h3>
                <p className="mt-1.5 text-[14px] leading-snug text-ink-soft">{e.line}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-ink-soft/70">Concept imagery. The final interface will differ.</p>
      </div>
    </section>
  );
}
