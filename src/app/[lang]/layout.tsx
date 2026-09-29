import type { Metadata } from "next";
import {Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono, Fraunces} from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getDictionary, localeTag, locales, resolveLocale } from "@/lib/i18n";
import { rootMetadata } from "@/lib/metadata";

const display = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const accent = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: ["500"],
  style: ["italic"],
  variable: "--font-accent",
  display: "swap",
  preload: false,
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang: lang ?? 'en' }));
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
  const dict = await getDictionary(lang);

  return (
    <html
      lang={localeTag[lang]}
      className={`${display.variable} ${body.variable} ${mono.variable} ${accent.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <JsonLd lang={lang} dict={dict} />
        <Header lang={lang} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer lang={lang} dict={dict} />
      </body>
    </html>
  );
}
