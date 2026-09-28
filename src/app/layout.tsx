/**
 * Pass-through root layout. The real <html>/<body> shell lives in
 * app/[lang]/layout.tsx so <html lang> reflects the locale; app/page.tsx
 * only performs the "/" -> "/en/" redirect and needs no shell.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
