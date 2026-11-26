import Link from "next/link";
import { useT } from "@/components/LocaleProvider";
import type { NavItem } from "@/components/nav/nav-groups";
import { format } from "@/lib/i18n";

export interface NavItemLinkProps {
  item: NavItem;
  active: boolean;
  /** Number shown on the right, e.g. new requests; nothing when 0. */
  badge?: number;
}

/** One link of the sidebar. */
export function NavItemLink({ item, active, badge = 0 }: NavItemLinkProps) {
  const t = useT();
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      /* 44 px for touch screens; denser in the desktop sidebar. */
      className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors lg:min-h-9 ${
        active ? "bg-charcoal font-semibold text-filament shadow-sm" : "text-charcoal hover:bg-charcoal/5"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span>{t.shell.nav[item.key]}</span>
      {badge > 0 && (
        <span className="ml-auto rounded-full bg-amber-deep px-2 py-0.5 text-xs font-semibold tabular-nums text-white">
          <span aria-hidden="true">{badge}</span>
          <span className="visually-hidden">{format(t.pages.requests.badgeLabel, { count: badge })}</span>
        </span>
      )}
    </Link>
  );
}

export default NavItemLink;
