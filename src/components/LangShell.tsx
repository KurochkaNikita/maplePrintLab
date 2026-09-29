import "@/app/globals.css";
import {Space_Grotesk, IBM_Plex_Sans, IBM_Plex_Mono, Fraunces} from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getDictionary, localeTag, type Locale } from "@/lib/i18n";

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

/**
 * The <html>/<body> shell shared by the localized layout and the root "/"
 * page (which serves the default locale's content without redirecting).
 */
export default async function LangShell({
  lang,
  children,
}: {
  lang: Locale;
  children: React.ReactNode;
}) {
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
