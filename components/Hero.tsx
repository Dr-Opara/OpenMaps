import { PlatformNote } from "./Brand";
import { ConceptImage } from "./ConceptImage";
import { ConceptPhone } from "./PhoneFrame";
import { CtaLink } from "./CtaLink";
import { IconArrow, IconCamera, IconGrid, IconMap, IconParking, IconPlaces, IconTraffic, IconWeather } from "./Icons";
import { CONCEPTS } from "@/lib/concepts";
import type { ReactNode } from "react";

const TILE = {
  green: "border-live/40 bg-live/15 text-live",
  blue: "border-brand/40 bg-brand/20 text-brand-hi",
} as const;

const SIDE: { title: string; sub: string; icon: ReactNode; tone: keyof typeof TILE }[] = [
  { title: "Live\nAR Navigation", sub: "See the road ahead", icon: <IconCamera />, tone: "green" },
  { title: "Map", sub: "Plan your route", icon: <IconMap />, tone: "blue" },
  { title: "Traffic", sub: "Real-time conditions", icon: <IconTraffic />, tone: "blue" },
  { title: "Parking", sub: "Find and compare", icon: <IconParking />, tone: "blue" },
  { title: "Places", sub: "Restaurants, gas, more", icon: <IconPlaces />, tone: "green" },
  { title: "Weather", sub: "See what's ahead", icon: <IconWeather />, tone: "blue" },
];

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden px-4 pb-0 pt-[4.5rem] sm:px-6 md:pt-28">
      {/* Atmosphere: the highway concept, heavily blurred and darkened, like the reference's skyline */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-[88%] overflow-hidden">
        <ConceptImage src={CONCEPTS.hero} alt="" label="" sizes="100vw" className="scale-125 blur-[14px] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/60 to-ink" />
      </div>

      <div className="mx-auto grid max-w-6xl items-start gap-6 md:grid-cols-[1.15fr_0.85fr] lg:grid-cols-[1.1fr_0.85fr_0.55fr]">
        <div className="pt-3 md:pt-10">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="pill"><IconGrid />Mobile navigation</span>
            <span className="pill"><span className="dot-live" />U.S. Alpha</span>
          </div>
          <h1 className="text-[2.75rem] font-bold leading-[1.0] tracking-tight sm:text-6xl lg:text-7xl">
            See What&rsquo;s
            <br />
            <span className="text-brand">Ahead</span>
          </h1>
          <p className="mt-4 max-w-md text-[1.0625rem] font-medium leading-snug text-white/90 sm:text-2xl">
            A live view of the road, route and world around you.
          </p>
          <p className="mt-3 hidden max-w-md text-base leading-relaxed text-white/65 sm:block">
            OpenMaps is a camera-first navigation experience that brings directions, road intelligence, places and
            what matters ahead into one view.
          </p>
          <div className="mt-5 flex gap-2.5 sm:mt-7 sm:gap-3">
            <CtaLink href="#waitlist" location="hero" trackClick className="flex-1 sm:flex-none">
              Join the Alpha <IconArrow />
            </CtaLink>
            <CtaLink href="#experience" location="hero_explore" variant="secondary" className="flex-1 sm:flex-none">
              Explore OpenMaps
            </CtaLink>
          </div>
          <PlatformNote className="mt-5" />
        </div>

        {/* The phone: OpenMaps is a mobile product */}
        <div className="flex justify-center md:pt-4">
          <ConceptPhone
            src={CONCEPTS.hero}
            alt="OpenMaps on a phone: live AR navigation on a highway with lane guidance, next exit, traffic and speed"
            label="OpenMaps · Live Mode"
            priority
            sizes="(min-width: 1024px) 330px, 300px"
            className="w-[250px] sm:w-[290px] lg:w-[330px]"
          />
        </div>

        <ul className="hidden gap-2.5 lg:grid lg:pt-6" aria-label="OpenMaps features">
          {SIDE.map((f) => (
            <li key={f.title} className="panel flex items-center gap-3 rounded-2xl p-2.5">
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${TILE[f.tone]}`}>{f.icon}</span>
              <span className="min-w-0">
                <span className="block whitespace-pre-line text-[14px] font-semibold leading-tight">{f.title}</span>
                <span className="mt-0.5 block text-[12px] leading-tight text-white/55">{f.sub}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
