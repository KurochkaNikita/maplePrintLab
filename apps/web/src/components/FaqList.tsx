export type FaqItem = { q: string; a: string };

type FaqListProps = {
  heading: string;
  items: FaqItem[];
  className?: string;
};

/** FAQ as collapsible <details>; answers stay in the HTML so they can back FAQPage JSON-LD. */
export default function FaqList({ heading, items, className }: FaqListProps) {
  return (
    <section className={className}>
      <h2 className="font-display text-2xl font-semibold text-charcoal">{heading}</h2>
      <div className="mt-4 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <details key={item.q} className="py-3">
            <summary className="cursor-pointer font-medium text-charcoal marker:text-teal">
              {item.q}
            </summary>
            <p className="mt-2 text-ink/80">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
