import CtaLink from "@/components/CtaLink";

type CtaBannerProps = {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function CtaBanner({ heading, body, ctaLabel, ctaHref }: CtaBannerProps) {
  return (
    <section className="border-t border-line bg-charcoal text-filament">
      <div className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="font-display text-2xl font-medium text-filament">{heading}</h2>
        <p className="mt-3 max-w-2xl text-filament/80">{body}</p>
        <div className="mt-6">
          <CtaLink href={ctaHref}>{ctaLabel}</CtaLink>
        </div>
      </div>
    </section>
  );
}
