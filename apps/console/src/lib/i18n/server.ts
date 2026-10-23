import "server-only";
import { cookies } from "next/headers";
import { defaultLocale, dictionaries, isLocale, LOCALE_COOKIE, type Dictionary, type Locale } from "./index";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

export async function getDict(): Promise<Dictionary> {
  return dictionaries[await getLocale()];
}
