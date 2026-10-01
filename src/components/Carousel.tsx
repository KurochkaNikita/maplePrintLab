"use client";

import { useRef, type ReactNode } from "react";

type CarouselProps = {
  heading: ReactNode;
  children: ReactNode[];
  prevLabel: string;
  nextLabel: string;
};

const arrowClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white/60 text-charcoal transition-colors hover:border-amber hover:text-amber";

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

/** Horizontal scroll-snap carousel; the arrows scroll by one visible page. */
export default function Carousel({ heading, children, prevLabel, nextLabel }: CarouselProps) {
  const track = useRef<HTMLUListElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        {heading}
        <div className="flex gap-2">
          <button type="button" onClick={() => scroll(-1)} aria-label={prevLabel} className={arrowClass}>
            <Chevron direction="left" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label={nextLabel} className={arrowClass}>
            <Chevron direction="right" />
          </button>
        </div>
      </div>
      <ul
        ref={track}
        className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto scroll-smooth px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, i) => (
          <li
            key={i}
            className="w-[75%] shrink-0 snap-start sm:w-[calc((100%-3rem)/3)]"
          >
            {child}
          </li>
        ))}
      </ul>
    </div>
  );
}
