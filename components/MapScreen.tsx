import { PhoneFrame } from "./PhoneFrame";

/** Map Mode phone screen, drawn as one SVG so it scales with the phone. Illustrative, not real data. */
export function MapPhone({ className = "" }: { className?: string }) {
  return (
    <PhoneFrame className={className}>
      <svg viewBox="0 0 270 510" className="absolute inset-0 h-full w-full" role="img" aria-label="OpenMaps Map Mode on a phone: search bar, route overview and map" preserveAspectRatio="xMidYMid slice">
        <rect width="270" height="510" fill="#0a1523" />
        <g stroke="#14263d" strokeWidth="9" fill="none" strokeLinecap="round">
          <path d="M-10 150H280M-10 270H280M-10 390H280M-10 500H280M50-10V580M135-10V580M220-10V580" />
        </g>
        <g stroke="#0f1f33" strokeWidth="4" fill="none"><path d="M-10 90H280M-10 210H280M-10 330H280M-10 445H280M92-10V580M178-10V580" /></g>
        <path d="M-10 120C60 150 100 250 140 300S230 380 260 580" stroke="#fff" strokeOpacity=".07" strokeWidth="12" fill="none" strokeLinecap="round" />
        <path d="M50 470V390H135V270H220V190" stroke="#2F7BFF" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 470V390H135V270H220V190" stroke="#5FE3FF" strokeOpacity=".4" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M50 452l10 24-10-6-10 6z" fill="#fff" />
        <path d="M220 190m0-18a15 15 0 0 1 15 15c0 11-15 24-15 24s-15-13-15-24a15 15 0 0 1 15-15z" fill="#2F7BFF" />
        <circle cx="220" cy="187" r="5" fill="#fff" />
        {/* search */}
        <rect x="16" y="44" width="238" height="30" rx="15" fill="#0b1626" fillOpacity=".92" stroke="#82a0d2" strokeOpacity=".3" />
        <circle cx="34" cy="59" r="5" fill="none" stroke="#9fb6d9" strokeWidth="1.5" />
        <path d="M38 63l4 4" stroke="#9fb6d9" strokeWidth="1.5" strokeLinecap="round" />
        <text x="50" y="63" fontSize="10" fill="#c9d6ea" fontFamily="sans-serif">Where do you want to go?</text>
        {/* Live | Map toggle, Map active */}
        <rect x="170" y="84" width="84" height="24" rx="12" fill="#0b1626" fillOpacity=".92" stroke="#82a0d2" strokeOpacity=".3" />
        <text x="184" y="100" fontSize="9" fill="#9fb6d9" fontFamily="sans-serif">Live</text>
        <rect x="208" y="87" width="43" height="18" rx="9" fill="#2F7BFF" />
        <text x="220" y="100" fontSize="9" fontWeight="600" fill="#fff" fontFamily="sans-serif">Map</text>
      </svg>
    </PhoneFrame>
  );
}
