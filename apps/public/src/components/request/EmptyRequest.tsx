import Link from "next/link";
import { ctaClassName } from "@/lib/cta-class";
import type { OrderLabels } from "@/lib/order/types";

type EmptyRequestProps = {
  labels: OrderLabels["empty"];
  productsHref: string;
};

/** Shown when nothing is in the request yet. Its title is the page heading, so the page title is not repeated above it. */
export default function EmptyRequest({ labels, productsHref }: EmptyRequestProps) {
  return (
    <div className="mx-auto max-w-md rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
      <h1 className="font-display text-xl font-semibold text-charcoal">{labels.title}</h1>
      <p className="mt-2 text-charcoal">{labels.body}</p>
      <Link href={productsHref} className={ctaClassName("solid", "mt-6")}>
        {labels.link}
      </Link>
    </div>
  );
}
