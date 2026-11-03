# Admin console (apps/console) — hard rules

Always-on rules for this app. Details and procedures are in the skills in `.claude/skills/`: `console-admin-screen`, `console-forms`, `console-ui-components`, `console-db`, `verify-console-change`, `one-component-per-file`, `const-arrow-functions`. Read the matching skill before starting.

- **Page = data, screen = UI.** `page.tsx` fetches, sets metadata, calls `notFound()`; markup lives in `src/screens/<section>/*Screen.tsx` and gets everything via props.
- **One component per file**, and never a component declared inside another component.
- **Functions inside components and hooks are `const` arrows** (`const handleSubmit = async () => {}`); only the component/hook itself and top-level pure helpers are `function` declarations.
- **Client files never import the `@maple-print-lab/db` root** (it bundles the DB driver). Use `import type` or `@maple-print-lab/db/src/locales`.
- **Every server action and API route starts with `requireAdmin()`** and re-validates its input; layouts and `proxy.ts` do not cover them.
- **Strings go into all three dictionaries** (`lib/i18n/ru.ts` defines the type, then `en.ts`, `fr.ts`). No hard-coded visible text.
- **Icons are `.svg` files** in `src/icons` used via SVGR; no inline `<svg>`.
- **Accessibility:** contrast 4.5:1, targets at least 24 px (aim 44), labelled controls, visible focus, no colour-only status.
- **Database:** multi-statement writes use `db.batch`; prefer drizzle helpers over `sql`; run migrations or write to the user's DB only after they say so.
- **Before finishing:** `yarn typecheck` and `yarn build:console` (stop `next dev` first); remove all `TEMP-PREVIEW` code. Do not commit unless asked.
- The console is `noindex`; the SEO rules of the root `CLAUDE.md` do not apply here.
