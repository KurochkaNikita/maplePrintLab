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
    <section className="mx-auto max-w-5xl px-5 pb-16 pt-14 sm:pt-20">
      <div className="grid items-center gap-10 sm:grid-cols-[1.4fr_1fr]">
        <div>
          {eyebrow && (
            <p className="font-mono text-xs uppercase tracking-widest text-teal">
              {eyebrow}
            </p>
          )}
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-charcoal sm:text-5xl">
            {title}
          </h1>
          {accent && (
            <p className="mt-4 max-w-xl font-accent text-lg text-amber-deep">
              {accent}
            </p>
          )}
          <p className="mt-4 max-w-xl text-ink/80">{body}</p>
          {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
        </div>

        {media && <div className="justify-self-center sm:justify-self-end">{media}</div>}
      </div>
    </section>
  );
}
