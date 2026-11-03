"use client";

import { useState } from "react";
import { ORDER_STATUSES, STATUS_LABELS, type Order, type OrderStatus } from "@/lib/types";
import { formatDate, formatTaka } from "@/lib/utils";

export type OrderDraft = Pick<
  Order,
  "name" | "phone" | "address" | "area" | "quantity" | "unitPrice" | "deliveryCharge" | "discount" | "status" | "adminNote"
>;

export default function OrderModal({
  order,
  draft,
  onClose,
  onSave,
}: {
  /** Existing order being edited; omit to create a new one from `draft`. */
  order?: Order;
  draft: OrderDraft;
  onClose: () => void;
  onSave: (data: OrderDraft) => Promise<string | void>;
}) {
  const [form, setForm] = useState<OrderDraft>(draft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = <K extends keyof OrderDraft>(k: K, v: OrderDraft[K]) => setForm((f) => ({ ...f, [k]: v }));
  const total = Math.max(0, form.quantity * form.unitPrice + form.deliveryCharge - form.discount);

  async function save() {
    setSaving(true);
    setError("");
    const err = await onSave(form);
    setSaving(false);
    if (err) setError(err);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
          <h2 className="text-lg font-bold">{order ? `অর্ডার #${order.id} এডিট` : "নতুন অর্ডার"}</h2>
          <button onClick={onClose} className="text-2xl leading-none text-slate-400 hover:text-slate-700">×</button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div>
            <label className="admin-label">নাম</label>
            <input className="admin-input" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label className="admin-label">মোবাইল</label>
            <input className="admin-input" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="admin-label">ঠিকানা</label>
            <textarea className="admin-input min-h-[70px]" value={form.address} onChange={(e) => set("address", e.target.value)} />
          </div>
          <div>
            <label className="admin-label">ডেলিভারি এরিয়া</label>
            <select className="admin-input" value={form.area} onChange={(e) => set("area", e.target.value as OrderDraft["area"])}>
              <option value="inside">ঢাকার ভিতরে</option>
              <option value="outside">ঢাকার বাইরে</option>
            </select>
          </div>
          <div>
            <label className="admin-label">স্ট্যাটাস</label>
            <select className="admin-input" value={form.status} onChange={(e) => set("status", e.target.value as OrderStatus)}>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="admin-label">পরিমাণ</label>
            <input type="number" min={1} className="admin-input" value={form.quantity} onChange={(e) => set("quantity", Number(e.target.value))} />
          </div>
          <div>
            <label className="admin-label">একক মূল্য (৳)</label>
            <input type="number" min={0} className="admin-input" value={form.unitPrice} onChange={(e) => set("unitPrice", Number(e.target.value))} />
          </div>
          <div>
            <label className="admin-label">ডেলিভারি চার্জ (৳)</label>
            <input type="number" min={0} className="admin-input" value={form.deliveryCharge} onChange={(e) => set("deliveryCharge", Number(e.target.value))} />
          </div>
          <div>
            <label className="admin-label">ডিসকাউন্ট (৳)</label>
            <input type="number" min={0} className="admin-input" value={form.discount} onChange={(e) => set("discount", Number(e.target.value))} />
          </div>
          <div className="sm:col-span-2">
            <label className="admin-label">অ্যাডমিন নোট (কুরিয়ারেও যাবে)</label>
            <textarea className="admin-input" value={form.adminNote} onChange={(e) => set("adminNote", e.target.value)} />
          </div>

          {order?.note && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 sm:col-span-2">
              <b>কাস্টমারের নোট:</b> {order.note}
            </p>
          )}

          <div className="flex items-center justify-between rounded-lg bg-pink-50 px-4 py-3 sm:col-span-2">
            <span className="font-semibold">সর্বমোট (COD)</span>
            <span className="text-xl font-bold text-brand">{formatTaka(total)}</span>
          </div>

          {order && (
            <div className="text-xs text-slate-500 sm:col-span-2">
              <p className="mb-1 font-semibold text-slate-700">হিস্টোরি</p>
              <ul className="space-y-0.5">
                {order.history.map((h, i) => (
                  <li key={i}>
                    {formatDate(h.at)} — {STATUS_LABELS[h.status]} {h.note ? `(${h.note})` : ""}
                  </li>
                ))}
              </ul>
              {order.ip && <p className="mt-1">IP: {order.ip}</p>}
            </div>
          )}
        </div>

        {error && <p className="mx-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-200 bg-white px-5 py-3">
          <button className="btn-outline" onClick={onClose}>বাতিল</button>
          <button className="btn-primary" onClick={save} disabled={saving}>{saving ? "সেভ হচ্ছে..." : "সেভ করুন"}</button>
        </div>
      </div>
    </div>
  );
}
