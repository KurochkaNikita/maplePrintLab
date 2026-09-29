import type { Metadata } from "next";
import HomeScreen from "@/screens/HomeScreen";
import { getDictionary, locales, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { FEATURED_SLUGS, findProduct, getProducts } from "@/lib/products";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = await resolveLocale(params);
  return pageMetadata({ lang, path: "" });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = await resolveLocale(params);
  const dict = await getDictionary(lang);
  const catalog = await getProducts(lang);

  const latestItems = FEATURED_SLUGS.map(
    (slug) => findProduct(catalog, slug)?.item,
  ).filter((item) => item !== undefined);

  return <HomeScreen lang={lang} dict={dict} latestItems={latestItems} />;
}
