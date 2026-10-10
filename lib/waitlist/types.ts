export type WaitlistSource = "twitter" | "direct" | "other";

export interface WaitlistEntry {
  email: string;
  firstName: string | null;
  androidPhone: string | null;
  cityState: string | null;
  alphaInterest: boolean;
  source: WaitlistSource;
}

export type AddResult = { status: "created" } | { status: "duplicate" };

/** Anything that can persist a signup. Swap implementations without touching the route. */
export interface WaitlistStore {
  readonly name: string;
  add(entry: WaitlistEntry): Promise<AddResult>;
}
