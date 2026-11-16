# Maple Print Lab

Yarn-workspaces monorepo: a public bilingual (EN/FR) storefront and an admin console, both on Vercel and Neon Postgres.

| Path | What |
| --- | --- |
| `apps/public` | Public site (`mapleprintlab.store`). Next.js **static export**; the catalogue is read from Postgres at build time. |
| `apps/console` | Admin console (`admin.mapleprintlab.store`, RU/EN/FR, `noindex`, Neon Auth). |
| `packages/db` | Drizzle schema, migrations, seed/check scripts. |
| `packages/ui` | Shared Tailwind preset. |

Rules for contributors (SEO, accessibility, code style) are in `CLAUDE.md` and `apps/console/CLAUDE.md`.

## Setup

Node 20.9+ and Yarn 1.

```bash
yarn install
cp apps/public/.env.example apps/public/.env.local
cp apps/console/.env.example apps/console/.env.local   # fill in the values
yarn dev            # public on :3000, console on :3001 (https)
```

Other commands: `yarn dev:public`, `yarn dev:console`, `yarn typecheck`, `yarn build`.
Stop `next dev` before running `yarn build` (it corrupts `.next`).

## Publishing content

The public site is static, so edits made in the console appear only after a rebuild. The **Publish** button in the
console calls a Vercel Deploy Hook of the public project (`SITE_DEPLOY_HOOK_URL`, set in the console project only).
Create the hook in Vercel: public project -> Settings -> Git -> Deploy Hooks.

## Order requests ("Add to request")

Visitors add pieces to a request list (kept in the browser, `localStorage`) and send it from `/<lang>/request/`; there is no payment. The public site is static, so the form posts to a
**public** route handler of the console, `POST /api/order-request` (the only route that skips `requireAdmin()`).
It validates, applies the anti-spam checks, saves a row in `order_requests`, then mails the shop owner through Resend
(Reply-To = the customer). A failed mail never loses the request. Requests are managed in the console under **Requests**;
"Create order" opens `/orders/new` prefilled and, once saved, links the order and marks the request `converted`.

Anti-spam: hidden `website` field (answers 200 and does nothing), minimum 2 s fill time, Cloudflare Turnstile,
max 5 requests per hour per hashed IP (429). Title and price are read from the database, not from the browser.

| Variable | App | Purpose |
| --- | --- | --- |
| `PUBLIC_SITE_ORIGIN` | console | Origin(s) allowed by CORS (comma-separated): `https://mapleprintlab.store`, plus `https://localhost:3000` locally. |
| `RESEND_API_KEY` | console | Resend API key. Without it the mail is logged instead of sent. |
| `ORDER_NOTIFY_EMAIL` | console | Inbox that receives new requests. |
| `ORDER_FROM_EMAIL` | console | Sender, default `Maple Print Lab <orders@mapleprintlab.store>`. |
| `TURNSTILE_SECRET_KEY` | console | Turnstile secret. Required in production. |
| `IP_HASH_SALT` | console | Salt for `sha256(ip + salt)`. Required in production. |
| `NEXT_PUBLIC_ORDER_API_URL` | public | Full URL of the endpoint, e.g. `https://admin.mapleprintlab.store/api/order-request`. Without it the button stays a link to `/contact/`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | public | Turnstile site key. |

Manual steps: verify `mapleprintlab.store` in Resend (add the SPF and DKIM DNS records it shows), create a Turnstile widget
for `mapleprintlab.store`. The `order_requests` and `order_request_items` tables must exist in the database
(the migration files were removed once applied; regenerate them with `yarn workspace @maple-print-lab/db db:generate`
if a new database is needed). For local testing use Cloudflare's test keys
(site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`).

## Environment variables

See `apps/public/.env.example` and `apps/console/.env.example`. `DATABASE_URL` for the public site is needed at build time only.

## Deploy

Two Vercel projects with Root Directory `apps/public` and `apps/console`. Redirects and headers live in each app's `vercel.json`.
