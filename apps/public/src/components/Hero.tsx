import type { ReactNode } from "react";

type HeroProps = {
  eyebrow?: string;
  title: string;
  accent?: string;
  body: string;
  actions?: ReactNode;
  media?: ReactNode;
};

export default function Hero({ eyebrow, title, accent, body, actions, media }: HeroProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="build-plate pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-10 sm:pb-16 sm:pt-14">
      <div className="grid items-center gap-12 sm:grid-cols-[1.4fr_1fr]">
        <div>
          {eyebrow && (
            <p className="inline-flex items-center gap-2 rounded-full border border-teal/30 bg-white/60 px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-teal">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" aria-hidden="true" />
              {eyebrow}
            </p>
          )}
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-charcoal sm:text-5xl">
            {title}
          </h1>
          {accent && (
            <p className="mt-4 max-w-xl font-accent text-lg text-amber-deep">
              {accent}
            </p>
          )}
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/80 sm:text-lg">{body}</p>
          {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
        </div>

        {media && (
          <div className="justify-self-center rounded-[2rem] border border-line bg-white/60 p-8 shadow-xl shadow-charcoal/5 sm:justify-self-end">
            {media}
          </div>
        )}
      </div>
      </div>
    </section>
  );
}
