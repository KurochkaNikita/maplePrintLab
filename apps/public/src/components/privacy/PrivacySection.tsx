type PrivacySectionProps = {
  id: string;
  index: number;
  heading: string;
  body: string;
};

export default function PrivacySection({ id, index, heading, body }: PrivacySectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 rounded-2xl border border-line bg-white p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-charcoal font-display text-sm text-filament"
        >
          {index + 1}
        </span>
        <div>
          <h2 id={`${id}-title`} className="font-display text-xl font-semibold text-charcoal sm:text-2xl">
            {heading}
          </h2>
          <p className="mt-3 max-w-2xl text-ink/80">{body}</p>
        </div>
      </div>
    </section>
  );
}
