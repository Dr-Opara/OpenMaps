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
        city_state: entry.cityState,
        alpha_interest: entry.alphaInterest,
        phone_number: entry.phoneNumber,
        sms_opt_in: entry.smsOptIn,
        sms_opt_in_at: entry.smsOptIn ? new Date().toISOString() : null,
        source: entry.source,
      }),
    });

    if (res.ok) return { status: "created" };

    // 23505 = unique_violation (the lower(email) unique index) -> HTTP 409.
    if (res.status === 409) {
      // A returning member who newly opts in to SMS gets that consent recorded on their
      // existing row. A returning member who does NOT opt in this time is left untouched —
      // resubmitting the form is never a way to clear a prior opt-in to false.
      if (entry.smsOptIn && entry.phoneNumber) await this.recordSmsConsent(entry.email, entry.phoneNumber);
      return { status: "duplicate" };
    }

    // Never forward Supabase error bodies to the client; log status only.
    throw new Error(`Supabase insert failed with HTTP ${res.status}`);
  }

  /**
   * Best-effort: a failure here must not surface as a failed signup (the base row already
   * exists), so it is caught and logged rather than thrown. Never logs the phone number.
   */
  private async recordSmsConsent(email: string, phoneNumber: string): Promise<void> {
    try {
      const res = await fetch(
        `${this.url.replace(/\/$/, "")}/rest/v1/openmaps_waitlist?email=eq.${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: {
            apikey: this.serviceRoleKey,
            Authorization: `Bearer ${this.serviceRoleKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
          },
          body: JSON.stringify({
            phone_number: phoneNumber,
            sms_opt_in: true,
            sms_opt_in_at: new Date().toISOString(),
          }),
        },
      );
      if (!res.ok) console.error("[waitlist] sms consent update failed", { status: res.status });
    } catch (err) {
      console.error("[waitlist] sms consent update threw", err instanceof Error ? err.message : "unknown error");
    }
  }
}
