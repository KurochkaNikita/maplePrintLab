---
name: clean-react-code
description: >-
  Checklist to write React/TypeScript in apps/console cleanly the first time:
  no deprecated APIs (FormEvent, React.FC, etc.), screens that only lay out
  blocks, logic in hooks and pure lib functions, small focused components.
  Use before and after writing or editing any screen, chart, form, hook or
  component in apps/console, and when the IDE shows a "deprecated" (TS6385)
  hint or a file feels too big or full of logic.
---

# Write it clean the first time

These mistakes were found only after the code was written (a deprecated `FormEvent`, a 170-line `FinanceScreen` full of calculations, a 150-line `LineChart` doing geometry, hover and drawing at once). Check them while writing, not afterwards.

## 1. No deprecated APIs

- Treat any IDE hint "X is deprecated" (TS6385, strikethrough) as an error: fix it in the same change, and fix the same symbol everywhere it appears (`grep -rn Symbol src`).
- Known replacements (React 19 types):
  - `FormEvent<HTMLFormElement>` → `SubmitEvent<HTMLFormElement>` (`import type { SubmitEvent } from "react"`).
  - `React.FC` / `FunctionComponent` → a plain function with a typed props parameter.
  - `ElementRef` → `ComponentRef`; `MutableRefObject` → `RefObject`; `useFormState` → `useActionState`.
  - `next/router` in the App Router → `next/navigation`; `middleware.ts` in Next 16 → `proxy.ts`.
- Before using an event or helper type you do not use daily, check that the declaration in `node_modules/@types/react/index.d.ts` has no `@deprecated` above it.
- After editing, `yarn typecheck`, and read the IDE diagnostics of the touched files when they are available.

## 2. A screen only lays out

`src/screens/**/*Screen.tsx` has no calculations, no column definitions, no sums or averages, no long JSX of its own. It:
- reads props, picks the dictionary slice (`t.pages.x`),
- renders `PageHeader`, a few section components, the empty state.

Everything else goes to a component in `src/components/<section>/` that takes **its own slice of the dictionary** (`t: Dictionary["pages"]["finance"]["kpi"]`, not the whole `t`) plus data. Rule of thumb: if a screen has a `const` that computes something or builds an array of columns, move it into the component that shows it.

## 3. Where logic lives

| It is… | Put it in |
|---|---|
| a pure calculation (geometry, scale, totals, formatting, path) | `src/lib/<section>/*.ts`, no React, easy to read on its own |
| state, pointer or keyboard handling, effects, server calls | a hook in `src/hooks/` |
| markup | a component, and nothing else |
| style tables (tone → class) | a small `.ts` file next to the components |

A component that has more than one of these jobs is split. Signs it needs it: over ~100 lines, a `useState` plus maths plus a long `return`, more than one `.map` with big JSX.

## 4. Size and shape

- One component per file; none declared inside another (`one-component-per-file`); big JSX in a condition or `.map` is its own component (`extract-jsx-blocks`); inner functions are `const` arrows (`const-arrow-functions`).
- Prefer a thin switch component over a long `if (…) return (big) ; return (big)`: `LookupRow` picks `LookupRowForm` or `LookupRowView`.
- Child components receive ready callbacks (`onEdit={() => onStartEdit(item.id)}`), not ids they would have to pass back.
- Generic parts (`ChartCard`, `DataTable`, `LineChart`) do not know the section; section wrappers bind them to its data and strings.

## 5. Quick self-review before saying "done"

1. `grep -rn "FormEvent\|React.FC" apps/console/src` finds nothing.
2. No screen file over ~100 lines or containing sums, averages, `.reduce`, or column arrays.
3. No component file over ~100 lines or with two jobs.
4. Each hook and lib function has one job and a one-line doc comment.
5. `yarn typecheck`; then the checks of `verify-console-change`.
