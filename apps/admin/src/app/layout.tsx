import type { Metadata } from "next";
import { Manrope, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { t } from "@/lib/i18n";

// Manrope has Cyrillic glyphs; Space Grotesk (used on the storefront) does not.
const display = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="visually-hidden fixed left-4 top-4 z-50 rounded-md bg-charcoal px-4 py-3 font-mono text-xs font-medium uppercase tracking-wider text-filament shadow-lg"
        >
          {t.a11y.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
