import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
// Fonts are self-hosted (Fontsource) rather than next/font/google: that fetches from
// fonts.googleapis.com at build time and crashed the Vercel build ("reading '1'").
import "@fontsource-variable/manrope/wght.css";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/cyrillic-400.css";
import "@fontsource/ibm-plex-sans/cyrillic-500.css";
import "@fontsource/ibm-plex-sans/cyrillic-600.css";
import "./globals.css";
import { LocaleProvider } from "@/components/LocaleProvider";
import { dictionaries } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictionaries[await getLocale()];
  return {
    title: {
      default: `${t.pages.dashboard.metaTitle}${t.brand.titleSuffix}`,
      template: `%s${t.brand.titleSuffix}`,
    },
    robots: {
      index: false,
      follow: false,
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      ],
      apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const t = dictionaries[locale];

  return (
    <html lang={locale}>
      {/* Browser extensions (e.g. Grammarly) inject attributes into <body> before hydration. */}
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        {/* noinspection HtmlUnknownAnchorTarget */}
        <a
          href="#main-content"
          className="visually-hidden fixed left-4 top-4 z-50 rounded-md bg-charcoal px-4 py-3 font-mono text-xs font-medium uppercase tracking-wider text-filament shadow-lg"
        >
          {t.a11y.skipToContent}
        </a>
        <LocaleProvider locale={locale} dictionary={t}>
          {children}
        </LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
