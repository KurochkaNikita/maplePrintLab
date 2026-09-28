import { siteConfig } from "@/lib/site-config";
import type { Dictionary } from "@/lib/dictionaries/en";

type ContactScreenProps = {
  dict: Dictionary;
};

export default function ContactScreen({ dict }: ContactScreenProps) {
  const t = dict.contact;

  return (
    <div className="mx-auto max-w-3xl px-5 pb-24 pt-14">
      <h1 className="font-display text-4xl font-semibold text-charcoal">
        {t.title}
      </h1>
      <p className="mt-4 max-w-xl text-ink/80">{t.intro}</p>

      <dl className="mt-10 space-y-6">
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-teal">
            {t.emailLabel}
          </dt>
          <dd className="mt-1">
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-display text-lg text-charcoal hover:text-amber"
            >
              {siteConfig.email}
            </a>
          </dd>
        </div>

        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-teal">
            {t.instagramLabel}
          </dt>
          <dd className="mt-1">
            <a
              href={siteConfig.instagram}
              rel="me noopener"
              target="_blank"
              className="font-display text-lg text-charcoal hover:text-amber"
            >
              {siteConfig.instagramHandle}
            </a>
          </dd>
        </div>

        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-teal">
            {t.regionLabel}
          </dt>
          <dd className="mt-1 font-display text-lg text-charcoal">
            {dict.region}
          </dd>
        </div>
      </dl>

      <p className="mt-10 text-sm text-ink/60">{t.note}</p>
    </div>
  );
}
