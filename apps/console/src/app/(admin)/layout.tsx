import type { ReactNode } from "react";
import { redirect } from "next/navigation";
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

  return (
    <ToastProvider>
      <AdminShell>{children}</AdminShell>
    </ToastProvider>
  );
}
