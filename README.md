# OpenMaps waitlist site (openmaps.tech)

Next.js App Router + TypeScript + Tailwind v4, deployed to **Cloudflare Workers** with **vinext**
(Cloudflare's recommended Next.js-on-Workers path). Waitlist storage is **Supabase**. No Vercel.

> **Verification status.** npm is blocked in the environment this was written in, so `npm install`,
> `npm run build`, `vinext`, and a Workers (workerd) run have **not** been executed. What was verified:
> TypeScript against stand-in types; the waitlist API against a fake Supabase server; the pages
> server-rendered and screenshot at 390px and 1280px with images loading. Do the first-run checklist
> below before pointing the domain at it.

## Commands

| Script | Does |
| --- | --- |
| `npm run dev` | vinext dev server (workerd-backed), http://localhost:3001 or as printed |
| `npm run build` | `vinext build` -> `dist/` |
| `npm run preview` | build, then serve the production Worker build locally (`vite preview`) |
| `npm run deploy:dry-run` | validate + build, no upload |
| `npm run deploy` | build and **deploy to Cloudflare** (`npx @vinext/cloudflare deploy`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:secrets` | scan the built client bundle for server secrets |

```bash
npm install
cp .dev.vars.example .dev.vars     # optional: real Supabase secrets for local testing
npm run dev
```
Without `.dev.vars`, local dev uses an in-memory mock (forgets on restart). In production, missing Supabase
secrets make the API return 503 instead of silently dropping signups.

## Cloudflare configuration

- `wrangler.jsonc`: Worker `openmaps-web`, `compatibility_date` 2026-02-12, `nodejs_compat`, observability on,
  custom domain route for `openmaps.tech`.
- `vite.config.ts`: `vinext()` + `@cloudflare/vite-plugin` (`rsc` environment, `ssr` child). Do not add `@vitejs/plugin-rsc` here; vinext registers it.
- `"type": "module"` in `package.json` (required by vinext).
- Server code uses only Web APIs (`fetch`, `Request`, `Response`). No `fs`/`path`/`process.cwd`, no Supabase SDK.

## Secrets (exact)

| Name | Where | Value |
| --- | --- | --- |
| `SUPABASE_URL` | Cloudflare secret | `https://<project-ref>.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Cloudflare secret | Supabase service-role (or new `sb_secret_...`) key |
| `RESEND_API_KEY` | Cloudflare secret | Resend API key (domain `openmaps.tech` must be verified in Resend) |

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put RESEND_API_KEY
```
Rules: server-only, never `NEXT_PUBLIC_`, never committed (`.dev.vars`, `.env*` are gitignored), never logged
(the code logs only an HTTP status on failure). Phone numbers follow the same rule: collected only when SMS
opt-in is checked, never logged, never returned in any API response, never shown anywhere after submission.
The browser only calls `POST /api/waitlist`. After a build,
`npm run check:secrets` fails if the key name or value appears in client assets.

## Email (Resend)

`lib/email/` sends transactional email via the Resend HTTP API (plain `fetch`, no SDK — Workers-compatible).
Sender is `OpenMaps <updates@openmaps.tech>`, reply-to is `hello@openmaps.tech` (`CONTACT_EMAIL` in `lib/site.ts`).
Google Workspace handles inbound mail to `hello@openmaps.tech`; Resend receiving is intentionally not enabled,
and no DNS/MX records were touched by this.

- **Waitlist confirmation** (`sendWaitlistConfirmationEmail(to, smsOptIn)`) — sent automatically from
  `app/api/waitlist/route.ts` once per *new* signup, right after the Supabase row is created. Duplicates never
  trigger a second email. If Resend fails or `RESEND_API_KEY` is missing, the signup still succeeds (HTTP 200)
  and only a safe, non-secret error is logged — a stored signup is never lost over an email delivery problem.
  When `smsOptIn` is true the email adds one line noting a launch text will also follow.
- **Early access invite** (`sendEarlyAccessInviteEmail(to, accessUrl)`) and **launch update**
  (`sendLaunchUpdateEmail(to)`) — reusable templates/functions in `lib/email/`. Neither is wired to an automatic
  trigger; nothing sends these until you call them explicitly (e.g. from a one-off admin script) once there's an
  access URL / a launch date. `accessUrl` is a required parameter, not a hardcoded constant.

## SMS (future, not yet implemented)

No SMS provider is connected. `lib/sms.ts` exposes `sendLaunchNotification({ phoneNumber })` as a safe no-op
stub — calling it logs a warning (never the phone number) and returns `{ ok: false, reason: "not_configured" }`;
nothing calls it. `lib/waitlist/sms-recipients.ts` exposes a read-only `getSmsLaunchRecipients()` that selects
only `sms_opt_in = true AND phone_number IS NOT NULL`; it does not send anything, and there is no public or
unauthenticated endpoint for triggering a send.

Intended flow once a provider (e.g. Twilio) is chosen and its secret is added as a Cloudflare secret:
1. Call `getSmsLaunchRecipients()` to retrieve only users with valid SMS consent.
2. Send exactly one launch notification per recipient.
3. Support STOP/unsubscribe per the provider's built-in compliance tooling.
4. Never send marketing SMS beyond this consent scope unless the waitlist form's consent language is expanded
   first.

## Public settings (not secrets): `lib/site.ts`

- `CONTACT_EMAIL` = `hello@openmaps.tech` (footer Contact link, Privacy/Terms). Confirm the mailbox receives mail before launch.
- `X_URL` = `https://x.com/openmaps_` (header and footer X link).

## Supabase setup

1. Create a project (free tier is fine).
2. SQL editor: run `supabase/schema.sql`. It creates `openmaps_waitlist` (`id`, `email`, `first_name`,
   `android_phone` [unused by the app; kept for historical rows], `city_state`, `alpha_interest`, `phone_number`,
   `sms_opt_in`, `sms_opt_in_at`, `source` in twitter/direct/other, `created_at`), a unique index on
   `lower(email)`, enables RLS with no policies, and revokes all privileges from `anon`/`authenticated`.
3. Project settings > API: copy the project URL and the service-role key into the Cloudflare secrets above.

## Source attribution & duplicates

`/?source=twitter` (also `x`, `t.co`) is stored as `source = 'twitter'`; none is `direct`; anything else `other`.
It is remembered for the browser session, so reading Privacy/Terms and returning keeps attribution.
Duplicate emails (case-insensitive) hit the unique index; the visitor still sees the normal success message.

## Custom domain (openmaps.tech)

1. Cloudflare dashboard > **Add a domain** > `openmaps.tech` > Free plan. Cloudflare shows two nameservers.
2. At your registrar, replace the domain's nameservers with those two. Wait until the zone shows **Active**.
3. Deploy once (below). `wrangler.jsonc` contains `routes: [{ pattern: "openmaps.tech", custom_domain: true }]`,
   so Wrangler attaches the apex domain and Cloudflare creates the proxied DNS record and certificate itself.
   (Or: Workers & Pages > `openmaps-web` > Settings > Domains & Routes > Add > Custom domain.)
   Do not hand-create an `A`/`CNAME` for the apex first; it blocks the automatic record.
4. **www redirect:** DNS > add record `AAAA` name `www` value `100::` **Proxied** (orange cloud). Then Rules >
   Redirect Rules > Create: *If hostname equals `www.openmaps.tech`* -> Dynamic redirect to
   `concat("https://openmaps.tech", http.request.uri.path)` status 301, preserve query string. This keeps
   `?source=twitter` intact.
5. SSL/TLS > Overview: mode **Full (strict)**; Edge Certificates > enable **Always Use HTTPS**.

## Deployment (do not run until approved)

```bash
npm install
npx wrangler login                       # or set CLOUDFLARE_API_TOKEN (Edit Workers template)
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put RESEND_API_KEY
npm run deploy:dry-run
npm run deploy                           # <- the deploy command
npm run check:secrets
```
Secrets can only be set once the Worker exists; if `secret put` says so, run `npm run deploy` first, then add
secrets (the form returns 503 until they exist).

## Rate limiting (Cloudflare WAF)

Dashboard > `openmaps.tech` > Security > WAF > Rate limiting rules > Create rule.
- Name: `waitlist-submit`
- Expression (Edit expression):
  `(http.host eq "openmaps.tech" and http.request.method eq "POST" and http.request.uri.path eq "/api/waitlist")`
- Characteristics: IP
- Rate: 5 requests per 10 seconds
- Action: Block, duration 10 seconds (the Free plan's fixed limits; on paid plans prefer 10 requests per 10 minutes, block 1 hour)

The route also has a honeypot and a best-effort per-isolate limit.

## Concept images

All local, in `public/concepts/`: `city.jpg`, `highway.jpg`, `suburb.jpg`, `rural.jpg` (the four environments; the
hero and the Live card use `highway.jpg`). No external image URLs. They are 4:5 screenshots shown inside CSS phone
frames (a 9:15 window onto the image, so a few right-edge controls are clipped by the frame). To change which
image leads the hero, edit `CONCEPTS` in `lib/concepts.ts`.

## Compatibility limitations

- vinext is young and "not a drop-in replacement for every app"; this page uses only mainstream features, but
  the first real build may need small fixes. If it hits a blocker, the fallback is the OpenNext Cloudflare adapter.
- `next/image` under vinext does not resize at build time: the ~300 KB JPEGs are served as-is (4 images + hero reuse).
- The social card is a static `public/og.png` (the runtime `next/og` generator was removed to avoid
  native-module risk on Workers).
- Rate limiting in code is per Worker isolate; use the WAF rule for real limits.

## First-run checklist (not yet done)

- [ ] `npm install && npm run build` passes; fix anything vinext reports
- [ ] `npm run preview`: home, `/privacy`, `/terms` render; images load
- [ ] Form posts to `/api/waitlist`; duplicate and invalid email behave; `/?source=twitter` row has `twitter`
- [ ] Without secrets in production the form shows the 503 message (then add them)
- [ ] `npm run check:secrets` passes
- [ ] Phone check at ~390px
