/**
 * Server-side environment access.
 * On Cloudflare Workers, secrets and vars are exposed on process.env (compatibility flag
 * `nodejs_compat`, compatibility_date >= 2025-04-01). Locally they come from `.dev.vars`.
 * Never import this from a client component and never log what it returns.
 */
export function serverEnv(name: string): string | undefined {
  const v = typeof process !== "undefined" ? process.env?.[name] : undefined;
  return v && v.trim() ? v.trim() : undefined;
}

export const isProduction = () => serverEnv("NODE_ENV") === "production";
