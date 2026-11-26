import type { ComponentType, SVGProps } from "react";
import ChartIcon from "@/icons/chart.svg";
import GridIcon from "@/icons/grid.svg";
import HomeIcon from "@/icons/home.svg";
import InboxIcon from "@/icons/inbox.svg";
import ListIcon from "@/icons/list.svg";
import PackageIcon from "@/icons/package.svg";
import ReceiptIcon from "@/icons/receipt.svg";
import StarIcon from "@/icons/star.svg";
import WalletIcon from "@/icons/wallet.svg";
import type { Dictionary } from "@/lib/i18n";

export interface NavItem {
  href: string;
  key: keyof Dictionary["shell"]["nav"];
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface NavGroup {
  id: string;
  /** Heading above the group; a group without one stands on its own. */
  titleKey?: keyof Dictionary["shell"]["navGroups"];
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  { id: "home", items: [{ href: "/", key: "home", icon: HomeIcon }] },
  {
    id: "sales",
    titleKey: "sales",
    items: [
      { href: "/requests", key: "requests", icon: InboxIcon },
      { href: "/orders", key: "orders", icon: ReceiptIcon },
    ],
  },
  {
    id: "catalog",
    titleKey: "catalog",
    items: [
      { href: "/products", key: "products", icon: PackageIcon },
      { href: "/categories", key: "categories", icon: GridIcon },
      { href: "/collections", key: "collections", icon: StarIcon },
    ],
  },
  {
    id: "money",
    titleKey: "money",
    items: [
      { href: "/finance", key: "finance", icon: ChartIcon },
      { href: "/expenses", key: "expenses", icon: WalletIcon },
    ],
  },
  { id: "settings", items: [{ href: "/settings", key: "settings", icon: ListIcon }] },
];
