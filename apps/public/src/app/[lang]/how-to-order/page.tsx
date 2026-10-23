import type { Metadata } from "next";
import HowToOrderScreen from "@/screens/HowToOrderScreen";
import { getDictionary, locales, resolveLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/metadata";

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
    path: "how-to-order",
    title: dict.meta.howToOrder.title,
    description: dict.meta.howToOrder.description,
  });
}

export default async function HowToOrderPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = await resolveLocale(params);
  const dict = await getDictionary(lang);

  return <HowToOrderScreen lang={lang} dict={dict} />;
}
