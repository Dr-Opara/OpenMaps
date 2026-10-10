import type { ReactNode } from "react";
import { ConceptPhone } from "./PhoneFrame";
import { MapPhone } from "./MapScreen";
import { IconCamera, IconMap } from "./Icons";
import { CONCEPTS } from "@/lib/concepts";

function ModeCard({
  phone,
  icon,
  tone,
  title,
  subtitle,
  body,
}: {
  phone: ReactNode;
  icon: ReactNode;
  tone: string;
  title: string;
  subtitle: string;
  body: string;
}) {
  return (
    <article className="panel relative flex min-h-[230px] items-center overflow-hidden rounded-3xl">
      {/* Phone hangs from the top-left and is cropped by the card, like the reference */}
      <div className="relative -mb-24 self-start px-4 pt-5 sm:px-6">{phone}</div>
      <div className="min-w-0 py-6 pr-5 sm:pr-8">
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl border ${tone}`}>{icon}</span>
        <h3 className="mt-3 text-2xl font-bold">{title}</h3>
        <p className="mt-1 text-[15px] text-white/80">{subtitle}</p>
        <p className="mt-3 text-[14px] leading-snug text-white/60">{body}</p>
      </div>
    </article>
  );
}

export function Modes() {
  return (
    <section aria-labelledby="modes" className="px-4 py-14 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-hi">Camera-first. Map-based. Together.</p>
          <h2 id="modes" className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            Two ways to <span className="text-brand">navigate.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/70">
            Get a live view of the world, or plan and explore the bigger picture.
          </p>
        </div>

        <div className="mt-9 grid gap-3 md:grid-cols-2">
          <ModeCard
            phone={
              <ConceptPhone
                src={CONCEPTS.live}
                alt="OpenMaps Live Mode on a phone: camera-first AR navigation"
                label="Live Mode"
                sizes="160px"
                className="w-[130px] shrink-0 sm:w-[150px]"
              />
            }
            icon={<IconCamera />}
            tone="border-live/40 bg-live/15 text-live"
            title="Live"
            subtitle="Camera-first AR navigation."
            body="See directions, road context, traffic, parking and what matters ahead directly through your camera."
          />
          <ModeCard
            phone={<MapPhone className="w-[130px] shrink-0 sm:w-[150px]" />}
            icon={<IconMap />}
            tone="border-brand/40 bg-brand/20 text-brand-hi"
            title="Map"
            subtitle="Traditional route planning."
            body="Plan, explore and understand the bigger picture."
          />
        </div>
      </div>
    </section>
  );
}
