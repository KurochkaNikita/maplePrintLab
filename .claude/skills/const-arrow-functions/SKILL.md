---
name: const-arrow-functions
description: >-
  Code style rule for apps/console: functions declared inside a React component
  or hook (event handlers, helpers, async submit/confirm functions) are `const`
  arrow functions, not `function` declarations. Use whenever you write or edit a
  handler, helper or callback in a .tsx/.ts component or hook, or review such code.
---

# Functions inside components and hooks are `const` arrows

In `apps/console`, anything declared **inside** a component or hook body is a `const` arrow function.

```tsx
export function FaqEditor({ locale }: { locale: ProductLocale }) {
  const patch = (next: typeof faq, ...touched: string[]) => {
    onChange(withText(values, locale, { faq: next }), ...touched.map((key) => `${locale}.${key}`));
  };

  const removeItem = (index: number) => {
    patch(faq.filter((_, i) => i !== index));
  };

  const handleConfirm = async () => {
    const result = await deleteCategory(categoryId);
    // ...
  };
}
```

## What this covers

- Event handlers (`handleSubmit`, `handleClose`, `onFileInputChange`), helpers (`patch`, `setItem`, `syncOtherUnit`) and async actions (`submit`, `confirmCrop`) inside components, hooks and `useEffect` bodies.
- Callbacks passed inline stay inline arrows as before.

## What stays a `function` declaration

- The component or hook itself: `export function Name(...)`, `export function useName(...)` (one per file, see `one-component-per-file`).
- Pure helpers at the top level of a module (`export function validateProduct`, `errorText`, `buttonClassName`).
- `forwardRef` callbacks that need a display name (`forwardRef(function Button(...))`).

## Rules that follow from it

- **Declare before use.** A `const` is not hoisted: define a helper above the handlers that call it (TypeScript reports `used before its declaration`).
- Keep the name descriptive (`handleX` for events, a verb for helpers), and annotate parameters and, when not obvious, the return type.
- Use a block body `{ ... }` when there is more than one statement; a one-line expression body is fine for trivial helpers.
- A hook returns the arrow functions it defines (`return { change, submit }`), same as before.

## Check

Must print only `Button.tsx` (the `forwardRef` case):

```bash
grep -rnE "^\s+(async )?function " apps/console/src
```
