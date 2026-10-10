/**
 * Minimal analytics abstraction. No vendor, no cost.
 * Events are forwarded to whatever is already on the page (Plausible, GA4) and
 * logged in development. Add a provider later by extending `sinks`.
 */
export type AnalyticsEvent =
  | "waitlist_cta_clicked"
  | "waitlist_submitted"
  | "concept_gallery_viewed";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Props }) => void;
    gtag?: (command: "event", event: string, params?: Props) => void;
  }
}

type Sink = (event: AnalyticsEvent, props: Props) => void;

const sinks: Sink[] = [
  (event, props) => window.plausible?.(event, { props }),
  (event, props) => window.gtag?.("event", event, props),
  (event, props) => {
    if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, props);
  },
];

export function track(event: AnalyticsEvent, props: Props = {}): void {
  if (typeof window === "undefined") return;
  for (const sink of sinks) {
    try {
      sink(event, props);
    } catch {
      /* analytics must never break the page */
    }
  }
}
