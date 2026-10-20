"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/Button";
import PublishBar from "@/components/PublishBar";
import { authClient } from "@/lib/auth/client";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useT } from "@/components/LocaleProvider";

export interface AdminShellProps {
  children: ReactNode;
  unpublishedCount?: number;
}

const navItems: {
  href: string;
  key: "products" | "categories" | "collections" | "redirects";
  icon: ReactNode;
}[] = [
  {
    href: "/products",
    key: "products",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-5 w-5 shrink-0"
      >
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
  },
  {
    href: "/categories",
    key: "categories",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-5 w-5 shrink-0"
      >
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </svg>
    ),
  },
  {
    href: "/collections",
    key: "collections",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-5 w-5 shrink-0"
      >
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    href: "/redirects",
    key: "redirects",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-5 w-5 shrink-0"
      >
        <path d="M9 18l6-6-6-6" />
        <path d="M4 12h16" />
      </svg>
    ),
  },
];

export function AdminShell({
  children,
  unpublishedCount = 0,
}: AdminShellProps) {
  const t = useT();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Закрывать мобильное меню при переходе на другую страницу или нажатии Escape
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  function isItemActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-filament">
      <div className="layer-bar" aria-hidden="true" />

      {/* Шапка */}
      <header className="sticky top-0 z-30 border-b border-line bg-filament/95 backdrop-blur supports-[backdrop-filter]:bg-filament/85">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Кнопка меню на мобильных */}
            <button
              ref={menuButtonRef}
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="admin-navigation"
              aria-label={
                mobileMenuOpen ? t.a11y.closeMenu : t.a11y.openMenu
              }
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-charcoal/25 bg-white text-charcoal transition-colors hover:bg-charcoal/5 lg:hidden"
            >
              {mobileMenuOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg py-1.5 pr-1 font-display text-base font-semibold tracking-tight text-charcoal sm:gap-2.5 sm:pr-2 sm:text-lg"
            >
              <img
                src="/brand/logo-on-light.svg"
                alt=""
                aria-hidden="true"
                width={32}
                height={36}
                className="h-8 w-7 shrink-0 sm:h-9 sm:w-8"
              />
              <span className="whitespace-nowrap">{t.brand.name}</span>
            </Link>
          </div>

          {/* Статус публикации и кнопка «Выйти» на планшете */}
          <div className="flex items-center justify-end gap-3">
            <PublishBar unpublishedCount={unpublishedCount} />

            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={isLoggingOut}
              onClick={handleLogout}
              className="hidden sm:inline-flex lg:hidden"
            >
              {t.shell.logout}
            </Button>
          </div>
        </div>
      </header>

      {/* Основной каркас: Боковое меню + Контент */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row">
        <nav
          id="admin-navigation"
          aria-label={t.a11y.primaryNav}
          className={`${
            mobileMenuOpen ? "block" : "hidden"
          } border-b border-line bg-white px-4 py-4 lg:block lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:bg-transparent lg:px-6 lg:py-8`}
        >
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const active = isItemActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "border-l-4 border-amber-deep bg-charcoal font-semibold text-filament shadow-sm"
                        : "text-charcoal hover:bg-charcoal/5"
                    }`}
                  >
                    {item.icon}
                    <span>{t.shell.nav[item.key]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Переключатель языка и кнопка «Выйти» внизу боковой панели */}
          <div className="mt-6 space-y-3 border-t border-line pt-4">
            <LanguageSwitcher className="w-full" />

            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={isLoggingOut}
              onClick={handleLogout}
              className="w-full justify-center sm:hidden lg:inline-flex"
            >
              {t.shell.logout}
            </Button>
          </div>
        </nav>

        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminShell;
