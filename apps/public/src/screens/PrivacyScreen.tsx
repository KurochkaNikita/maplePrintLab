import PrivacyHighlights from "@/components/privacy/PrivacyHighlights";
import PrivacyGroup from "@/components/privacy/PrivacyGroup";
import PrivacyToc from "@/components/privacy/PrivacyToc";
import { siteConfig } from "@/lib/site-config";
import { ctaClassName } from "@/lib/cta-class";
import type { Dictionary } from "@/lib/dictionaries/en";

type PrivacyScreenProps = {
  dict: Dictionary;
};

export default function PrivacyScreen({ dict }: PrivacyScreenProps) {
  const t = dict.privacy;
  const groups = t.groups.map((group, g) => ({
    ...group,
    id: `part-${g + 1}`,
    sections: group.sections.map((section, i) => ({
      ...section,
      id: `part-${g + 1}-section-${i + 1}`,
      body: section.body.replace("{email}", siteConfig.email),
    })),
  }));

  return (
    <>
      <header className="relative overflow-hidden border-b border-line">
        <div className="build-plate absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-16">
          <p className="inline-block rounded-full border border-line bg-white px-3 py-1 font-mono text-xs uppercase tracking-wider text-teal">
            {t.badge}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-tight text-charcoal sm:text-5xl">
            {t.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink/80">{t.intro}</p>
          <p className="mt-3 font-mono text-xs text-ink/80">{t.updated}</p>
          <PrivacyHighlights items={t.highlights} />
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-24 pt-12 lg:grid-cols-[14rem_1fr]">
        <PrivacyToc
          heading={t.tocHeading}
          groups={groups.map((g) => ({
            id: g.id,
            label: g.heading,
            items: g.sections.map((s) => ({ id: s.id, label: s.heading })),
          }))}
        />

        <div className="space-y-14">
          {groups.map((group) => (
            <PrivacyGroup
              key={group.id}
              id={group.id}
              label={group.label}
              heading={group.heading}
              intro={group.intro}
              sections={group.sections}
            />
          ))}

          <section className="overflow-hidden rounded-2xl bg-charcoal text-filament">
            <div className="layer-bar" aria-hidden="true" />
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
              <h2 className="font-display text-xl font-semibold text-filament sm:text-2xl">{t.contactHeading}</h2>
              <a href={`mailto:${siteConfig.email}`} className={ctaClassName("solid")}>
                {t.contactLabel}
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
