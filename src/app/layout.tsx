import type { Metadata } from "next";

export const metadata: Metadata = {
  // Files live in public/. The ico is listed first for old browsers; modern
  // ones pick the SVG (which follows the OS dark/light theme).
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

/**
 * Pass-through root layout. The <html>/<body> shell lives in
 * components/LangShell.tsx (used by app/[lang]/layout.tsx and app/page.tsx)
 * so <html lang> reflects the locale.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
