import ButtonLink from "@/components/ButtonLink";
import type { Dictionary } from "@/lib/i18n";

export interface QuickActionsProps {
  t: Dictionary["pages"]["dashboard"]["actions"];
}

/** Shortcuts to the create forms used most often. */
export function QuickActions({ t }: QuickActionsProps) {
  return (
    <nav aria-label={t.label} className="flex flex-wrap gap-3">
      <ButtonLink href="/orders/new">{t.newOrder}</ButtonLink>
      <ButtonLink href="/expenses/new" variant="secondary">
        {t.newExpense}
      </ButtonLink>
      <ButtonLink href="/products/new" variant="secondary">
        {t.newProduct}
      </ButtonLink>
    </nav>
  );
}

export default QuickActions;
