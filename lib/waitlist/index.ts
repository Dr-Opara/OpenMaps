import { isProduction, serverEnv } from "@/lib/env";
import { MockWaitlistStore } from "./mock";
import { SupabaseWaitlistStore } from "./supabase";
import type { WaitlistStore } from "./types";

// Dev-only singleton so the in-memory mock remembers duplicates between requests.
let devMock: MockWaitlistStore | undefined;

/**
 * Returns the store for THIS request. Built per request (cheap) so secrets are read from the
 * request-time environment, which is what Workers guarantees. Returns null when production has
 * no Supabase configuration: signups then fail loudly (503) rather than being dropped.
 */
export function getWaitlistStore(): WaitlistStore | null {
  const url = serverEnv("SUPABASE_URL");
  const key = serverEnv("SUPABASE_SERVICE_ROLE_KEY");
  if (url && key) return new SupabaseWaitlistStore(url, key);
  if (!isProduction()) return (devMock ??= new MockWaitlistStore());
  return null;
}
