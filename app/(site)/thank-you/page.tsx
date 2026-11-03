import Link from "next/link";
import { notFound } from "next/navigation";
import { readDB } from "@/lib/db";
import { orderToken } from "@/lib/orders";
import { toBanglaDigits } from "@/lib/utils";
import PurchaseEvent from "./PurchaseEvent";

export const dynamic = "force-dynamic";
export const metadata = { title: "ধন্যবাদ! অর্ডার সম্পন্ন হয়েছে", robots: { index: false } };

export default async function ThankYou({ searchParams }: { searchParams: Promise<{ id?: string; t?: string }> }) {
  const { id, t } = await searchParams;
  const db = await readDB();
  const order = db.orders.find((o) => String(o.id) === id);
  if (!order || t !== orderToken(order.id, db.admin.sessionSecret)) notFound();
  const { content, product } = db.settings;

  return (
    <div className="page-bg grid min-h-screen place-items-center px-4 py-10">
      <div className="card w-full max-w-md p-6 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-5xl">✅</div>
        <h1 className="mt-4 font-display text-3xl font-bold text-brand">ধন্যবাদ, {order.name}!</h1>
        <p className="mt-2 text-slate-700">{content.thankYouMessage}</p>
        <div className="mt-5 space-y-2 rounded-xl bg-pink-50 p-4 text-left">
          <Row k="অর্ডার নম্বর" v={`#${toBanglaDigits(order.id)}`} />
          <Row k="প্রোডাক্ট" v={`${product.name} × ${toBanglaDigits(order.quantity)}`} />
          <Row k="ডেলিভারি চার্জ" v={`৳${toBanglaDigits(order.deliveryCharge)}`} />
          <Row k="সর্বমোট (ক্যাশ অন ডেলিভারি)" v={`৳${toBanglaDigits(order.total)}`} bold />
        </div>
        {content.phone && (
          <a href={`tel:${content.phone}`} className="btn-primary mt-5 w-full py-3">
            📞 যেকোনো প্রয়োজনে কল করুন {toBanglaDigits(content.phone)}
          </a>
        )}
        <Link href="/" className="mt-3 inline-block text-sm font-semibold text-brand underline">
          হোম পেজে ফিরে যান
        </Link>
      </div>
      <PurchaseEvent id={order.id} value={order.total} quantity={order.quantity} name={product.name} />
    </div>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between gap-3 text-sm ${bold ? "border-t border-pink-200 pt-2 text-base font-bold text-brand" : ""}`}>
      <span>{k}</span>
      <span className="text-right">{v}</span>
    </div>
  );
}
