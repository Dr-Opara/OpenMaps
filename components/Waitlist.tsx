import { PlatformNote } from "./Brand";
import { WaitlistForm } from "./WaitlistForm";

export function Waitlist() {
  return (
    <section id="waitlist" aria-labelledby="waitlist-h" className="scroll-mt-20 px-4 py-14 sm:px-6 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-hi">Early access</p>
          <h2 id="waitlist-h" className="mt-2 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            Be first to experience OpenMaps.
          </h2>
          <p className="mt-4 max-w-sm text-[15px] text-white/70">
            Join the Android Alpha and help shape the future of navigation.
          </p>
          <PlatformNote className="mt-5" />
        </div>
        <WaitlistForm />
      </div>
    </section>
  );
}
