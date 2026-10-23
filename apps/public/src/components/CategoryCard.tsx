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
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber/50 hover:shadow-xl hover:shadow-charcoal/10"
    >
      <div
        className="relative aspect-[4/3] w-full border-b border-line bg-white"
        aria-hidden="true"
      >
        <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-wider text-ink/80">
          {coverLabel}
        </span>
      </div>
      <div className="flex-1 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-base font-medium text-charcoal group-hover:text-amber-deep">
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
