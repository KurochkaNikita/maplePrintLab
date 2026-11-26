import { useT } from "@/components/LocaleProvider";
import NavItemLink from "@/components/nav/NavItemLink";
import type { NavGroup } from "@/components/nav/nav-groups";

export interface NavGroupListProps {
  group: NavGroup;
  pathname: string;
  newRequestCount: number;
}

/** A group of sidebar links with its heading, if it has one. */
export function NavGroupList({ group, pathname, newRequestCount }: NavGroupListProps) {
  const t = useT();
  const headingId = group.titleKey ? `nav-group-${group.id}` : undefined;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    // Settings are set apart by a line instead of a heading.
    <div className={group.id === "settings" ? "border-t border-line pt-3" : undefined}>
      {group.titleKey && (
        <p id={headingId} className="mb-1.5 px-3.5 text-xs font-semibold uppercase tracking-wider text-ink">
          {t.shell.navGroups[group.titleKey]}
        </p>
      )}
      <ul aria-labelledby={headingId} className="space-y-0.5">
        {group.items.map((item) => (
          <li key={item.href}>
            <NavItemLink item={item} active={isActive(item.href)} badge={item.key === "requests" ? newRequestCount : 0} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NavGroupList;
