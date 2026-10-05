import Link from "next/link";

type CategoryCardProps = {
  href: string;
  title: string;
  intro: string;
  countLabel: string;
  coverLabel: string;
};

/** Category tile; the cover is a placeholder until real images exist (see `CategoryHeader`). */
export default function CategoryCard({
  href,
  title,
  intro,
  countLabel,
  coverLabel,
}: CategoryCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white/40 transition-shadow hover:shadow-md"
    >
      <div
        className="relative aspect-[4/3] w-full border-b border-line bg-white"
        aria-hidden="true"
      >
        <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-wider text-ink/80">
          {coverLabel}
        </span>
      </div>
      <div className="flex-1 p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-base font-medium text-charcoal group-hover:text-amber">
            {title}
          </h3>
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-teal">
            {countLabel}
          </span>
        </div>
        <p className="mt-1.5 line-clamp-4 text-sm text-ink/80">{intro}</p>
      </div>
    </Link>
  );
}
