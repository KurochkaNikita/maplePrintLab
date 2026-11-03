---
name: extract-jsx-blocks
description: >-
  Rule for React code in this repo: a big block of JSX inside a condition
  (`cond && (...)`, a ternary) or a `.map()` in a component's return is moved
  into its own component. Use whenever you write or review a component whose
  return contains a long conditional or list item, or when a return grows past
  one screen.
---

# Big blocks inside `if` / `.map` in `return` become their own component

When the JSX inside a conditional or a list callback is more than a few lines, extract it into a component in its own file (one component per file, see `one-component-per-file`). The parent keeps only the condition or the loop.

```tsx
// Bad: 40 lines of markup inside the loop
{faq.length > 0 && (
  <ul>
    {faq.map((item, index) => {
      const n = index + 1;
      return <li key={index} ...40 lines...</li>;
    })}
  </ul>
)}

// Good
{faq.length > 0 && (
  <ul className="mt-4 space-y-6">
    {faq.map((item, index) => (
      <FaqItem key={index} locale={locale} index={index} item={item} onChange={setItem} onRemove={removeItem} />
    ))}
  </ul>
)}
```

## When to extract

- The branch or loop body is more than about 10 lines, has its own local variables (`const n = index + 1`) or its own handlers.
- A `.map()` callback needs a block body (`{ const ...; return (...) }`): that is a component waiting to be named.
- The same markup appears in two branches of a ternary or in two places.

A short branch (a one-line message, a single `<Button>`) stays inline.

## How

- Name it after what it shows (`FaqItem`, `SectionItem`, `PriceTierItem`), file next to its parent.
- Props: the data of one item (`item`, `index`) plus change and remove callbacks that take the index (`onChange(index, field, value)`). The item reads shared state it needs (errors, dictionary) from the context hook instead of getting it prop by prop (see `console-forms`).
- Repeated shells (title + delete icon + fields) become a generic component such as `RepeatableItem`, not copies.
- The parent keeps the state and the handlers; the item only renders and calls back.
- Declare the extracted component at the top level of its file, never inside the parent component.

## Check

Look for long block bodies inside `.map(` or `&& (` in `return`:

```bash
grep -rnE "\.map\(\([^)]*\) => \{$" apps/console/src --include='*.tsx'
```

Every hit with more than a few lines inside is a candidate.
