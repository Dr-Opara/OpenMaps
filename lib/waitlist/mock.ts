import type { AddResult, WaitlistEntry, WaitlistStore } from "./types";

/**
 * Local-development store, used only when Supabase secrets are absent AND NODE_ENV is not
 * production. In-memory, so it exercises duplicate handling but forgets everything on restart.
 * (No Node fs APIs: this code must also be valid in the Workers runtime.) Logs nothing.
 */
export class MockWaitlistStore implements WaitlistStore {
  readonly name = "mock";
  private readonly seen = new Set<string>();

  async add(entry: WaitlistEntry): Promise<AddResult> {
    if (this.seen.has(entry.email)) return { status: "duplicate" };
    this.seen.add(entry.email);
    return { status: "created" };
  }
}
