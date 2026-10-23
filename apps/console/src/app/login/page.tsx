import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { getAdminState } from "@/lib/auth/server";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getDict } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getDict()).login.metaTitle };
}

// Reads the session cookie on every request.
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const [state, t] = await Promise.all([getAdminState(), getDict()]);
  if (state === "admin") redirect("/");

  return (
    <div className="flex min-h-screen flex-col bg-filament">
      <div className="layer-bar" aria-hidden="true" />

      <main
        id="main-content"
        tabIndex={-1}
        className="build-plate flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-6"
      >
        <div className="mb-3 flex w-full max-w-md justify-end">
          <LanguageSwitcher />
        </div>

        <div className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <Image
              src="/brand/logo-on-light.svg"
              alt=""
              aria-hidden="true"
              width={36}
              height={40}
              className="h-10 w-9 shrink-0"
            />
            <div>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-deep">
                {t.brand.name}
              </span>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-charcoal">
                {t.login.heading}
              </h1>
            </div>
          </div>

          <p className="mt-2 text-sm text-ink">{t.login.subtitle}</p>

          <LoginForm />
        </div>
      </main>
    </div>
  );
}
