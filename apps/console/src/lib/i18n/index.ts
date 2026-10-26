import { ru } from "./ru";
import { en } from "./en";
import { fr } from "./fr";

export type Dictionary = typeof ru;

export const locales = ["ru", "en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";
export const LOCALE_COOKIE = "admin-locale";

/** Shown in the language switcher, each in its own language. */
export const localeLabels: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
  fr: "Français",
};

export const dictionaries: Record<Locale, Dictionary> = { ru, en, fr };

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

/** Fills `{name}` placeholders in a dictionary string. */
export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => (name in vars ? String(vars[name]) : match));
}
