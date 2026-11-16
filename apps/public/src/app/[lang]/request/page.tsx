import type { Metadata } from "next";
import RequestScreen from "@/screens/RequestScreen";
import { getDictionary, locales, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { formatPrice } from "@/lib/price";
import { getProducts } from "@/lib/products";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const lang = await resolveLocale(params);
  const dict = await getDictionary(lang);
  // The list lives in the visitor's browser, so there is nothing here for a search engine to index.
  return pageMetadata({ lang, path: "request", title: dict.meta.request.title, description: dict.meta.request.description, noindex: true });
}

export default async function RequestPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await resolveLocale(params);
  const dict = await getDictionary(lang);
  const catalog = (await getProducts(lang)).flatMap((category) =>
    category.items.map((item) => ({
      slug: item.slug,
      title: item.title,
      price: formatPrice(item.price, lang, dict),
      image: item.images[0],
    })),
  );

  return <RequestScreen lang={lang} dict={dict} catalog={catalog} />;
}
