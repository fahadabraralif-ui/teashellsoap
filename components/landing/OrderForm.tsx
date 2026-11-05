"use client";

import { useEffect, useRef, useState } from "react";
import { bn } from "@/data/site";

export type FormProduct = { id: number; name: string; price: number; image: string; boxes: number };
type Area = { id: string; label: string; charge: number };

type Fbq = (...args: unknown[]) => void;
type TrackWindow = Window & { fbq?: Fbq; dataLayer?: Record<string, unknown>[] };

const taka = (n: number) => `৳${bn(n)}`;

// Facebook er browser cookie (_fbp) ar ad click id (_fbc / fbclid) — confirm er por server event e lage
function fbIds() {
  const cookie = (k: string) => document.cookie.split("; ").find((c) => c.startsWith(k + "="))?.split("=")[1] || "";
  const fbclid = new URLSearchParams(location.search).get("fbclid");
  return {
    fbp: cookie("_fbp"),
    fbc: cookie("_fbc") || (fbclid ? `fb.1.${Date.now()}.${fbclid}` : ""),
    pageUrl: location.href.split("#")[0],
  };
}

function Stepper({ value, onChange }: { value: number; onChange: (diff: number) => void }) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border border-tint-300 bg-white" onClick={(e) => e.stopPropagation()}>
      <button type="button" aria-label="কমান" className="px-3 py-1 text-lg font-bold text-brand hover:bg-tint-50" onClick={() => onChange(-1)}>
        −
      </button>
      <span className="w-8 text-center font-bold">{bn(value)}</span>
      <button type="button" aria-label="বাড়ান" className="px-3 py-1 text-lg font-bold text-brand hover:bg-tint-50" onClick={() => onChange(1)}>
        +
      </button>
    </div>
  );
}

function Radio({ checked }: { checked: boolean }) {
  return (
    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${checked ? "border-brand" : "border-slate-300 bg-white"}`}>
      {checked && <span className="h-2.5 w-2.5 rounded-full bg-brand" />}
    </span>
  );
}

// text: admin > ল্যান্ডিং পেজ টেক্সট er lekha
export default function OrderForm({
  products,
  delivery,
  freeBoxes = 0,
  text,
}: {
  products: FormProduct[];
  delivery: Area[];
  freeBoxes?: number;
  text: Record<string, string>;
}) {
  const [pkg, setPkg] = useState(products[0]?.id);
  const [qty, setQty] = useState<Record<number, number>>(() => Object.fromEntries(products.map((p) => [p.id, 1])));
  const [area, setArea] = useState(delivery[0].id);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const savedDraft = useRef("");
  const checkoutSent = useRef(false);

  // Page er "এই প্যাকেজে অর্ডার করুন" bottom (PackageButton) ei form e oi package bechhe dey
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = Number((e as CustomEvent).detail);
      if (products.some((p) => p.id === id)) setPkg(id);
    };
    window.addEventListener("select-package", onSelect);
    return () => window.removeEventListener("select-package", onSelect);
  }, [products]);

  const selected = products.find((p) => p.id === pkg) || products[0];
  // Mot box (package er box × quantity) freeBoxes chhuley delivery free — server o eki niyome hishab kore
  const totalBoxes = selected ? (Number(selected.boxes) || 1) * qty[selected.id] : 0;
  const freeShip = freeBoxes > 0 && totalBoxes >= freeBoxes;
  const charge = freeShip ? 0 : delivery.find((d) => d.id === area)!.charge;
  const subtotal = selected ? selected.price * qty[selected.id] : 0;
  const total = subtotal + charge;

  const changeQty = (id: number, diff: number) => {
    setPkg(id);
    setQty((q) => ({ ...q, [id]: Math.min(10, Math.max(1, q[id] + diff)) }));
  };

  // Customer form e prothom bar click/type korlei Pixel e InitiateCheckout (ekbar i)
  function onStartCheckout() {
    if (checkoutSent.current) return;
    checkoutSent.current = true;
    const w = window as TrackWindow;
    w.fbq?.("track", "InitiateCheckout", { value: total, currency: "BDT", num_items: totalBoxes });
    w.dataLayer?.push({ event: "begin_checkout", value: total, currency: "BDT" });
  }

  // Customer phone number likhe order na korle "অসম্পূর্ণ অর্ডার" e save hoy
  function saveDraft() {
    const form = new FormData(formRef.current!);
    const phone = String(form.get("phone") || "").trim();
    if (!/^01[3-9]\d{8}$/.test(phone)) return;
    const draft = { phone, website: form.get("website"), name: form.get("name"), address: form.get("address"), product: selected?.name };
    const key = JSON.stringify(draft);
    if (key === savedDraft.current) return;
    savedDraft.current = key;
    fetch("/api/incomplete", { method: "POST", headers: { "Content-Type": "application/json" }, body: key }).catch(() => {});
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const phone = String(form.get("phone")).trim();
    if (!/^01[3-9]\d{8}$/.test(phone)) {
      setError("সঠিক ১১ ডিজিটের মোবাইল নাম্বার দিন");
      return;
    }
    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: form.get("website"),
          ...fbIds(),
          name: form.get("name"),
          phone,
          address: form.get("address"),
          productId: selected.id,
          area,
          qty: qty[selected.id],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error);
      // Purchase: browser theke + server theke (Conversions API) — ek eventID, Facebook ekbar-i gone
      const w = window as TrackWindow;
      if (data.id) {
        w.fbq?.(
          "track",
          "Purchase",
          { value: total, currency: "BDT", content_ids: [String(selected.id)], content_type: "product", num_items: qty[selected.id] },
          { eventID: `purchase-${data.id}` },
        );
      }
      w.dataLayer?.push({ event: "order_placed", value: total, currency: "BDT" });
      setStatus("done");
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      setStatus("idle");
      setError((err as Error).message || "অর্ডার পাঠানো যায়নি, আবার চেষ্টা করুন বা কল করুন");
    }
  }

  if (!selected) return <p className="card p-6 text-center">এই মুহূর্তে কোনো পণ্য পাওয়া যাচ্ছে না।</p>;

  if (status === "done") {
    return (
      <div className="card mx-auto max-w-md p-6 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-green-100 text-4xl text-green-600">✓</div>
        <h3 className="mt-4 font-display text-2xl font-bold text-brand">{text.success_title}</h3>
        <p className="mt-2 text-slate-700">{text.success_text}</p>
        <p className="mt-4 rounded-xl bg-tint-50 py-3 text-lg font-bold">সর্বমোট: {taka(total)}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onBlur={saveDraft}
      onFocus={onStartCheckout}
      className="scroll-mt-4 rounded-3xl border-2 border-tint-200 bg-white/90 p-3 shadow-card backdrop-blur md:p-6"
    >
      {/* Bot dhorar fad: manush eta dekhe na, bot puron kore */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true" />

      {/* ───── packages ───── */}
      <h3 className="mb-4 text-center font-display text-xl font-bold md:text-2xl">{text.form_head}</h3>
      <div className="space-y-3">
        {products.map((p) => {
          const active = p.id === selected.id;
          return (
            <div
              key={p.id}
              role="radio"
              aria-checked={active}
              tabIndex={0}
              onClick={() => setPkg(p.id)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  setPkg(p.id);
                }
              }}
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 transition ${
                active ? "border-brand bg-tint-50 shadow-sm" : "border-tint-100 bg-white hover:border-tint-300"
              }`}
            >
              <Radio checked={active} />
              {p.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" className="h-16 w-16 shrink-0 rounded-xl bg-tint-50 object-cover md:h-[72px] md:w-[72px]" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug">{p.name}</p>
                <div className="mt-2">
                  <Stepper value={qty[p.id]} onChange={(d) => changeQty(p.id, d)} />
                </div>
              </div>
              <p className="shrink-0 self-center text-right text-lg font-bold text-brand">{taka(p.price)}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* ───── billing + shipping ───── */}
        <div>
          <h3 className="mb-3 text-xl font-bold">{text.billing_title}</h3>
          <div className="space-y-4">
            <label className="block">
              <span className="mb-1 block font-semibold">
                {text.name_label} <span className="text-red-500">*</span>
              </span>
              <input name="name" required className="input" placeholder={text.name_ph} autoComplete="name" />
            </label>
            <label className="block">
              <span className="mb-1 block font-semibold">
                {text.address_label} <span className="text-red-500">*</span>
              </span>
              <input name="address" required className="input" placeholder={text.address_ph} autoComplete="street-address" />
            </label>
            <label className="block">
              <span className="mb-1 block font-semibold">
                {text.phone_label} <span className="text-red-500">*</span>
              </span>
              <input name="phone" required inputMode="numeric" maxLength={11} className="input" placeholder="01XXXXXXXXX" autoComplete="tel" />
            </label>
          </div>

          <h3 className="mb-3 mt-6 text-xl font-bold">{text.shipping_title}</h3>
          {freeBoxes > 0 && (
            <p
              className={`mb-3 rounded-xl border border-dashed px-4 py-2.5 font-semibold ${
                freeShip ? "border-green-400 bg-green-50 text-green-800" : "border-amber-400 bg-amber-50 text-amber-800"
              }`}
            >
              {freeShip ? text.free_done : text.free_hint}
            </p>
          )}
          <div className="space-y-2.5">
            {delivery.map((d) => (
              <label
                key={d.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition ${
                  area === d.id ? "border-brand bg-tint-50" : "border-tint-100 bg-white hover:border-tint-300"
                }`}
              >
                <input type="radio" name="area" checked={area === d.id} onChange={() => setArea(d.id)} className="sr-only" />
                <Radio checked={area === d.id} />
                <span className="flex-1 font-semibold">{d.label}</span>
                <span className="font-bold">
                  {freeShip ? (
                    <>
                      <del className="mr-1 text-sm font-normal text-slate-400">{taka(d.charge)}</del>
                      <span className="text-green-600">ফ্রি</span>
                    </>
                  ) : (
                    taka(d.charge)
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* ───── order summary ───── */}
        <div className="h-fit rounded-2xl border border-tint-200 bg-tint-50/60 p-4 md:p-6">
          <h3 className="mb-4 text-xl font-bold">{text.summary_title}</h3>
          <table className="w-full text-[15px]">
            <thead>
              <tr className="border-b border-tint-200 text-left">
                <th className="pb-2 font-bold">প্রোডাক্ট</th>
                <th className="pb-2 text-right font-bold">মূল্য</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-tint-200">
                <td className="py-3 pr-2">
                  {selected.name} <b>× {bn(qty[selected.id])}</b>
                </td>
                <td className="py-3 text-right">{taka(subtotal)}</td>
              </tr>
              <tr className="border-b border-tint-200">
                <td className="py-3">সাবটোটাল</td>
                <td className="py-3 text-right">{taka(subtotal)}</td>
              </tr>
              <tr className="border-b border-tint-200">
                <td className="py-3">ডেলিভারি চার্জ</td>
                <td className="py-3 text-right">{freeShip ? <span className="font-semibold text-green-600">ফ্রি 🎉</span> : taka(charge)}</td>
              </tr>
              <tr>
                <td className="pt-3 text-xl font-bold text-brand">সর্বমোট</td>
                <td className="pt-3 text-right text-xl font-bold text-brand">{taka(total)}</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-5 rounded-xl bg-white p-2">
            <div className="flex items-center gap-3 rounded-lg border-2 border-brand bg-tint-50 px-3 py-2.5 font-semibold">
              <Radio checked />
              {text.cod_label}
            </div>
            {text.hadith && <p className="px-2 pb-1 pt-3 text-sm leading-relaxed text-slate-600">{text.hadith}</p>}
          </div>

          {text.privacy && <p className="mt-4 text-xs leading-relaxed text-slate-500">{text.privacy}</p>}

          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="animate-pulse-ring mt-4 w-full rounded-full cta-grad py-4 font-display text-2xl font-bold text-white shadow-lg transition hover:brightness-110 disabled:animate-none disabled:opacity-60"
          >
            {status === "loading" ? "অপেক্ষা করুন..." : `${text.submit_btn} ${taka(total)}`}
          </button>
        </div>
      </div>
    </form>
  );
}
