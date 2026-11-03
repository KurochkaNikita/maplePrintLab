---
name: console-ui-components
description: >-
  How to write reusable UI components in the admin console (apps/console):
  generic and data-driven components, SVG icons as files, no components inside
  components, accessibility (contrast, touch targets, focus, labels,
  not colour-only), native controls. Use when creating or changing any
  component, table, modal, dropdown, icon, button, or card in apps/console.
---

# Admin console UI components

Applies to `apps/console/src/components/**`. Also follow `one-component-per-file` and the accessibility rules in the root `CLAUDE.md`.

## Generic first

- A component in `components/` must not know about products (or any one section). It takes data and callbacks as props. Section-specific wiring goes in a thin wrapper next to the feature (`product-form/ProductPhotoCard.tsx` binds the generic `PhotoCard` to form state).
- Prefer **data-driven** over hand-built markup: `DataTable` takes column definitions and rows and renders header, cells, empty state and row links itself. A new list = a columns array, not a new table.
- Before adding a component, look in `components/` for one that fits (`Field`, `Modal`, `Tabs`, `PhotoCard`, `PhotoAddCard`, `PhotoSection`, `HiddenFileInput`, `StatusIcon`, `InfoTip`, `EmptyState`, `BackLink`, `ButtonLink`). Extend with a prop rather than copying.
- Props: exported `interface <Name>Props`, short comment on non-obvious ones, `className` passed through where a parent may need to size it. Booleans are named for the state (`busy`, `hasError`), callbacks `onX`.
- A component bigger than ~100 lines or with two jobs is split into small pieces (`ImagesTab` = `MainPhotoSection` + `ExtraPhotosSection` + `CropDialog`). Pure helpers go to a `.ts` file beside it.

## Icons

SVG **files** only: `src/icons/<name>.svg` (`viewBox`, `stroke`/`fill="currentColor"`, `aria-hidden="true"`, no width/height) used as `<CloseIcon className="h-5 w-5" />`. Never inline `<svg>` in a `.tsx`. Different stroke: `strokeWidth` prop. Needs `next dev/build --webpack`; restart dev after touching `next.config.mjs`.

## Components inside components: never

A component declared in another component's body remounts every render (input focus lost on each keystroke). Use a top-level component in its own file or a plain render function (`renderX(args)`).

## Accessibility (WCAG 2.2 AA)

- Text contrast at least 4.5:1: no `text-ink/70` or lighter for small text; use `text-ink`, `text-charcoal`, `amber-deep`.
- Interactive targets at least 24x24 px, aim for 44 px, with spacing between neighbours. Small icon buttons get padding or a larger hit area, not just a 16 px icon.
- Every icon-only control has an accessible name (`aria-label` from the dictionary) and a visible `title`/tooltip (`InfoTip`) when the meaning is not obvious.
- Status is never colour alone: pair the colour with an icon shape and text (`StatusIcon` has a label and tooltip).
- Visible focus ring on every focusable element (`focus-visible:` classes); keyboard order matches visual order; Escape closes modals and popovers, focus returns to the trigger.
- Inputs: real `<label>` (via `Field`), `aria-invalid`, errors linked with `aria-describedby`, `role="alert"` or a live region for async errors (`FormError`).
- Combobox/listbox patterns (`MultiSelect`): `role`, `aria-expanded`, `aria-activedescendant`, arrow/Enter/Escape keys; `aria-controls` only while the popup exists.
- `prefers-reduced-motion`: no essential motion; keep transitions short.

## Native controls

Style the arrow of a `<select>` (custom chevron, `appearance-none`, space on the right), and check long option lists: dropdown panels need `max-height` with `overflow-y-auto` and must not clip inside overflow-hidden parents (render popups with enough room or in a portal). Check these in the browser, they were fixed after the fact before.

## Before finishing

Look at the component at desktop and 375 px width, with keyboard only, and with long text (RU and FR strings are longer than EN). Then `yarn typecheck`, and the multi-component check in `one-component-per-file`.
