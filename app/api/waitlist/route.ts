import { sendWaitlistConfirmationEmail } from "@/lib/email";
import { getWaitlistStore } from "@/lib/waitlist";
import { parseSignup } from "@/lib/waitlist/validate";

export const dynamic = "force-dynamic";

// Best-effort per-isolate rate limit (each Worker isolate has its own memory). Real abuse protection
// is a Cloudflare WAF rate-limiting rule on POST /api/waitlist; see README.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
const hits = new Map<string, { count: number; reset: number }>();

function limited(ip: string): boolean {
  const now = Date.now();
  if (hits.size > 5_000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  const h = hits.get(ip);
  if (!h || h.reset < now) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  h.count += 1;
  return h.count > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  // Cloudflare sets cf-connecting-ip to the real client address.
  const ip =
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  if (limited(ip)) {
    return Response.json({ ok: false, error: "Too many attempts. Try again in a minute." }, { status: 429 });
  }

  // Signups are tiny; refuse oversized bodies before parsing.
  const len = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(len) && len > 10_000) {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = parseSignup(body);
  if (!parsed.ok) return Response.json({ ok: false, error: parsed.error }, { status: 400 });
  if (parsed.honeypot) return Response.json({ ok: true });

  const store = getWaitlistStore();
  if (!store) {
    console.error("[waitlist] No store configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
    return Response.json(
      { ok: false, error: "Signups are temporarily unavailable. Please try again soon." },
      { status: 503 },
    );
  }

  try {
    const result = await store.add(parsed.entry);
    // Duplicates get the same success response, so the form can't be used to probe who is signed up.
    // The row is already committed at this point: an email failure below must never turn into
    // a failure response, or a valid signup would look lost to the visitor who submitted it.
    if (result.status === "created") {
      try {
        const emailResult = await sendWaitlistConfirmationEmail(parsed.entry.email, parsed.entry.smsOptIn);
        if (!emailResult.ok) console.error("[waitlist] confirmation email not sent", { reason: emailResult.reason });
      } catch (err) {
        console.error("[waitlist] confirmation email threw", err instanceof Error ? err.message : "unknown error");
      }
    }
    return Response.json({ ok: true, duplicate: result.status === "duplicate" });
  } catch (err) {
    console.error("[waitlist] store error", err instanceof Error ? err.message : err);
    return Response.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
