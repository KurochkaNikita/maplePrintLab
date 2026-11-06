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

## Environment variables

See `apps/public/.env.example` and `apps/console/.env.example`. `DATABASE_URL` for the public site is needed at build time only.

## Deploy

Two Vercel projects with Root Directory `apps/public` and `apps/console`. Redirects and headers live in each app's `vercel.json`.
