---
name: console-db
description: >-
  Rules for database and server-side code behind the admin console: Drizzle on
  Neon (neon-http, db.batch, no interactive transactions), queries in
  packages/db, client/server import boundary, migrations, requireAdmin in every
  server action and route handler, uploads. Use when editing packages/db,
  server actions, API routes, schema, migrations or anything that reads or
  writes data for apps/console.
---

# Database and server code

## Where code lives

- All queries and writes are in `packages/db/src/<section>.ts`, exported from `packages/db/src/index.ts`. `apps/console` never imports drizzle or `pg`/`neon` directly.
- Client components must **not** import the `@maple-print-lab/db` root: it pulls the DB driver into the browser bundle. Use `import type` for types and a dependency-free file for runtime values (`@maple-print-lab/db/src/locales`). If a client needs a constant that sits in a DB file, move it to such a file.
- Pages and server actions may import the root.

## Writing with neon-http

- The driver has **no interactive transactions**. Several statements that must succeed together go in one `db.batch([...])`. Child rows that need the parent id use a subquery on a unique key (slug), because the id is not known inside the batch.
- Prefer drizzle helpers (`eq`, `and`, `inArray`, `exists`, `max()`, `count()`) over `sql` templates. The IDE flags many `sql` fragments as errors even when they run; use `sql` only when no helper exists.
- Updating a one-to-many set (translations, collections, images): delete then insert in the same batch.
- Unique violations (`isUniqueViolation`) become a field error (`slug` taken), not a 500. Still pre-check with a query for a friendly message.
- Slug change creates permanent redirects (`redirects` table) in the same batch, flattening chains (old to old, old to new) and removing a redirect whose source is now a live path.
- Lists: paginate in SQL (`limit/offset`), clamp the page, search with `ilike` or an `exists` subquery over translations, return `{ items, total, page, pageCount }`.

## Server actions and route handlers

- First statement: `await requireAdmin()` (from `lib/auth/server.ts`). Layouts and `proxy.ts` do not protect a server action called from the client or a direct POST to `app/api/**`. Every action and handler checks itself.
- Validate input on the server with the shared `validate…` and treat the client payload as untrusted (shape, sizes, allowed MIME types, ids exist). Return result unions, do not throw field errors.
- Secrets and env values stay on the server; pass to screens only what the UI needs (`siteUrl`).
- Uploads: `app/api/photos/route.ts` checks admin, size and type, processes with `sharp`, stores with `@vercel/blob` `put`, returns URLs. Store URLs in the DB; legacy bare file names are previewed through `NEXT_PUBLIC_SITE_URL`. Replacing or removing a photo does not delete the old blob yet; the daily cron cleans unused ones.
- `dynamic = "force-dynamic"` on pages that read the session or DB.

## Migrations: ask before touching the real database

1. Change `packages/db/src/schema.ts`.
2. `yarn workspace @maple-print-lab/db db:generate`. Read the SQL and the `drizzle/` meta changes; tell the user what will change.
3. Run `db:migrate` **only after the user says so**. Never run seed/verify scripts or ad-hoc writes against their database to "test"; use a temporary page with fake data instead (see `verify-console-change`).
4. Add new nullable or defaulted columns where existing rows exist; do not drop or rename without a data plan.

## Check

`yarn typecheck`, `yarn build:console`; confirm no client file imports the DB root at runtime (must print nothing; `import type` is fine):

```bash
grep -rl '"use client"' apps/console/src | xargs grep -n 'from "@maple-print-lab/db"' | grep -v 'import type'
```
