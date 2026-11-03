import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { readDB } from "@/lib/db";
import { formatDate, formatTaka } from "@/lib/utils";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export default async function InvoicePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const ids = ((await searchParams).ids ?? "").split(",").map(Number).filter(Boolean);
  const { orders, settings } = await readDB();
  const list = orders.filter((o) => ids.includes(o.id));

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      <div className="no-print sticky top-0 flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
        <span>{list.length}টি ইনভয়েস</span>
        <PrintButton />
      </div>
      <div className="mx-auto max-w-[800px] space-y-6 p-4 print:space-y-0 print:p-0">
        {list.map((o) => (
          <div key={o.id} className="break-after-page rounded-xl bg-white p-8 shadow print:rounded-none print:shadow-none">
            <div className="flex items-start justify-between border-b-2 border-brand pb-4">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo.png" alt="TeaShell" className="h-12 w-auto" />
                {settings.content.phone && <p className="mt-1 text-sm text-slate-600">📞 {settings.content.phone}</p>}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-brand">INVOICE</p>
                <p className="font-semibold">#{o.id}</p>
                <p className="text-sm text-slate-600">{formatDate(o.createdAt)}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="mb-1 font-bold text-slate-500">বিল ও ডেলিভারি</p>
                <p className="text-base font-semibold">{o.name}</p>
                <p>{o.phone}</p>
                <p className="whitespace-pre-line">{o.address}</p>
              </div>
              <div className="text-right">
                <p className="mb-1 font-bold text-slate-500">পেমেন্ট</p>
                <p>Cash on Delivery</p>
                {o.courier && <p className="mt-2">Steadfast: <b>{o.courier.trackingCode}</b></p>}
              </div>
            </div>

            <table className="mt-6 w-full text-sm">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="px-3 py-2">প্রোডাক্ট</th>
                  <th className="px-3 py-2 text-center">পরিমাণ</th>
                  <th className="px-3 py-2 text-right">দাম</th>
                  <th className="px-3 py-2 text-right">মোট</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="px-3 py-3">{settings.product.name}</td>
                  <td className="px-3 py-3 text-center">{o.quantity}</td>
                  <td className="px-3 py-3 text-right">{formatTaka(o.unitPrice)}</td>
                  <td className="px-3 py-3 text-right">{formatTaka(o.unitPrice * o.quantity)}</td>
                </tr>
              </tbody>
            </table>

            <div className="ml-auto mt-4 w-64 space-y-1 text-sm">
              <div className="flex justify-between"><span>ডেলিভারি চার্জ</span><span>{formatTaka(o.deliveryCharge)}</span></div>
              {o.discount > 0 && <div className="flex justify-between"><span>ডিসকাউন্ট</span><span>-{formatTaka(o.discount)}</span></div>}
              <div className="flex justify-between border-t-2 border-slate-800 pt-2 text-lg font-bold">
                <span>সর্বমোট (COD)</span>
                <span>{formatTaka(o.total)}</span>
              </div>
            </div>

            {o.adminNote && <p className="mt-6 rounded bg-slate-50 p-3 text-sm">নোট: {o.adminNote}</p>}
            <p className="mt-10 text-center text-sm text-slate-500">TeaShell থেকে কেনাকাটার জন্য ধন্যবাদ ❤️</p>
          </div>
        ))}
        {list.length === 0 && <p className="py-20 text-center text-slate-500">কোনো অর্ডার পাওয়া যায়নি</p>}
      </div>
    </div>
  );
}
