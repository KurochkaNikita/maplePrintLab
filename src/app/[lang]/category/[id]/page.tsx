import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryScreen from "@/screens/CategoryScreen";
import { getDictionary, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";
import {
  findCategory,
  generateCategoryStaticParams,
  getProducts,
} from "@/lib/products";

export function generateStaticParams() {
  return generateCategoryStaticParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lang = await resolveLocale(params);
  const category = findCategory(await getProducts(lang), id);
  if (!category) return {};

  return pageMetadata({
    lang,
    path: `category/${id}`,
    title: category.seo.title,
    description: category.seo.description,
    keywords: category.seo.keywords,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { id } = await params;
  const lang = await resolveLocale(params);
  const dict = await getDictionary(lang);
  const category = findCategory(await getProducts(lang), id);
  if (!category) notFound();

  return <CategoryScreen lang={lang} dict={dict} category={category} />;
}
