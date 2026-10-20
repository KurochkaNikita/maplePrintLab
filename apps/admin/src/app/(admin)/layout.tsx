import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";
import { getAdminState } from "@/lib/auth/server";

// Reads the session cookie on every request.
export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const state = await getAdminState();
  if (state === "anonymous") redirect("/login");
  if (state === "forbidden") redirect("/login?error=forbidden");

  return <AdminShell>{children}</AdminShell>;
}
