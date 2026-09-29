import type { Metadata } from "next";
import ProductScreen from "@/screens/ProductScreen";
import { getDictionary, locales, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { getProducts } from "@/lib/products";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const lang = await resolveLocale(params);
  const dict = await getDictionary(lang);
  return pageMetadata({
    lang,
    path: "products",
    title: dict.meta.products.title,
    description: dict.meta.products.description,
  });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = await resolveLocale(params);
  const dict = await getDictionary(lang);
  const catalog = await getProducts(lang);

  return <ProductScreen lang={lang} dict={dict} catalog={catalog} />;
}
