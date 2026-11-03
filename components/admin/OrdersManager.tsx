"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ORDER_STATUSES, STATUS_COLORS, STATUS_LABELS, type Order, type OrderStatus, type Settings } from "@/lib/types";
import { dhakaDay, formatDate, formatTaka } from "@/lib/utils";
import OrderModal, { type OrderDraft } from "./OrderModal";
import { PageHeader, useToast } from "./ui";

const PAGE_SIZE = 25;

type CourierResult = { id: number; ok: boolean; message: string };

function toCsv(orders: Order[]) {
  const head = ["Order ID", "Date", "Name", "Phone", "Address", "Area", "Qty", "Unit Price", "Delivery", "Discount", "Total", "Status", "Tracking", "Customer Note", "Admin Note"];
  const rows = orders.map((o) => [
    o.id,
    formatDate(o.createdAt),
    o.name,
    o.phone,
    o.address,
    o.area === "inside" ? "Inside Dhaka" : "Outside Dhaka",
    o.quantity,
    o.unitPrice,
    o.deliveryCharge,
    o.discount,
    o.total,
    STATUS_LABELS[o.status],
    o.courier?.trackingCode ?? "",
    o.note,
    o.adminNote,
  ]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return "﻿" + [head, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
}

export default function OrdersManager({ initialStatus }: { initialStatus: string }) {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [status, setStatus] = useState<string>(ORDER_STATUSES.includes(initialStatus as OrderStatus) ? initialStatus : "all");
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [editing, setEditing] = useState<Order | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const [courierResults, setCourierResults] = useState<CourierResult[] | null>(null);
  const toast = useToast();

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/orders", { cache: "no-store" });
    if (res.status === 401) return location.assign("/admin/login");
    setOrders((await res.json()).orders);
  }, []);

  useEffect(() => {
    load();
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => setSettings(d.settings));
  }, [load]);

  // Customer history by phone: helps spot fake / repeat-cancel customers.
  const phoneStats = useMemo(() => {
    const map = new Map<string, { total: number; delivered: number; cancelled: number }>();
    for (const o of orders ?? []) {
      const s = map.get(o.phone) ?? { total: 0, delivered: 0, cancelled: 0 };
      s.total++;
      if (o.status === "delivered") s.delivered++;
      if (o.status === "cancelled" || o.status === "returned") s.cancelled++;
      map.set(o.phone, s);
    }
    return map;
  }, [orders]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: orders?.length ?? 0 };
    for (const s of ORDER_STATUSES) c[s] = 0;
    for (const o of orders ?? []) c[o.status]++;
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (orders ?? []).filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      const day = dhakaDay(o.createdAt);
      if (from && day < from) return false;
      if (to && day > to) return false;
      if (!q) return true;
      return (
        String(o.id).includes(q) ||
        o.name.toLowerCase().includes(q) ||
        o.phone.includes(q) ||
        o.address.toLowerCase().includes(q) ||
        (o.courier?.trackingCode ?? "").toLowerCase().includes(q)
      );
    });
  }, [orders, status, query, from, to]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allVisibleSelected = visible.length > 0 && visible.every((o) => selected.has(o.id));
  const ids = [...selected];

  useEffect(() => setPage(1), [status, query, from, to]);

  function toggle(id: number) {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  function toggleAllVisible() {
    setSelected((s) => {
      const n = new Set(s);
      if (allVisibleSelected) visible.forEach((o) => n.delete(o.id));
      else visible.forEach((o) => n.add(o.id));
      return n;
    });
  }

  async function changeStatus(targetIds: number[], newStatus: OrderStatus) {
    setBusy(true);
    const res = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: targetIds, status: newStatus }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return toast.error(data.error || "ব্যর্থ");
    toast.success(`${targetIds.length}টি অর্ডার ${STATUS_LABELS[newStatus]} করা হয়েছে`);
    if (data.courier) setCourierResults(data.courier);
    await load();
  }

  async function remove(targetIds: number[]) {
    if (!confirm(`${targetIds.length}টি অর্ডার স্থায়ীভাবে ডিলিট করবেন?`)) return;
    setBusy(true);
    await fetch("/api/admin/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: targetIds }),
    });
    setBusy(false);
    setSelected(new Set());
    toast.success("ডিলিট হয়েছে");
    await load();
  }

  async function courier(action: "send" | "status", targetIds: number[]) {
    setBusy(true);
    const res = await fetch("/api/admin/courier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ids: targetIds }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) return toast.error(data.error || "ব্যর্থ");
    setCourierResults(data.results);
    await load();
  }

  function exportCsv() {
    const list = selected.size ? filtered.filter((o) => selected.has(o.id)) : filtered;
    const blob = new Blob([toCsv(list)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `orders-${dhakaDay(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function printInvoices(targetIds: number[]) {
    window.open(`/admin/invoice?ids=${targetIds.join(",")}`, "_blank");
  }

  async function saveOrder(form: OrderDraft): Promise<string | void> {
    const isNew = editing === "new";
    const res = await fetch(isNew ? "/api/admin/orders" : `/api/admin/orders/${(editing as Order).id}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return data.error || "সেভ করা যায়নি";
    setEditing(null);
    toast.success(isNew ? `অর্ডার #${data.order.id} তৈরি হয়েছে` : "অর্ডার আপডেট হয়েছে");
    if (data.courier) setCourierResults(data.courier);
    await load();
  }

  const newDraft: OrderDraft = {
    name: "",
    phone: "",
    address: "",
    area: "inside",
    quantity: 1,
    unitPrice: settings?.product.price ?? 0,
    deliveryCharge: settings?.delivery.inside ?? 0,
    discount: 0,
    status: "confirmed",
    adminNote: "",
  };

  return (
    <div>
      <PageHeader title="অর্ডারসমূহ" subtitle={`মোট ${filtered.length}টি অর্ডার দেখানো হচ্ছে`}>
        <button className="btn-outline text-sm" onClick={load}>🔄 রিফ্রেশ</button>
        <button className="btn-outline text-sm" onClick={exportCsv}>⬇️ CSV এক্সপোর্ট</button>
        <button className="btn-primary text-sm" onClick={() => setEditing("new")}>+ নতুন অর্ডার</button>
      </PageHeader>

      {/* status tabs */}
      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        {["all", ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
              status === s ? "border-brand bg-brand text-white" : "border-slate-300 bg-white text-slate-700 hover:border-brand"
            }`}
          >
            {s === "all" ? "সব" : STATUS_LABELS[s as OrderStatus]} <span className="opacity-75">({counts[s]})</span>
          </button>
        ))}
      </div>

      {/* filters */}
      <div className="mb-4 grid gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_auto_auto_auto]">
        <input className="admin-input" placeholder="🔍 আইডি, নাম, মোবাইল, ঠিকানা, ট্র্যাকিং কোড..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <input type="date" className="admin-input" value={from} onChange={(e) => setFrom(e.target.value)} title="শুরুর তারিখ" />
        <input type="date" className="admin-input" value={to} onChange={(e) => setTo(e.target.value)} title="শেষ তারিখ" />
        <button
          className="btn-outline text-sm"
          onClick={() => {
            setQuery("");
            setFrom("");
            setTo("");
          }}
        >
          রিসেট
        </button>
      </div>

      {/* bulk actions */}
      {selected.size > 0 && (
        <div className="sticky top-14 z-10 mb-3 flex flex-wrap items-center gap-2 rounded-xl border border-brand/30 bg-pink-50 p-3 lg:top-2">
          <span className="text-sm font-bold text-brand">{selected.size}টি সিলেক্টেড</span>
          <select
            className="admin-input w-auto"
            value=""
            disabled={busy}
            onChange={(e) => e.target.value && changeStatus(ids, e.target.value as OrderStatus)}
          >
            <option value="">স্ট্যাটাস পরিবর্তন...</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
          <button className="btn-outline py-1.5 text-sm" disabled={busy} onClick={() => courier("send", ids)}>🚚 Steadfast এ পাঠান</button>
          <button className="btn-outline py-1.5 text-sm" disabled={busy} onClick={() => courier("status", ids)}>📡 কুরিয়ার স্ট্যাটাস</button>
          <button className="btn-outline py-1.5 text-sm" onClick={() => printInvoices(ids)}>🖨️ ইনভয়েস</button>
          <button className="btn-outline py-1.5 text-sm text-red-600" disabled={busy} onClick={() => remove(ids)}>🗑️ ডিলিট</button>
          <button className="ml-auto text-sm text-slate-500 underline" onClick={() => setSelected(new Set())}>ক্লিয়ার</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[1050px] text-sm">
          <thead className="bg-slate-50 text-left text-slate-600">
            <tr>
              <th className="w-10 px-3 py-3">
                <input type="checkbox" checked={allVisibleSelected} onChange={toggleAllVisible} className="h-4 w-4 accent-brand" />
              </th>
              <th className="px-3 py-3">অর্ডার</th>
              <th className="px-3 py-3">কাস্টমার</th>
              <th className="px-3 py-3">ঠিকানা</th>
              <th className="px-3 py-3">পরিমাণ</th>
              <th className="px-3 py-3">মোট</th>
              <th className="px-3 py-3">স্ট্যাটাস</th>
              <th className="px-3 py-3">কুরিয়ার</th>
              <th className="px-3 py-3 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {orders === null && (
              <tr>
                <td colSpan={9} className="py-16 text-center text-slate-500">লোড হচ্ছে...</td>
              </tr>
            )}
            {orders && visible.length === 0 && (
              <tr>
                <td colSpan={9} className="py-16 text-center text-slate-500">কোনো অর্ডার পাওয়া যায়নি</td>
              </tr>
            )}
            {visible.map((o) => {
              const ps = phoneStats.get(o.phone);
              return (
                <tr key={o.id} className={`border-t border-slate-100 align-top ${selected.has(o.id) ? "bg-pink-50/60" : "hover:bg-slate-50"}`}>
                  <td className="px-3 py-3">
                    <input type="checkbox" checked={selected.has(o.id)} onChange={() => toggle(o.id)} className="h-4 w-4 accent-brand" />
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-bold">#{o.id}</div>
                    <div className="text-xs text-slate-500">{formatDate(o.createdAt)}</div>
                    {o.source !== "landing" && (
                      <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 text-[11px] text-slate-600">{o.source}</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-semibold">{o.name}</div>
                    <div className="flex items-center gap-2">
                      <a href={`tel:${o.phone}`} className="text-brand hover:underline">{o.phone}</a>
                      <a href={`https://wa.me/88${o.phone}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="text-green-600">💬</a>
                    </div>
                    {ps && ps.total > 1 && (
                      <div
                        className={`mt-1 inline-block rounded px-1.5 text-[11px] font-semibold ${ps.cancelled > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                        title="এই নম্বরের অর্ডার হিস্টোরি"
                      >
                        {ps.total} অর্ডার · {ps.delivered} ডেলিভারড · {ps.cancelled} বাতিল
                      </div>
                    )}
                  </td>
                  <td className="max-w-[220px] px-3 py-3">
                    <div className="line-clamp-3">{o.address}</div>
                    <div className="text-xs text-slate-500">{o.area === "inside" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে"}</div>
                    {o.note && <div className="mt-1 text-xs text-amber-700">📝 {o.note}</div>}
                    {o.adminNote && <div className="mt-1 text-xs text-blue-700">🔖 {o.adminNote}</div>}
                  </td>
                  <td className="px-3 py-3 font-semibold">
                    {o.quantity}
                    {o.packageLabel && <div className="text-xs font-normal text-slate-500">{o.packageLabel}</div>}
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-bold">{formatTaka(o.total)}</div>
                    <div className="text-xs text-slate-500">ডেলি: {formatTaka(o.deliveryCharge)}</div>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={o.status}
                      disabled={busy}
                      onChange={(e) => changeStatus([o.id], e.target.value as OrderStatus)}
                      className={`cursor-pointer rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${STATUS_COLORS[o.status]}`}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    {o.courier ? (
                      <div className="text-xs">
                        <a
                          href={`https://steadfast.com.bd/t/${o.courier.trackingCode}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-brand hover:underline"
                        >
                          {o.courier.trackingCode}
                        </a>
                        <div className="text-slate-500">{o.courier.status}</div>
                        <button className="text-blue-600 hover:underline" disabled={busy} onClick={() => courier("status", [o.id])}>
                          আপডেট
                        </button>
                      </div>
                    ) : (
                      <button className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-700 disabled:opacity-50" disabled={busy} onClick={() => courier("send", [o.id])}>
                        Steadfast
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-1">
                      <IconBtn title="এডিট" onClick={() => setEditing(o)}>✏️</IconBtn>
                      <IconBtn title="ইনভয়েস" onClick={() => printInvoices([o.id])}>🖨️</IconBtn>
                      <IconBtn title="ডিলিট" onClick={() => remove([o.id])}>🗑️</IconBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button className="btn-outline py-1.5 text-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← আগের</button>
          <span className="text-sm text-slate-600">পেজ {page} / {pages}</span>
          <button className="btn-outline py-1.5 text-sm" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>পরের →</button>
        </div>
      )}

      {editing && (
        <OrderModal
          order={editing === "new" ? undefined : editing}
          draft={editing === "new" ? newDraft : editing}
          onClose={() => setEditing(null)}
          onSave={saveOrder}
        />
      )}

      {courierResults && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={() => setCourierResults(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-3 text-lg font-bold">কুরিয়ার রেজাল্ট</h3>
            <ul className="max-h-80 space-y-1.5 overflow-y-auto text-sm">
              {courierResults.map((r) => (
                <li key={r.id} className={`rounded-lg px-3 py-2 ${r.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}>
                  <b>#{r.id}</b> — {r.ok ? "✓ " : "✗ "}
                  {r.message}
                </li>
              ))}
            </ul>
            <button className="btn-primary mt-4 w-full" onClick={() => setCourierResults(null)}>ঠিক আছে</button>
          </div>
        </div>
      )}
      {toast.node}
    </div>
  );
}

function IconBtn({ children, title, onClick }: { children: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button title={title} onClick={onClick} className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 hover:bg-slate-100">
      {children}
    </button>
  );
}
