export type WaitlistSource = "twitter" | "direct" | "other";

export interface WaitlistEntry {
  email: string;
  firstName: string | null;
  cityState: string | null;
  alphaInterest: boolean;
  /** E.164, only ever set when smsOptIn is true. */
  phoneNumber: string | null;
  smsOptIn: boolean;
  source: WaitlistSource;
}

export type AddResult = { status: "created" } | { status: "duplicate" };

/** Anything that can persist a signup. Swap implementations without touching the route. */
export interface WaitlistStore {
  readonly name: string;
  add(entry: WaitlistEntry): Promise<AddResult>;
}
