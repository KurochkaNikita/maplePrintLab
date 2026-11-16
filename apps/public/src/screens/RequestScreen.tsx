import Link from "next/link";
import RequestContent from "@/components/request/RequestContent";
import { localeHref, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/dictionaries/en";
import type { CartCatalogEntry } from "@/lib/order/types";
import { siteConfig } from "@/lib/site-config";

type RequestScreenProps = {
  lang: Locale;
  dict: Dictionary;
  catalog: CartCatalogEntry[];
};

/** The page where the visitor reviews the pieces they picked and sends one request. */
export default function RequestScreen({ lang, dict, catalog }: RequestScreenProps) {
  const t = dict.order;

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-14">
      <RequestContent
        lang={lang}
        labels={t}
        catalog={catalog}
        supportEmail={siteConfig.email}
        productsHref={localeHref(lang, "products")}
        homeHref={localeHref(lang, "")}
        heading={t.heading}
      >
        <noscript>
          <p className="text-charcoal">
            {t.noscript}{" "}
            <Link href={localeHref(lang, "contact")} className="inline-block py-2 underline underline-offset-4">
              {t.noscriptLink}
            </Link>
          </p>
        </noscript>
      </RequestContent>
    </div>
  );
}
