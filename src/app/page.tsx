import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n";

/**
 * "/" carries no locale — send it to the default (English), no picker.
 *
 * This makes `/` work under `next dev` (server 307). For the static export,
 * scripts/root-redirect.mjs overwrites out/index.html with a plain
 * <meta http-equiv="refresh"> so the redirect also works without JS.
 */
export default function RootPage() {
  redirect(`/${defaultLocale}/`);
}
