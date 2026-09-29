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
