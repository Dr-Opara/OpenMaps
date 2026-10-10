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
    // Normalized again here (not just trusted from the caller) so every DB operation this
    // class performs — lookup, insert, patch — is keyed on the exact same string.
    const email = entry.email.trim().toLowerCase();

    // Authoritative duplicate check: look the row up first, rather than inferring "duplicate"
    // solely from how the insert call happens to fail. The unique index on email remains a
    // second line of defense below (see the 409 branch) for the race between this lookup and
    // the insert, but it is not the only mechanism.
    if (await this.findByEmail(email)) {
      if (entry.smsOptIn && entry.phoneNumber) await this.recordSmsConsent(email, entry.phoneNumber);
      return { status: "duplicate" };
    }

    const res = await fetch(`${this.url.replace(/\/$/, "")}/rest/v1/openmaps_waitlist`, {
      method: "POST",
      headers: {
        apikey: this.serviceRoleKey,
        Authorization: `Bearer ${this.serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        email,
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

    // 23505 = unique_violation (openmaps_waitlist_email_key) -> HTTP 409. Only reachable if a
    // concurrent request inserted the same email between the lookup above and this insert.
    if (res.status === 409) {
      // A returning member who newly opts in to SMS gets that consent recorded on their
      // existing row. A returning member who does NOT opt in this time is left untouched —
      // resubmitting the form is never a way to clear a prior opt-in to false.
      if (entry.smsOptIn && entry.phoneNumber) await this.recordSmsConsent(email, entry.phoneNumber);
      return { status: "duplicate" };
    }

    // Never forward Supabase error bodies to the client; log status only.
    throw new Error(`Supabase insert failed with HTTP ${res.status}`);
  }

  /** True if a row with this (already normalized) email exists. Throws on a failed lookup
   * rather than assuming "no row" — a broken lookup must not silently risk a duplicate insert. */
  private async findByEmail(email: string): Promise<boolean> {
    const res = await fetch(
      `${this.url.replace(/\/$/, "")}/rest/v1/openmaps_waitlist?email=eq.${encodeURIComponent(email)}&select=id&limit=1`,
      {
        headers: {
          apikey: this.serviceRoleKey,
          Authorization: `Bearer ${this.serviceRoleKey}`,
        },
      },
    );
    if (!res.ok) throw new Error(`Supabase lookup failed with HTTP ${res.status}`);
    const rows = (await res.json()) as unknown[];
    return rows.length > 0;
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
