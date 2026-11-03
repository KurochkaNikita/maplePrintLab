---
name: verify-console-change
description: >-
  Checklist for verifying a change in the admin console (apps/console) before
  reporting it done: temporary preview page behind no login, browser checks,
  typecheck, build, cleanup of temporary code, multi-component check. Use
  before finishing any change to apps/console UI, forms, actions or db code.
---

# Verify an admin console change

The console is behind login and the real database is the user's. Verify without credentials and without writing to their data.

## 1. Static checks

```bash
yarn typecheck
yarn build:console
```

Stop `next dev` before building (a build during dev corrupts `.next`; restart dev afterwards). If a build fails with an SVG parse error, SVGR config or `--webpack` is the cause, not your component.

## 2. Look at it in the browser

1. Check `preview_list`; reuse the user's dev server (port 3001) if running, do not start a second one on the same `.next`.
2. Add a **temporary** page outside `(admin)` (for example `src/app/preview-tmp/page.tsx`) that renders the screen/component with fake props. Mark every temporary line `TEMP-PREVIEW`. If a server action must be bypassed, a temporary early `return null; // TEMP-PREVIEW` in `guard()`, and nothing else.
3. Exercise the real flows: type in fields (focus must stay), tab through with the keyboard, submit empty (errors, tab badges, first invalid field focused), switch RU/EN/FR, narrow the window to 375 px, check long strings.
4. `read_console_messages` for errors and hydration warnings; `read_page` or `get_page_text` for structure; screenshot when the change is visual.

Do not call real create/update actions against the user's database. If the write path matters, review the batch statements by reading them and say it was not run.

## 3. Clean up (always)

```bash
grep -rn "TEMP-PREVIEW" apps packages --exclude-dir=node_modules --exclude-dir=.next   # must print nothing
git status --short                         # only intended files
```

Delete the temporary page folder, then restore the dev server if you stopped it.

## 4. Code-shape checks

- Files with more than one component: command in `one-component-per-file` (must print nothing).
- No inline `<svg>` in `apps/console/src`: `grep -rn '<svg' apps/console/src --include='*.tsx'` (must print nothing).
- New strings exist in `ru.ts`, `en.ts`, `fr.ts` (typecheck catches a missing key because `ru.ts` defines the type).
- No `page.tsx` containing layout markup, `process.env` in a screen, or a db import in a `"use client"` file.

## 5. Report

State what you ran and what you saw. Say explicitly what was not verified (real DB writes, real Blob upload, production auth). Do not commit unless asked.
