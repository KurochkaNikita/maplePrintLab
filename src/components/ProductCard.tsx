/**
 * A product card. Until real photos exist, the image slot is a plain white
 * placeholder block.
 *
 * HOW TO SWAP IN A PHOTO once shots are available:
 *   1. Put files in public/product/ (e.g. public/product/dragon.jpg), compressed to
 *      ~200 KB, ideally 4:3.
 *   2. import Image from "next/image";
 *   3. Add an `image?: string` prop and replace the placeholder block with:
 *        <Image src={image} alt={title} width={800} height={600}
 *               className="aspect-[4/3] w-full object-cover" />
 *      (images.unoptimized: true is already set in next.config.mjs for export)
 */
import Link from "next/link";

type ProductCardProps = {
  href: string;
  title: string;
  note: string;
  photoSoonLabel: string;
};

export default function ProductCard({
  href,
  title,
  note,
  photoSoonLabel,
}: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-lg border border-line bg-white/40 transition-shadow hover:shadow-md"
    >
      <div
        className="relative aspect-[4/3] w-full border-b border-line bg-white"
        aria-hidden="true"
      >
        <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-wider text-ink/50">
          {photoSoonLabel}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-display text-base font-medium text-charcoal group-hover:text-amber">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-ink/80">{note}</p>
      </div>
    </Link>
  );
}
