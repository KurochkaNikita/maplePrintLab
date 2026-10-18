type FeatureGridItem = {
  title: string;
  body: string;
};

type FeatureGridProps = {
  heading: string;
  items: FeatureGridItem[];
};

export default function FeatureGrid({ heading, items }: FeatureGridProps) {
  return (
    <section className="border-y border-line bg-white/50">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-display text-3xl font-semibold tracking-tight">{heading}</h2>
        <div className="layer-bar mt-3 w-24 rounded-full" aria-hidden="true" />
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {items.map((item, i) => (
            <div key={item.title} className="rounded-2xl border border-line bg-filament/60 p-6">
              <span className="font-mono text-xs tracking-widest text-teal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold text-charcoal">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-ink/80">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
