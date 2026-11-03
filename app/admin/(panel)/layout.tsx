import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { isAdmin } from "@/lib/auth";
import { readDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { orders, incomplete } = await readDB();
  return (
    <AdminShell pendingCount={orders.filter((o) => o.status === "pending").length} incompleteCount={incomplete.length}>
      {children}
    </AdminShell>
  );
}
