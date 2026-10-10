import { serverEnv } from "@/lib/env";

export interface SmsRecipient {
  phoneNumber: string; // E.164
}

/**
 * Read-only: returns everyone currently eligible for a future SMS launch notification —
 * sms_opt_in = true AND phone_number IS NOT NULL. Does not send anything, and nothing in this
 * codebase calls it. SERVER ONLY: uses the Supabase service-role key. Never log the returned
 * phone numbers.
 */
export async function getSmsLaunchRecipients(): Promise<SmsRecipient[]> {
  const url = serverEnv("SUPABASE_URL");
  const key = serverEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return [];

  const res = await fetch(
    `${url.replace(/\/$/, "")}/rest/v1/openmaps_waitlist?select=phone_number&sms_opt_in=eq.true&phone_number=not.is.null`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    },
  );

  if (!res.ok) {
    console.error("[sms] failed to load launch recipients", { status: res.status });
    return [];
  }

  const rows = (await res.json()) as Array<{ phone_number: string | null }>;
  return rows
    .filter((row): row is { phone_number: string } => typeof row.phone_number === "string" && row.phone_number.length > 0)
    .map((row) => ({ phoneNumber: row.phone_number }));
}
