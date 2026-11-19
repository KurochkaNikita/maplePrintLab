import PrivacySection from "@/components/privacy/PrivacySection";

type PrivacyGroupProps = {
  id: string;
  label: string;
  heading: string;
  intro: string;
  sections: readonly { id: string; heading: string; body: string }[];
};

export default function PrivacyGroup({ id, label, heading, intro, sections }: PrivacyGroupProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24">
      <div className="overflow-hidden rounded-2xl bg-charcoal text-filament">
        <div className="layer-bar" aria-hidden="true" />
        <div className="p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-wider text-filament/80">{label}</p>
          <h2 id={`${id}-title`} className="mt-2 font-display text-2xl font-semibold text-filament sm:text-3xl">
            {heading}
          </h2>
          <p className="mt-3 max-w-2xl text-filament/80">{intro}</p>
        </div>
      </div>
      <div className="mt-5 space-y-5">
        {sections.map((section, i) => (
          <PrivacySection key={section.id} id={section.id} index={i} heading={section.heading} body={section.body} />
        ))}
      </div>
    </section>
  );
}
