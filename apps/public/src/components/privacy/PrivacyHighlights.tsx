type Highlight = { title: string; body: string };

type PrivacyHighlightsProps = {
  items: readonly Highlight[];
};

export default function PrivacyHighlights({ items }: PrivacyHighlightsProps) {
  return (
    <ul className="mt-10 grid gap-4 sm:grid-cols-3">
      {items.map((item, i) => (
        <li key={item.title} className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="layer-bar" aria-hidden="true" />
          <div className="p-5">
            <span className="font-mono text-xs tracking-widest text-teal">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="mt-2 font-display text-lg font-semibold text-charcoal">{item.title}</h2>
            <p className="mt-2 text-sm text-ink/80">{item.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
