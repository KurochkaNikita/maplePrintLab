---
name: console-forms
description: >-
  How to build or change a form in the admin console (apps/console): form
  values as strings, one shared validation used by client and server action,
  errors keyed by path and mapped to tabs, field wrappers, i18n strings, and
  form logic in hooks with a context. Use when adding or editing any form,
  field, tab, validation rule, or error message in apps/console.
---

# Admin console forms

Reference implementation: the product form (`src/components/product-form/**`, `src/hooks/useProductForm.ts`, `src/hooks/useProductFormContext.ts`, `src/lib/products/**`). Copy its shape; do not invent a new one.

## Model

- **All form values are strings** (numbers, prices, sizes too); booleans and id lists are the only exceptions. Parse them in `validate…` and `form-values.ts`, never in components.
- Types, constants and field helpers live in `lib/<section>/types.ts`: `FormValues`, `ErrorCode`, `FieldErrors`, `ActionResult`, `TabId`, `tabOfField(key)`, `fieldId(key)`, `countErrorsByTab`, `firstErrorKey`.
- `lib/<section>/form-values.ts` maps a DB record to form values (and empty defaults for "new").

## Validation: one function, two callers

- `validate<Section>(values, ctx)` in `lib/<section>/validation.ts` is pure (no DB, no env, no React). It returns `{ input } | { errors }`.
- The client calls it before submit for instant feedback; the **server action calls it again and is the source of truth**, then checks what needs the DB (uniqueness, ids exist).
- Errors are `{ code, max? }` keyed by **path**: `slug`, `en.title`, `dimensions.cm.1`, `photos.0.alts.fr`, `photos` (group error). Never put translated text in the error; the component turns a code into text with `errorText(errors, key, dict)`.
- A new rule = a new `ErrorCode` + its message in all three dictionaries (see Strings).

## Tabs and focus

- `tabOfField(key)` maps every error key to a tab; update it when you add a field on a new tab or path shape.
- On a failed submit: open the tab of `firstErrorKey`, badge tabs with `countErrorsByTab`, focus the element with id `fieldId(key)`. Every input therefore needs `id={fieldId(key)}`; group fields (multi-select, photo cards) need a focusable element with that id too.
- Keep inactive tab panels mounted (`hidden`), so typed values and focus order survive.
- Language sub-tabs use `LocaleTabs` (folder variant); a locale panel is one component (`LocaleContent`, `LocaleSeo`) taking `locale`.

## Fields

- Use the wrappers: `InputField`, `TextareaField`, `SelectField`, or `Field` + a control for anything custom (`MultiSelect`, photo cards). They wire `label`, `hint`, `tip` (tooltip), `error`, `required`, `aria-describedby`, `aria-invalid`. Do not hand-write `<label>`/`<input>` pairs.
- `required` shows the asterisk only; the rule itself is in validation.
- Updating nested state goes through helpers in `components/<form>/shared.ts` (`withText`, `withDimension`), never mutate, never inline deep spreads in JSX.
- A field that derives another (cm to in) converts on blur and only when the value changed since focus, so a hand-typed value is never overwritten.

## Logic lives in hooks, data comes from context

- A form component renders; state, handlers, submit, focus and server calls live in hooks: `use<Section>Form` (values, errors, `change`, `submit`, active tab) and feature hooks such as `use<Section>Photos`.
- Provide the form once (`<Section>FormProvider` + `use<Section>FormContext()`); tabs and fields read `values`, `errors`, `change` from context. Do not pass the same props through three levels.
- Extract event handlers into named `const` arrow functions (`const handleCancel = () => {…}`, `syncOtherUnit`; see `const-arrow-functions`) instead of long inline arrow bodies.
- Components are top-level; never declare one inside another (see `one-component-per-file`).

## Strings (i18n)

- Every label, hint, tooltip, placeholder, button, error message and `aria-label` goes into **all three** dictionaries: `lib/i18n/ru.ts` (defines the `Dictionary` type), `en.ts`, `fr.ts`. French: Canadian style, decimal comma.
- Placeholders: `{count}` with `format(template, { count })`.
- No hard-coded user-visible text in components, including `title=` and `alt=`.

## Server action contract

`"use server"`, first line `await requireAdmin()`, validate again, return `{ ok: true } | { ok: false; errors } | { ok: false; formError }`. Never throw field errors. On success the client navigates; on `errors` it sets them and focuses the first.

## Checklist for a new field

1. `types.ts` (value type, error code, `tabOfField` if new path), `form-values.ts`.
2. `validation.ts` rule; DB column/mapping if stored (see `console-db`).
3. Component using a wrapper, `id={fieldId(key)}`, error via `errorText`.
4. Strings in ru/en/fr.
5. Server action input type, then `yarn typecheck`.
