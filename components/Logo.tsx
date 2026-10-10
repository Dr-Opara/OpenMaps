// Natural aspect ratio of /public/openmaps-mark.png (1371×1887), used to size it without
// redrawing or reinterpreting the official mark.
const MARK_ASPECT = 1371 / 1887;

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <img
      src="/openmaps-mark.png"
      alt=""
      aria-hidden="true"
      width={Math.round(size * MARK_ASPECT)}
      height={size}
      className="inline-block shrink-0"
    />
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
