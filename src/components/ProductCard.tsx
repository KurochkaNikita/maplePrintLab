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
  preload = false,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-lg border border-line bg-white/40 transition-shadow hover:shadow-md"
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          preload={preload}
          sizes="(min-width: 640px) 33vw, 100vw"
          className="aspect-[4/3] w-full border-b border-line object-cover"
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

      <div className="p-4">
        <h3 className="font-display text-base font-medium text-charcoal group-hover:text-amber">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-ink/80">{note}</p>
        {price && <p className="mt-2 font-display text-sm font-medium text-charcoal">{price}</p>}
      </div>
    </Link>
  );
}
