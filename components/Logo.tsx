export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" aria-hidden="true">
      <defs>
        <linearGradient id="om-pin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5FE3FF" />
          <stop offset="1" stopColor="#2F7BFF" />
        </linearGradient>
      </defs>
      <path
        d="M512 880C512 880 270 660 270 430A242 242 0 1 1 754 430C754 660 512 880 512 880Z"
        fill="url(#om-pin)"
      />
      <circle cx="512" cy="430" r="92" fill="#050a14" />
    </svg>
  );
}

export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span className="text-[19px] font-semibold tracking-tight">OpenMaps</span>
    </span>
  );
}
