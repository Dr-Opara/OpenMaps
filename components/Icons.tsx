import type { ReactNode } from "react";

const base = {
  viewBox: "0 0 24 24",
  width: 22,
  height: 22,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};
const I = ({ children }: { children: ReactNode }) => <svg {...base}>{children}</svg>;

export const IconCamera = () => (<I><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" /><circle cx="12" cy="12" r="3" /></I>);
export const IconTraffic = () => (<I><path d="M5 16l1.5-5a2 2 0 0 1 1.9-1.4h7.2a2 2 0 0 1 1.9 1.4L19 16" /><rect x="4" y="16" width="16" height="3.5" rx="1.5" /><path d="M7 19.5V21M17 19.5V21" /></I>);
export const IconParking = () => (<I><rect x="4" y="4" width="16" height="16" rx="4" /><path d="M10 17V8h3.2a2.6 2.6 0 0 1 0 5.2H10" /></I>);
export const IconPlaces = () => (<I><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></I>);
export const IconLanes = () => (<I><path d="M8 21 10 3M16 21l-2-18" /><path d="M12 5v2.5M12 11v2.5M12 17v2.5" /></I>);
export const IconWeather = () => (<I><path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 8.5 4 4 0 0 1 17.5 18H7z" /></I>);
export const IconLayers = () => (<I><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /></I>);
export const IconMap = () => (<I><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" /></I>);
export const IconArrow = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconGrid = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /></svg>
);
