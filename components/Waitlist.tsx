import { WaitlistForm } from "./WaitlistForm";

export function Waitlist() {
  return (
    <section id="waitlist" aria-labelledby="waitlist-h" className="scroll-mt-20 bg-surface-blue px-4 py-14 sm:px-6 md:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-12">
        <div>
          <h2 id="waitlist-h" className="text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Be first to experience OpenMaps.
          </h2>
          <p className="mt-4 max-w-sm text-[15px] text-ink-soft">
            Get notified when OpenMaps is ready and help shape what comes next.
          </p>
        </div>
        <WaitlistForm />
      </div>
    </section>
  );
}
