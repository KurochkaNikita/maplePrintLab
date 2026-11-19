import type { Metadata } from "next";
import PrivacyScreen from "@/screens/PrivacyScreen";
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
    path: "privacy",
    title: dict.meta.privacy.title,
    description: dict.meta.privacy.description,
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = await resolveLocale(params);
  const dict = await getDictionary(lang);

  return <PrivacyScreen dict={dict} />;
}
