/** Serialises structured data for a `<script type="application/ld+json">`; `<` is escaped so text can't close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
