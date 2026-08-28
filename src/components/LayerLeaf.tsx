/**
 * Signature element: a maple leaf that "finishes printing" in horizontal
 * layers from the bottom up — a metaphor for "Maple" + layer-by-layer 3D
 * printing.
 *
 * Pure SVG + CSS, no client JS (server component). The layer-rise animation
 * lives in app/globals.css and is disabled under prefers-reduced-motion.
 *
 * Pass `title` for a meaningful label; pass "" (default) to mark it
 * decorative (aria-hidden), e.g. next to the wordmark in the header.
 */

type LayerLeafProps = {
  className?: string;
  title?: string;
};

// Layer colours cycled: maple syrup -> filament spool -> graphite
const LAYER_COLORS = [
  "#B9722E",
  "#C98A45",
  "#2F6E64",
  "#3C8378",
  "#B9722E",
  "#8F551F",
  "#2F6E64",
  "#22201D",
  "#8F551F",
];

export default function LayerLeaf({ className, title = "" }: LayerLeafProps) {
  const decorative = title.length === 0;
  const vb = 512;
  const rowH = vb / LAYER_COLORS.length;

  return (
    <svg
      viewBox={`0 0 ${vb} ${vb}`}
      className={className}
      role="img"
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {!decorative && <title>{title}</title>}
      <defs>
        <clipPath id="maple-leaf-clip">
          {/* Maple leaf (the canonical Canadian-flag silhouette) */}
          <path d="M383.8 351.7c46.5-40.9 105.6-93 105.6-93l-13.7-4.8c-12.9-4.5-8.4-22.6-4.6-36.8l13.6-50.9-46.3 9.8c-4.6 1-9.2-2-10.2-6.6l-6-27.9-42.4 47.4c-5.8 6.6-19.6 3.3-14.8-16.6l19.5-99.9-31.3 17.3c-8.8 4.9-17.7-.6-19.4-9L256 3.7l-16.4 83.3c-1.7 8.4-10.6 13.9-19.4 9l-31.3-17.3 19.5 99.9c4.8 19.9-9 23.2-14.8 16.6l-42.4-47.4-6 27.9c-1 4.6-5.6 7.6-10.2 6.6l-46.3-9.8 13.6 50.9c3.8 14.2 8.3 32.3-4.6 36.8l-13.7 4.8s59.1 52.1 105.6 93c9.4 8 6.7 11.5 3.8 20.7l-8.9 29 90.3-13.5c2.8 0 6.7 3.4 6.7 7.5l-3.5 100.6h27.9l-3.5-100.6c0-4.1 3.9-7.5 6.7-7.5l90.3 13.5-8.9-29c-2.9-9.2-5.6-12.7 3.8-20.7z" />
        </clipPath>
      </defs>

      <g clipPath="url(#maple-leaf-clip)" className="layer-rise">
        {LAYER_COLORS.map((color, i) => (
          <rect
            key={i}
            x="0"
            y={vb - (i + 1) * rowH}
            width={vb}
            height={rowH + 0.5}
            fill={color}
            style={{ animationDelay: `${i * 90}ms` }}
          />
        ))}
      </g>
    </svg>
  );
}
