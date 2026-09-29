import type { Metadata } from "next";
import LangShell from "@/components/LangShell";
import { getDictionary, locales, resolveLocale } from "@/lib/i18n";
import { rootMetadata } from "@/lib/metadata";

export const dynamicParams = false;

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

  return rootMetadata(lang, dict);
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const lang = await resolveLocale(params);

  return <LangShell lang={lang}>{children}</LangShell>;
}
