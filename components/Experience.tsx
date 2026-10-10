import type { ReactNode } from "react";
import { IconCamera, IconLanes, IconLayers, IconParking, IconPlaces, IconTraffic, IconWeather } from "./Icons";

const TILE = {
  green: "border-live/40 bg-live/15 text-live",
  blue: "border-brand/40 bg-brand/20 text-brand-hi",
} as const;

const ITEMS: { title: string; sub: string; icon: ReactNode; tone: keyof typeof TILE }[] = [
  { title: "Live Navigation", sub: "See the road ahead", icon: <IconCamera />, tone: "green" },
  { title: "Traffic", sub: "Real-time conditions", icon: <IconTraffic />, tone: "blue" },
  { title: "Parking", sub: "Find and compare", icon: <IconParking />, tone: "blue" },
  { title: "Places", sub: "Discover what's around you", icon: <IconPlaces />, tone: "green" },
  { title: "Lane Guidance", sub: "Stay in the right lane", icon: <IconLanes />, tone: "blue" },
  { title: "Weather", sub: "See conditions ahead", icon: <IconWeather />, tone: "blue" },
  { title: "Road Intelligence", sub: "More context, better decisions", icon: <IconLayers />, tone: "blue" },
];

export function Experience() {
  return (
    <section id="experience" aria-labelledby="exp" className="scroll-mt-20 px-4 pb-16 pt-14 sm:px-6 md:pb-20 md:pt-16">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-hi">Built for the real world</p>
        <h2 id="exp" className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
          One view. <span className="text-brand">Everything that matters.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-[15px] text-white/70">
          Live navigation, real-time conditions, places, and more &mdash; all in one experience.
        </p>

        <ul className="mt-9 grid grid-cols-2 gap-2.5 text-left lg:grid-cols-7">
          {ITEMS.map((it, i) => (
            <li
              key={it.title}
              className={`panel flex items-center gap-3 rounded-2xl p-3 ${i === ITEMS.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${TILE[it.tone]}`}>{it.icon}</span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold leading-tight">{it.title}</span>
                <span className="mt-0.5 block text-[11px] leading-tight text-white/55">{it.sub}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-white/40">In development. Layers arrive through the Alpha, not all at once.</p>
      </div>
    </section>
  );
}
