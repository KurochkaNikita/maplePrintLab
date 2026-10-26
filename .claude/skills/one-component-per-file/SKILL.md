---
name: one-component-per-file
description: >-
  Rule for React code in this repo: one component per file. Use whenever you
  create, edit, split or review a .tsx file with components (apps/console and
  apps/public), when a file starts to hold a second component, or when asked to
  extract or move a component.
---

# One component per file

A `.tsx` file declares **exactly one React component**. A component is any function that returns JSX and is rendered as `<Name />`.

## How

- The file is named after the component (`LocaleSeo.tsx` holds `LocaleSeo`).
- Give it a named export **and** a default export, with its props as an exported `interface <Name>Props` (or an inline type for a one-prop helper):

  ```tsx
  export function StatusIcon({ label, className, children }: StatusIconProps) { … }

  export default StatusIcon;
  ```
- A helper component used by one parent still gets its own file, next to the parent (e.g. `SeoTab.tsx` and `LocaleSeo.tsx` in `components/product-form/`). Move it to `components/` when more than one feature uses it.
- The parent imports the helper like any other component. Keep `"use client"` at the top of each file that needs it; a client file may import server-safe components, not the other way round.

## What may stay in the file

- Constants, types, and plain helper functions used only by that component (e.g. `convert()` in `PricingTab.tsx`).
- Functions that return JSX but are **called, not rendered** (`{renderPhoto(i)}`, not `<Photo />`). Use them when the piece needs the parent's state and must not remount, see below.

## Never declare a component inside another component

A component defined in a component body is a new type on every render, so React remounts it: inputs lose focus on each keystroke and state resets. Either move it to its own file, or turn it into a plain render function (`renderX(args)` returning JSX with a `key`).

## Check before finishing

Find files that still hold two components:

```bash
for f in $(find apps -name "*.tsx" -not -path "*/node_modules/*" -not -path "*/.next/*"); do
  n=$(grep -cE "^(export )?(default )?function [A-Z]" "$f"); [ "$n" -gt 1 ] && echo "$n $f"
done
```

Then `yarn typecheck`.
