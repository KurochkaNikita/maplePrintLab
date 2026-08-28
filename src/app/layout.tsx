/**
 * Pass-through root layout. The real <html>/<body> shell lives in
 * app/[lang]/layout.tsx so that <html lang> reflects the locale.
 * app/page.tsx (the "/" language redirect) provides its own shell.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
