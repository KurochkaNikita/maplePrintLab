import type { Metadata } from "next";
import WorkScreen from "@/screens/WorkScreen";
import { getDictionary, locales, pageMetadata, resolveLocale } from "@/lib/i18n";
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
    path: "work",
    title: dict.meta.work.title,
    description: dict.meta.work.description,
  });
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = await resolveLocale(params);
  const dict = await getDictionary(lang);
  const catalog = await getProducts(lang);

  return <WorkScreen lang={lang} dict={dict} catalog={catalog} />;
}
