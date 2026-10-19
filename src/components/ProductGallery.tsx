"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ResolvedImage } from "@/lib/products";

type ProductGalleryProps = {
  /** Product name, shown in the lightbox header. */
  title: string;
  images: ResolvedImage[];
  photoSoonLabel: string;
  labels: {
    open: string;
    close: string;
    prev: string;
    next: string;
    /** "Photo {n} of {total}" */
    counter: string;
    thumbs: string;
  };
};

function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const overlayBtn =
  "flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/30";

/**
 * Main photo + small thumbnails below. Thumbnails switch the main photo; clicking
 * the main photo opens a full-screen lightbox that swipes (scroll-snap), has
 * arrows and supports ←/→/Esc.
 */
export default function ProductGallery({ title, images, photoSoonLabel, labels }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const track = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const total = images.length;

  const goTo = useCallback((index: number, smooth = true) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: smooth ? "smooth" : "auto" });
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      const next = (active + dir + total) % total;
      setActive(next);
      goTo(next);
    },
    [active, total, goTo],
  );

  const close = useCallback(() => {
    setOpen(false);
    opener.current?.focus();
  }, []);

  // Jump to the current photo when the lightbox opens; lock page scroll.
  useEffect(() => {
    if (!open) return;
    goTo(active, false);
    closeBtn.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step, close]);

  if (total === 0) {
    return (
      <div
        className="relative aspect-[4/3] w-full rounded-2xl border border-line bg-white"
        aria-hidden="true"
      >
        <span className="absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-wider text-ink/80">
          {photoSoonLabel}
        </span>
      </div>
    );
  }

  const main = images[active];
  const counter = (n: number) =>
    labels.counter.replace("{n}", String(n)).replace("{total}", String(total));

  return (
    <div>
      <button
        type="button"
        onClick={(e) => {
          opener.current = e.currentTarget;
          setOpen(true);
        }}
        aria-label={`${labels.open}: ${main.alt}`}
        className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-line shadow-sm"
      >
        <Image
          key={main.src}
          src={main.src}
          alt={main.alt}
          width={main.width}
          height={main.height}
          preload={active === 0}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/80 text-white"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </span>
      </button>

      {total > 1 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label={labels.thumbs}>
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={counter(i + 1)}
                aria-current={i === active}
                className={`block h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors sm:h-[72px] sm:w-[72px] ${
                  i === active ? "border-amber-deep" : "border-line hover:border-ink/40"
                }`}
              >
                <Image
                  src={img.src}
                  alt=""
                  aria-hidden="true"
                  width={img.width}
                  height={img.height}
                  sizes="72px"
                  className="h-full w-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 flex flex-col bg-neutral-900/80 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 text-white">
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold sm:text-lg">{title}</p>
              <p className="font-mono text-xs uppercase tracking-wider text-white/80" aria-live="polite">
                {counter(active + 1)}
              </p>
            </div>
            <button ref={closeBtn} type="button" onClick={close} aria-label={labels.close} className={overlayBtn}>
              <Icon d="M6 6l12 12M18 6L6 18" />
            </button>
          </div>

          <div className="relative min-h-0 flex-1">
            <div
              ref={track}
              onScroll={(e) => {
                const el = e.currentTarget;
                const i = Math.round(el.scrollLeft / el.clientWidth);
                if (i !== active && i >= 0 && i < total) setActive(i);
              }}
              className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {images.map((img, i) => (
                <div
                  key={img.src}
                  className="flex h-full w-full shrink-0 snap-center items-center justify-center px-4 sm:px-20"
                  aria-hidden={i !== active}
                  onClick={(e) => {
                    if (e.target === e.currentTarget) close();
                  }}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes="100vw"
                    loading="eager"
                    className="h-full w-full rounded-lg object-contain"
                  />
                </div>
              ))}
            </div>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={labels.prev}
                  className={`${overlayBtn} absolute left-3 top-1/2 hidden -translate-y-1/2 sm:flex`}
                >
                  <Icon d="M15 5l-7 7 7 7" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={labels.next}
                  className={`${overlayBtn} absolute right-3 top-1/2 hidden -translate-y-1/2 sm:flex`}
                >
                  <Icon d="M9 5l7 7-7 7" />
                </button>
              </>
            )}
          </div>

          {total > 1 && (
            <ul className="flex justify-center gap-2 px-4 py-4" aria-hidden="true">
              {images.map((img, i) => (
                <li key={img.src}>
                  <span className={`block h-2 rounded-full transition-all ${i === active ? "w-6 bg-white" : "w-2 bg-white/40"}`} />
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
