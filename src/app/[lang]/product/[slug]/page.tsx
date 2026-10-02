import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailScreen from "@/screens/ProductDetailScreen";
import { getDictionary, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import { findProduct, generateProductStaticParams, getProducts } from "@/lib/products";

export function generateStaticParams() {
  return generateProductStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lang = await resolveLocale(params);
  const catalog = await getProducts(lang);
  const found = findProduct(catalog, slug);
  if (!found) return {};

  return pageMetadata({
    lang,
    path: `product/${slug}`,
    title: found.item.seo.title,
    description: found.item.seo.description,
    keywords: found.item.seo.keywords,
    image: found.item.images[0]?.src,
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = await params;
  const lang = await resolveLocale(params);
  const dict = await getDictionary(lang);
  const catalog = await getProducts(lang);
  const found = findProduct(catalog, slug);
  if (!found) notFound();

  return (
    <ProductDetailScreen
      lang={lang}
      dict={dict}
      item={found.item}
      category={found.category}
    />
  );
}
