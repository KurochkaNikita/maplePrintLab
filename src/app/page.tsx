import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { locales, localeTag } from "@/lib/i18n";
import RootRedirect from "./root-redirect";

/**
 * "/" has no locale. This page ships a language picker and a client-side
 * redirect to the visitor's best match. In the static export,
 * scripts/root-redirect.mjs additionally overwrites out/index.html with a
 * no-JS <meta refresh> version.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Maple Print Lab",
  alternates: {
    canonical: "/en/",
    languages: {
      ...Object.fromEntries(locales.map((l) => [localeTag[l], `/${l}/`])),
      "x-default": "/en/",
    },
  },
};

const NAMES: Record<string, string> = {
  en: "English",
  fr: "Français",
};

export default function RootPage() {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          background: "#F7F0E1",
          color: "#3A3F44",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <RootRedirect />
        <main style={{ textAlign: "center", padding: "2rem" }}>
          <p style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
            Maple Print Lab
          </p>
          <nav style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {locales.map((l) => (
              <a
                key={l}
                href={`/${l}/`}
                style={{ color: "#B9722E", textDecoration: "none", fontWeight: 500 }}
              >
                {NAMES[l] ?? l}
              </a>
            ))}
          </nav>
        </main>
      </body>
    </html>
  );
}
