---
name: console-admin-screen
description: >-
  How to build or change a page in the admin console (apps/console): the page
  fetches data and sets metadata, a screen in src/screens renders the UI from
  props. Use when adding or editing any admin section, list, create or edit
  page, form, or table in apps/console, or when moving UI out of a page.tsx.
---

# Admin console page = data, screen = UI

Applies to `apps/console` only. Reference implementation: the products section
(`src/app/(admin)/products/**` and `src/screens/products/**`).

## The rule

**`page.tsx` (server component) does only this:**
- Reads route params and `searchParams` and turns them into plain values.
- Fetches data: queries from `@maple-print-lab/db`, `getDict()`, `getLocale()`, env values.
- Exports `generateMetadata` (all titles and meta tags live here).
- Calls `notFound()` / `redirect()` when the data says so.
- Renders one screen and passes everything as props. No JSX layout, no classNames, no helpers for display.

**A screen (`src/screens/<section>/<Name>Screen.tsx`) does only this:**
- Renders the whole UI from props: markup, tables, forms, empty states, formatting (`Intl`, `format()`).
- Receives data, `t` (the dictionary), `locale`, and anything derived from env (e.g. `siteUrl`) **as props**.
- Never queries the database, never reads `process.env`, never calls `getDict()`.
- Is a server component unless it needs state; interactive pieces are small client components in `src/components/`.
- Exports a named `Props` interface (with a short comment per non-obvious prop) and a default export.

If a page grows markup, move it to the screen. If a screen needs data it does not have, add a prop and fetch it in the page.

## Steps for a new section

1. **Data layer** (`packages/db/src/<section>.ts`, exported from `src/index.ts`): queries and writes. Multi-statement writes use `db.batch([...])` (neon-http has no interactive transactions). Do not import drizzle in `apps/console`.
2. **Shared pure code** (`apps/console/src/lib/<section>/`): form value types, validation (`validate…(values, ctx)` returning `{ input } | { errors }`), mapping record to form values. Files imported by client components must not import the `@maple-print-lab/db` root (it pulls the DB driver into the browser); import types with `import type`, runtime values from a dependency-free file such as `@maple-print-lab/db/src/locales`.
3. **Server actions** (`lib/<section>/actions.ts`, `"use server"`): call `requireAdmin()` first (layouts do not re-run on client navigation), validate on the server (the source of truth), check what needs the DB (uniqueness, existence), write, return a result union `{ ok: true } | { ok: false; errors } | { ok: false; formError }`. Never throw field errors.
4. **Pages** under `src/app/(admin)/<section>/`: list `page.tsx`, `new/page.tsx`, `[id]/page.tsx`. `(admin)/layout.tsx` already guards the session. Add the path to the `matcher` in `src/proxy.ts` if it is a new top-level section. `params` and `searchParams` are Promises (Next 16). Start independent queries together with `Promise.all`; use React `cache()` when `generateMetadata` and the page need the same record.
5. **Screens** in `src/screens/<section>/`, one per page.
6. **Strings**: add every new string to **all three** dictionaries (`lib/i18n/ru.ts` defines the type, then `en.ts`, `fr.ts`); placeholders use `{name}` with `format()`. French uses Canadian style. No hard-coded text in components.
7. **Nav**: add the section to `navItems` in `components/AdminShell.tsx` and `shell.nav` in the dictionaries.

## UI conventions

- Reuse `components/` primitives: `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `Field` (label, hint, `tip` tooltip, error wiring), `MultiSelect`, `Tabs` (`underline` / `folder`), `InfoTip`, `PageHeader`, `BackLink`, `FormError`. Add a primitive only when none fits.
- Forms are one client component holding all values as strings, submitting the whole object to a server action; field errors come back keyed by path (`en.title`, `photos.0.alts.fr`) and map to a tab so the form can open the tab, badge it, and focus the first invalid field.
- Keep inactive tab panels mounted (`hidden`) so nothing typed is lost.
- One component per file: see the `one-component-per-file` skill.
- Components declared inside another component remount on every render (inputs lose focus): use plain render functions or move them out.
- Follow the accessibility rules in the root `CLAUDE.md` (contrast, 24 px minimum targets, visible focus, labelled controls, no information by colour alone). The console is `noindex`, so the SEO rules there do not apply to it.

## Before finishing

- `yarn typecheck` and `yarn build:console` (stop `next dev` first: a build during dev can corrupt `.next`).
- UI is behind login. To look at it without credentials, add a temporary page outside `(admin)` that renders the screen or form with fake props, check it in the browser pane, then delete it. Never leave auth bypasses in code (`grep -rn TEMP-PREVIEW`).
- Do not run migrations or write to the database without the user's go-ahead; generate with `yarn workspace @maple-print-lab/db db:generate`, apply with `db:migrate` only when asked.
