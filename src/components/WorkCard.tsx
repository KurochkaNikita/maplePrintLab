/**
 * A work card. Until real photos exist, the image slot is a coloured gradient
 * block in brand tones.
 *
 * HOW TO SWAP IN A PHOTO once shots are available:
 *   1. Put files in public/work/ (e.g. public/work/dragon.jpg), compressed to
 *      ~200 KB, ideally 4:3.
 *   2. import Image from "next/image";
 *   3. Add an `image?: string` prop and replace the placeholder block with:
 *        <Image src={image} alt={title} width={800} height={600}
 *               className="aspect-[4/3] w-full object-cover" />
 *      (images.unoptimized: true is already set in next.config.mjs for export)
 */

type Tone = "amber" | "teal" | "charcoal";

type WorkCardProps = {
  title: string;
  material: string;
  note: string;
  tone?: Tone;
  photoSoonLabel: string;
};

const TONE_GRADIENT: Record<Tone, string> = {
  amber: "from-amber via-amber-deep to-charcoal",
  teal: "from-teal via-[#255a52] to-charcoal",
  charcoal: "from-[#3a3733] via-charcoal to-[#171613]",
};

export default function WorkCard({
  title,
  material,
  note,
  tone = "amber",
  photoSoonLabel,
}: WorkCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-line bg-white/40">
      <div
        className={`aspect-[4/3] w-full bg-gradient-to-br ${TONE_GRADIENT[tone]} relative`}
        aria-hidden="true"
      >
        <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-wider text-filament/80">
          {photoSoonLabel}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-base font-medium text-charcoal">
            {title}
          </h3>
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-wider text-teal">
            {material}
          </span>
        </div>
        <p className="mt-1.5 text-sm text-ink/80">{note}</p>
      </div>
    </article>
  );
}
