const NAME = "mpl_extension_card_hidden";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/** `cookies` is the `document.cookie` string. */
export const isExtensionCardHidden = (cookies: string): boolean => cookies.split("; ").includes(`${NAME}=1`);

/** The value to assign to `document.cookie`: the browser drops it after 30 days. */
export const hideExtensionCardCookie = (): string => `${NAME}=1; path=/; max-age=${MAX_AGE_SECONDS}; samesite=lax`;
