import OrdersManager from "@/components/admin/OrdersManager";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  return <OrdersManager initialStatus={status ?? "all"} />;
}
