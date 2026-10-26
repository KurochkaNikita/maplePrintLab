"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/Button";
import PublishBar from "@/components/PublishBar";
import { authClient } from "@/lib/auth/client";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useT } from "@/components/LocaleProvider";
import ArrowRightIcon from "@/icons/arrow-right.svg";
import CloseIcon from "@/icons/close.svg";
import GridIcon from "@/icons/grid.svg";
import MenuIcon from "@/icons/menu.svg";
import PackageIcon from "@/icons/package.svg";
import StarIcon from "@/icons/star.svg";

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
      <PackageIcon className="h-5 w-5 shrink-0" />
    ),
  },
  {
    href: "/categories",
    key: "categories",
    icon: (
      <GridIcon className="h-5 w-5 shrink-0" />
    ),
  },
  {
    href: "/collections",
    key: "collections",
    icon: (
      <StarIcon className="h-5 w-5 shrink-0" />
    ),
  },
  {
    href: "/redirects",
    key: "redirects",
    icon: (
      <ArrowRightIcon className="h-5 w-5 shrink-0" />
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
                <CloseIcon className="h-6 w-6" />
              ) : (
                <MenuIcon className="h-6 w-6" />
              )}
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg py-1.5 pr-1 font-display text-base font-semibold tracking-tight text-charcoal sm:gap-2.5 sm:pr-2 sm:text-lg"
            >
              <Image
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
