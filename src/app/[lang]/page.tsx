import type { Metadata } from "next";
import HomeScreen from "@/screens/HomeScreen";
import { getDictionary, locales, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getFeaturedItems, getProducts } from "@/lib/products";

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

  const latestItems = getFeaturedItems(catalog);

  return <HomeScreen lang={lang} dict={dict} categories={catalog} latestItems={latestItems} />;
}
