import type { Metadata } from "next";
import ContactScreen from "@/screens/ContactScreen";
import { getDictionary, locales, pageMetadata, resolveLocale } from "@/lib/i18n";

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
    path: "contact",
    title: dict.meta.contact.title,
    description: dict.meta.contact.description,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = await resolveLocale(params);
  const dict = await getDictionary(lang);

  return <ContactScreen dict={dict} />;
}
