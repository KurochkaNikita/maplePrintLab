type CategoryHeaderProps = {
  title: string;
  intro: string;
  highlight?: string;
  coverLabel: string;
};

/**
 * Category title + intro beside the cover image. Until real covers exist the
 * image slot is a placeholder block, same as `ProductCard`.
 */
export default function CategoryHeader({ title, intro, highlight, coverLabel }: CategoryHeaderProps) {
  return (
    <header className="mt-6 grid items-center gap-8 md:grid-cols-2">
      <div>
        <h1 className="font-display text-4xl font-semibold text-charcoal">{title}</h1>
        <p className="mt-3 max-w-md text-ink/80">{intro}</p>
        {highlight && (
          <p className="mt-4 inline-block rounded-md border border-amber/40 bg-amber/10 px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-amber-deep">
            {highlight}
          </p>
        )}
      </div>
      <div
        className="relative aspect-[16/9] w-full rounded-lg border border-line bg-white"
        aria-hidden="true"
      >
        <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-wider text-ink/50">
          {coverLabel}
        </span>
      </div>
    </header>
  );
}
