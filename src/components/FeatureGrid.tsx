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
    <section className="border-y border-line bg-white/30">
      <div className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="font-display text-2xl font-medium">{heading}</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-lg font-medium text-charcoal">
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
