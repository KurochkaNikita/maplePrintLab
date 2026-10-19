import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  href: string;
  title: string;
  note: string;
  /** Formatted price, e.g. "$20 CAD" or "From $0.90 CAD / pc". */
  price?: string;
  image?: { src: string; width: number; height: number; alt: string };
  photoSoonLabel: string;
  /** Shows a "New" badge over the image. */
  newLabel?: string;
  /** Above-the-fold image: preload it instead of lazy-loading (LCP). */
  preload?: boolean;
};

export default function ProductCard({
  href,
  title,
  note,
  price,
  image,
  photoSoonLabel,
  newLabel,
  preload = false,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber/50 hover:shadow-xl hover:shadow-charcoal/10"
    >
      <div className="relative overflow-hidden">
      {newLabel && (
        <span className="absolute left-3 top-3 z-10 rounded-full bg-amber-deep px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-white shadow">
          {newLabel}
        </span>
      )}
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          preload={preload}
          sizes="(min-width: 640px) 33vw, 100vw"
          className="aspect-[4/3] w-full border-b border-line object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="relative aspect-[4/3] w-full border-b border-line bg-white"
          aria-hidden="true"
        >
          <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-wider text-ink/80">
            {photoSoonLabel}
          </span>
        </div>
      )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-base font-medium text-charcoal group-hover:text-amber-deep">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-ink/80">{note}</p>
        {price && (
          <p className="mt-auto pt-4 font-display text-lg font-semibold text-charcoal">{price}</p>
        )}
      </div>
    </Link>
  );
}
