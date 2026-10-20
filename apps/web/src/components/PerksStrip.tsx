type Perk = { title: string; body: string };

/** Compact shop-style row of order guarantees under the hero. */
export default function PerksStrip({ items }: { items: Perk[] }) {
  return (
    <section className="border-y border-line bg-white">
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-5 gap-y-4 px-5 py-5 md:grid-cols-4">
        {items.map((perk) => (
          <li key={perk.title} className="flex items-start gap-3">
            <span
              className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-deep"
              aria-hidden="true"
            />
            <div>
              <p className="font-display text-sm font-semibold text-charcoal">{perk.title}</p>
              <p className="text-sm text-ink/80">{perk.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
