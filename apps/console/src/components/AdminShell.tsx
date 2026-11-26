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
import NavGroupList from "@/components/nav/NavGroupList";
import { navGroups } from "@/components/nav/nav-groups";
import CloseIcon from "@/icons/close.svg";
import MenuIcon from "@/icons/menu.svg";

export interface AdminShellProps {
  children: ReactNode;
  /** Requests with status "new": shown as a badge next to "Requests" in the navigation. */
  newRequestCount?: number;
}

export function AdminShell({
  children,
  newRequestCount = 0,
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      router.replace("/login");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  };

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
            <PublishBar />

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
          } border-b border-line bg-white px-4 py-4 lg:block lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r lg:bg-transparent lg:px-6 lg:py-6`}
        >
          <div className="space-y-5">
            {navGroups.map((group) => (
              <NavGroupList key={group.id} group={group} pathname={pathname} newRequestCount={newRequestCount} />
            ))}
          </div>

          {/* Переключатель языка и кнопка «Выйти» внизу боковой панели */}
          <div className="mt-4 space-y-3">
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
          className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminShell;
