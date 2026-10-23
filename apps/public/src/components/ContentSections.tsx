export type ContentSection = { heading: string; paragraphs: string[] };

type ContentSectionsProps = {
  sections: ContentSection[];
  className?: string;
};

/** Long-form copy: each section is an <h2> followed by paragraphs. */
export default function ContentSections({ sections, className }: ContentSectionsProps) {
  return (
    <div className={className}>
      {sections.map((section) => (
        <section key={section.heading} className="mt-10 first:mt-0">
          <h2 className="font-display text-2xl font-semibold text-charcoal">{section.heading}</h2>
          {section.paragraphs.map((text) => (
            <p key={text} className="mt-3 text-ink/80">
              {text}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
