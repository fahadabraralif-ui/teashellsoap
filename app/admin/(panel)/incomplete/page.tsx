"use client";

import { useCallback, useEffect, useState } from "react";
import OrderModal, { type OrderDraft } from "@/components/admin/OrderModal";
import { PageHeader, useToast } from "@/components/admin/ui";
import type { IncompleteOrder, Settings } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function IncompletePage() {
  const [list, setList] = useState<IncompleteOrder[] | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [converting, setConverting] = useState<IncompleteOrder | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toast = useToast();

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/incomplete", { cache: "no-store" });
    setList((await res.json()).incomplete);
  }, []);

  useEffect(() => {
    load();
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => setSettings(d.settings));
  }, [load]);

  async function remove(ids: string[]) {
    if (!confirm(`${ids.length}টি এন্ট্রি ডিলিট করবেন?`)) return;
    await fetch("/api/admin/incomplete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    setSelected(new Set());
    await load();
  }

  async function convert(form: OrderDraft): Promise<string | void> {
    const res = await fetch("/api/admin/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, source: "incomplete" }),
    });
    const data = await res.json();
    if (!res.ok) return data.error || "ব্যর্থ";
    await fetch("/api/admin/incomplete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [converting!.id] }),
    });
    setConverting(null);
    toast.success(`অর্ডার #${data.order.id} তৈরি হয়েছে`);
    await load();
  }

  const draftFor = (i: IncompleteOrder): OrderDraft => ({
    name: i.name,
    phone: i.phone,
    address: i.address,
    area: i.area,
    quantity: i.quantity,
    unitPrice: settings?.product.price ?? 0,
    deliveryCharge: i.area === "inside" ? settings?.delivery.inside ?? 0 : settings?.delivery.outside ?? 0,
    discount: 0,
    status: "confirmed",
    adminNote: "",
  });

  return (
    <div>
      <PageHeader title="ইনকমপ্লিট অর্ডার" subtitle="যারা ফর্মে মোবাইল নম্বর দিয়েছে কিন্তু অর্ডার সম্পন্ন করেনি — কল করে অর্ডার নিন">
        <button className="btn-outline text-sm" onClick={load}>🔄 রিফ্রেশ</button>
        {selected.size > 0 && (
          <button className="btn-outline text-sm text-red-600" onClick={() => remove([...selected])}>🗑️ {selected.size}টি ডিলিট</button>
        )}
      </PageHeader>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-brand"
                  checked={!!list?.length && selected.size === list.length}
                  onChange={(e) => setSelected(new Set(e.target.checked ? list?.map((i) => i.id) : []))}
                />
              </th>
              <th className="px-3 py-3">সময়</th>
              <th className="px-3 py-3">নাম</th>
              <th className="px-3 py-3">মোবাইল</th>
              <th className="px-3 py-3">ঠিকানা</th>
              <th className="px-3 py-3">পরিমাণ</th>
              <th className="px-3 py-3 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {list === null && (
              <tr><td colSpan={7} className="py-16 text-center text-slate-500">লোড হচ্ছে...</td></tr>
            )}
            {list?.length === 0 && (
              <tr><td colSpan={7} className="py-16 text-center text-slate-500">কোনো ইনকমপ্লিট অর্ডার নেই 🎉</td></tr>
            )}
            {list?.map((i) => (
              <tr key={i.id} className="border-t border-slate-100 align-top hover:bg-slate-50">
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-brand"
                    checked={selected.has(i.id)}
                    onChange={() =>
                      setSelected((s) => {
                        const n = new Set(s);
                        if (n.has(i.id)) n.delete(i.id);
                        else n.add(i.id);
                        return n;
                      })
                    }
                  />
                </td>
                <td className="px-3 py-3 text-xs text-slate-500">{formatDate(i.updatedAt)}</td>
                <td className="px-3 py-3 font-semibold">{i.name || <span className="text-slate-400">—</span>}</td>
                <td className="px-3 py-3">
                  <a href={`tel:${i.phone}`} className="text-brand hover:underline">{i.phone}</a>{" "}
                  <a href={`https://wa.me/88${i.phone}`} target="_blank" rel="noopener noreferrer" className="text-green-600">💬</a>
                </td>
                <td className="max-w-[260px] px-3 py-3">
                  {i.address || <span className="text-slate-400">—</span>}
                  <div className="text-xs text-slate-500">{i.area === "inside" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে"}</div>
                </td>
                <td className="px-3 py-3">{i.quantity}</td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-2">
                    <button className="btn-primary py-1 text-xs" onClick={() => setConverting(i)}>✓ অর্ডারে রূপান্তর</button>
                    <button className="btn-outline py-1 text-xs text-red-600" onClick={() => remove([i.id])}>ডিলিট</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {converting && <OrderModal draft={draftFor(converting)} onClose={() => setConverting(null)} onSave={convert} />}
      {toast.node}
    </div>
  );
}
