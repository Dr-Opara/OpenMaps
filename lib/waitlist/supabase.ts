import type { AddResult, WaitlistEntry, WaitlistStore } from "./types";

/**
 * Supabase via PostgREST using plain fetch (runs unchanged on Cloudflare Workers, no SDK).
 * SERVER ONLY: uses the service-role key (a Cloudflare secret). Never import this from a client
 * component and never log the key, the URL or Supabase response bodies.
 */
export class SupabaseWaitlistStore implements WaitlistStore {
  readonly name = "supabase";

  constructor(
    private readonly url: string,
    private readonly serviceRoleKey: string,
  ) {
    // Defense in depth: this class must never be bundled for the browser.
    if (typeof window !== "undefined") throw new Error("SupabaseWaitlistStore is server-only");
  }

  async add(entry: WaitlistEntry): Promise<AddResult> {
    const res = await fetch(`${this.url.replace(/\/$/, "")}/rest/v1/openmaps_waitlist`, {
      method: "POST",
      headers: {
        apikey: this.serviceRoleKey,
        Authorization: `Bearer ${this.serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email: entry.email,
        first_name: entry.firstName,
        android_phone: entry.androidPhone,
        city_state: entry.cityState,
        alpha_interest: entry.alphaInterest,
        source: entry.source,
      }),
    });

    if (res.ok) return { status: "created" };

    // 23505 = unique_violation (the lower(email) unique index) -> HTTP 409.
    if (res.status === 409) return { status: "duplicate" };

    // Never forward Supabase error bodies to the client; log status only.
    throw new Error(`Supabase insert failed with HTTP ${res.status}`);
  }
}
