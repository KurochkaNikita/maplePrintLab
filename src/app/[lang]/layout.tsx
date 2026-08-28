import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Space_Grotesk,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  Fraunces,
} from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { siteConfig } from "@/lib/site-config";
import {
  getDictionary,
  isLocale,
  localeTag,
  locales,
  type Locale,
} from "@/lib/i18n";

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
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  if (!isLocale(params.lang)) return {};
  const lang = params.lang;
  const dict = await getDictionary(lang);

  const languages = Object.fromEntries(
    locales.map((l) => [localeTag[l], `/${l}/`]),
  );

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: dict.meta.defaultTitle,
      template: dict.meta.titleTemplate,
    },
    description: dict.meta.description,
    keywords: dict.meta.keywords,
    applicationName: siteConfig.name,
    alternates: {
      canonical: `/${lang}/`,
      languages: { ...languages, "x-default": "/en/" },
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: dict.meta.defaultTitle,
      description: dict.meta.description,
      url: `${siteConfig.url}/${lang}/`,
      locale: localeTag[lang].replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.defaultTitle,
      description: dict.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isLocale(params.lang)) notFound();
  const lang: Locale = params.lang;
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
