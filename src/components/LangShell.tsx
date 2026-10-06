import "@/app/globals.css";
import { Space_Grotesk, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LanguageSuggestion from "@/components/LanguageSuggestion";
import JsonLd from "@/components/JsonLd";
import { getDictionary, locales, localeTag, type Locale } from "@/lib/i18n";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

/**
 * The <html>/<body> shell shared by the localized layout and the root "/"
 * page (which serves the default locale's content without redirecting).
 */
export default async function LangShell({
  lang,
  bare = false,
  children,
}: {
  lang: Locale;
  /** Only <html>/<body> (+ analytics): the child renders its own header, main and footer. */
  bare?: boolean;
  children: React.ReactNode;
}) {
  const dict = await getDictionary(lang);
  const other = locales.find((l) => l !== lang) ?? lang;
  const otherDict = await getDictionary(other);

  return (
    <html
      lang={localeTag[lang]}
      className={`${display.variable} ${body.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        {bare ? (
          children
        ) : (
          <>
            <JsonLd lang={lang} dict={dict} />
            <Header lang={lang} dict={dict} />
            <main className="flex-1">{children}</main>
            <Footer lang={lang} dict={dict} />
            <LanguageSuggestion
              current={lang}
              suggested={{
                locale: other,
                message: otherDict.localeSwitcher.suggestion,
                cta: otherDict.localeSwitcher.suggestionCta,
                dismiss: otherDict.localeSwitcher.dismiss,
              }}
            />
          </>
        )}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
