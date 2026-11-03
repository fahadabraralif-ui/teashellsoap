import Link from "next/link";
import { readDB } from "@/lib/db";
import { ORDER_STATUSES, STATUS_COLORS, STATUS_LABELS, type Order } from "@/lib/types";
import { dhakaDay, formatDate, formatTaka } from "@/lib/utils";

export const dynamic = "force-dynamic";

const COUNTS_AS_SALE = (o: Order) => !["cancelled", "returned"].includes(o.status);

export default async function Dashboard() {
  const { orders, incomplete, settings } = await readDB();
  const today = dhakaDay(new Date());
  const month = today.slice(0, 7);

  const todays = orders.filter((o) => dhakaDay(o.createdAt) === today);
  const monthly = orders.filter((o) => dhakaDay(o.createdAt).startsWith(month));
  const delivered = orders.filter((o) => o.status === "delivered");
  const sum = (list: Order[]) => list.filter(COUNTS_AS_SALE).reduce((s, o) => s + o.total, 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400_000);
    const key = dhakaDay(d);
    const list = orders.filter((o) => dhakaDay(o.createdAt) === key);
    return { key, label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", timeZone: "Asia/Dhaka" }), count: list.length, amount: sum(list) };
  });
  const maxCount = Math.max(1, ...days.map((d) => d.count));

  const byStatus = Object.fromEntries(ORDER_STATUSES.map((s) => [s, orders.filter((o) => o.status === s).length]));
  const closed = delivered.length + byStatus.returned;
  const successRate = closed ? Math.round((delivered.length / closed) * 100) : 0;

  const cards = [
    { label: "আজকের অর্ডার", value: todays.length, sub: formatTaka(sum(todays)), color: "from-pink-500 to-rose-600" },
    { label: "এই মাসের অর্ডার", value: monthly.length, sub: formatTaka(sum(monthly)), color: "from-violet-500 to-purple-600" },
    { label: "মোট অর্ডার", value: orders.length, sub: formatTaka(sum(orders)), color: "from-sky-500 to-blue-600" },
    { label: "ডেলিভারড সেল", value: delivered.length, sub: formatTaka(sum(delivered)), color: "from-emerald-500 to-green-600" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">ড্যাশবোর্ড</h1>
        <p className="text-sm text-slate-500">আপনার শপের সার্বিক অবস্থা</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className={`rounded-xl bg-gradient-to-br ${c.color} p-4 text-white shadow`}>
            <p className="text-sm opacity-90">{c.label}</p>
            <p className="mt-1 text-3xl font-bold">{c.value}</p>
            <p className="text-sm opacity-90">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="পেন্ডিং অর্ডার" value={byStatus.pending} href="/admin/orders?status=pending" accent="text-amber-600" />
        <MiniStat label="ইনকমপ্লিট অর্ডার" value={incomplete.length} href="/admin/incomplete" accent="text-rose-600" />
        <MiniStat label="স্টকে আছে" value={settings.product.stock} href="/admin/product" accent={settings.product.stock < 20 ? "text-red-600" : "text-slate-800"} />
        <MiniStat label="ডেলিভারি সাকসেস রেট" value={`${successRate}%`} accent="text-green-600" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="mb-4 font-bold text-slate-800">গত ৭ দিনের অর্ডার</h2>
          <div className="flex h-48 items-end gap-2">
            {days.map((d) => (
              <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-semibold text-slate-700">{d.count}</span>
                <div
                  className="w-full max-w-12 rounded-t-md bg-gradient-to-t from-brand to-pink-400"
                  style={{ height: `${Math.max(4, (d.count / maxCount) * 150)}px` }}
                  title={formatTaka(d.amount)}
                />
                <span className="text-[11px] text-slate-500">{d.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-bold text-slate-800">স্ট্যাটাস অনুযায়ী</h2>
          <ul className="space-y-2">
            {ORDER_STATUSES.map((s) => (
              <li key={s}>
                <Link href={`/admin/orders?status=${s}`} className="flex items-center justify-between rounded-lg px-2 py-1 hover:bg-slate-50">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[s]}`}>{STATUS_LABELS[s]}</span>
                  <span className="font-bold text-slate-700">{byStatus[s]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <h2 className="font-bold text-slate-800">সাম্প্রতিক অর্ডার</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-brand">সব দেখুন →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">কাস্টমার</th>
                <th className="px-4 py-2">পরিমাণ</th>
                <th className="px-4 py-2">মোট</th>
                <th className="px-4 py-2">স্ট্যাটাস</th>
                <th className="px-4 py-2">সময়</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((o) => (
                <tr key={o.id} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-semibold">#{o.id}</td>
                  <td className="px-4 py-2">
                    {o.name}
                    <div className="text-xs text-slate-500">{o.phone}</div>
                  </td>
                  <td className="px-4 py-2">{o.quantity}</td>
                  <td className="px-4 py-2 font-semibold">{formatTaka(o.total)}</td>
                  <td className="px-4 py-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span>
                  </td>
                  <td className="px-4 py-2 text-slate-500">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-500">এখনও কোনো অর্ডার নেই</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MiniStat({ label, value, href, accent }: { label: string; value: number | string; href?: string; accent: string }) {
  const body = (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent}`}>{value}</p>
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}
