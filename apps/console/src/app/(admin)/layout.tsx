import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { countNewOrderRequests, createDb } from "@maple-print-lab/db";
import AdminShell from "@/components/AdminShell";
import ToastProvider from "@/components/toast/ToastProvider";
import { getAdminState } from "@/lib/auth/server";

// Reads the session cookie on every request.
export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  if ((await getAdminState()) !== "admin") redirect("/login");

  // The badge is a convenience: if the count cannot be read (e.g. the migration is not applied yet), show no badge instead of failing every admin page.
  const newRequestCount = await countNewOrderRequests(createDb()).catch((e) => {
    console.error("countNewOrderRequests failed", e);
    return 0;
  });

  return (
    <ToastProvider>
      <AdminShell newRequestCount={newRequestCount}>{children}</AdminShell>
    </ToastProvider>
  );
}
