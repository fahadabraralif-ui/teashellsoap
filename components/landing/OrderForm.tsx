"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { DeliveryArea, PublicSettings } from "@/lib/types";
import { calcTotals, getPackages, normalizePhone, toBanglaDigits } from "@/lib/utils";
import { track } from "@/lib/pixel";

function sessionId() {
  try {
    const existing = localStorage.getItem("ts_sid");
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem("ts_sid", id);
    return id;
  } catch {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
}

const taka = (n: number) => `৳${toBanglaDigits(n.toLocaleString("en-IN"))}`;

/** Colours the "নিচের ফরমটি" part of the heading, like the reference design. */
function FormTitle({ text }: { text: string }) {
  const key = "নিচের ফরমটি";
  const i = text.indexOf(key);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="text-brand">{key}</span>
      {text.slice(i + key.length)}
    </>
  );
}

function Stepper({ value, onChange, max }: { value: number; onChange: (n: number) => void; max: number }) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border border-pink-300 bg-white" onClick={(e) => e.stopPropagation()}>
      <button type="button" aria-label="কমান" className="px-3 py-1 text-lg font-bold text-brand hover:bg-pink-50" onClick={() => onChange(Math.max(1, value - 1))}>
        −
      </button>
      <span className="w-8 text-center font-bold">{toBanglaDigits(value)}</span>
      <button type="button" aria-label="বাড়ান" className="px-3 py-1 text-lg font-bold text-brand hover:bg-pink-50" onClick={() => onChange(Math.min(max, value + 1))}>
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

export default function OrderForm({ settings }: { settings: PublicSettings }) {
  const { product, delivery, content } = settings;
  const router = useRouter();
  const packages = getPackages(product);

  const [packageId, setPackageId] = useState(packages[0].id);
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState<DeliveryArea>("inside");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const sid = useRef("");
  const checkoutTracked = useRef(false);

  const pkg = packages.find((p) => p.id === packageId) ?? packages[0];
  const qtyOf = (id: string) => qtys[id] ?? 1;
  const packageQty = qtyOf(pkg.id);
  const quantity = pkg.quantity * packageQty;
  const subtotal = pkg.price * packageQty;
  const totals = useMemo(() => calcTotals(subtotal, quantity, area, delivery), [subtotal, quantity, area, delivery]);
  const maxPackages = (p: (typeof packages)[number]) => Math.max(1, Math.floor(product.maxQuantity / p.quantity));
  const freeDelivery = delivery.freeDeliveryMinQty > 0 && quantity >= delivery.freeDeliveryMinQty;
  const outOfStock = product.stock <= 0;

  useEffect(() => {
    sid.current = sessionId();
  }, []);

  // Save partially filled forms so the admin can call customers who didn't finish.
  useEffect(() => {
    if (!normalizePhone(phone)) return;
    const t = setTimeout(() => {
      fetch("/api/incomplete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sid: sid.current, name, phone, address, area, quantity }),
        keepalive: true,
      }).catch(() => undefined);
    }, 1200);
    return () => clearTimeout(t);
  }, [name, phone, address, area, quantity]);

  function onFirstInput() {
    if (checkoutTracked.current) return;
    checkoutTracked.current = true;
    track("InitiateCheckout", { currency: "BDT", value: subtotal, content_name: product.name });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("অনুগ্রহ করে আপনার নাম লিখুন");
    if (address.trim().length < 8) return setError("অনুগ্রহ করে সম্পূর্ণ ঠিকানা লিখুন");
    if (!normalizePhone(phone)) return setError("সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 01XXXXXXXXX)");

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sid: sid.current, name, phone, address, area, packageId: pkg.id, packageQty, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "অর্ডার করা যায়নি, আবার চেষ্টা করুন");
      // The Purchase pixel event fires on the thank-you page.
      router.push(`/thank-you?id=${data.id}&t=${data.token}`);
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="mx-auto mb-6 max-w-2xl text-center font-display text-[1.7rem] font-extrabold leading-snug text-slate-900 md:text-4xl">
        <FormTitle text={content.orderFormTitle} />
      </h2>

      <form onSubmit={submit} onInput={onFirstInput} className="rounded-3xl border-2 border-pink-200 bg-white/90 p-3 shadow-card backdrop-blur md:p-6">
        {/* ───── packages ───── */}
        <h3 className="mb-4 text-center font-display text-xl font-bold md:text-2xl">পছন্দের প্যাকেজ সিলেক্ট করুন</h3>
        <div className="space-y-3">
          {packages.map((p) => {
            const active = p.id === pkg.id;
            const q = qtyOf(p.id);
            return (
              <div
                key={p.id}
                role="radio"
                aria-checked={active}
                tabIndex={0}
                onClick={() => setPackageId(p.id)}
                onKeyDown={(e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), setPackageId(p.id))}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 transition ${
                  active ? "border-brand bg-pink-50 shadow-sm" : "border-pink-100 bg-white hover:border-pink-300"
                }`}
              >
                <Radio checked={active} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.image} alt="" className="h-16 w-16 shrink-0 rounded-xl bg-pink-50 object-cover md:h-[72px] md:w-[72px]" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold leading-snug">
                    {product.name} — <span className="text-brand">{p.label}</span>
                  </p>
                  <div className="mt-2">
                    <Stepper
                      value={q}
                      max={maxPackages(p)}
                      onChange={(n) => {
                        setQtys((s) => ({ ...s, [p.id]: n }));
                        setPackageId(p.id);
                      }}
                    />
                  </div>
                </div>
                <p className="shrink-0 self-center text-right text-lg font-bold text-brand">{taka(p.price * q)}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* ───── billing + shipping ───── */}
          <div>
            <h3 className="mb-3 text-xl font-bold">আপনার তথ্য</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block font-semibold">
                  আপনার নাম <span className="text-red-500">*</span>
                </label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="আপনার নাম" autoComplete="name" />
              </div>
              <div>
                <label className="mb-1 block font-semibold">
                  আপনার ঠিকানা <span className="text-red-500">*</span>
                </label>
                <input
                  className="input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="বাসা/রোড, থানা, জেলা"
                  autoComplete="street-address"
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">
                  মোবাইল নাম্বার <span className="text-red-500">*</span>
                </label>
                <input
                  className="input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={17}
                />
              </div>
              <div>
                <label className="mb-1 block font-semibold">অতিরিক্ত নোট (ঐচ্ছিক)</label>
                <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="কিছু জানাতে চাইলে লিখুন" />
              </div>
            </div>

            <h3 className="mb-3 mt-6 text-xl font-bold">ডেলিভারি</h3>
            {delivery.freeDeliveryMinQty > 0 && (
              <p className="mb-3 rounded-xl border border-dashed border-amber-400 bg-amber-50 px-4 py-2.5 font-semibold text-amber-800">
                🚚 {toBanglaDigits(delivery.freeDeliveryMinQty)} পিছ বা বেশি নিলে ডেলিভারি চার্জ ফ্রি!
              </p>
            )}
            <div className="space-y-2.5">
              {(["inside", "outside"] as const).map((a) => (
                <label
                  key={a}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 transition ${
                    area === a ? "border-brand bg-pink-50" : "border-pink-100 bg-white hover:border-pink-300"
                  }`}
                >
                  <input type="radio" name="area" checked={area === a} onChange={() => setArea(a)} className="sr-only" />
                  <Radio checked={area === a} />
                  <span className="flex-1 font-semibold">{a === "inside" ? delivery.insideLabel : delivery.outsideLabel}</span>
                  <span className="font-bold">
                    {freeDelivery ? (
                      <>
                        <del className="mr-1 text-sm font-normal text-slate-400">{taka(a === "inside" ? delivery.inside : delivery.outside)}</del>
                        <span className="text-green-600">ফ্রি</span>
                      </>
                    ) : (
                      taka(a === "inside" ? delivery.inside : delivery.outside)
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* ───── order summary ───── */}
          <div className="h-fit rounded-2xl border border-pink-200 bg-pink-50/60 p-4 md:p-6">
            <h3 className="mb-4 text-xl font-bold">আপনার অর্ডার</h3>
            <table className="w-full text-[15px]">
              <thead>
                <tr className="border-b border-pink-200 text-left">
                  <th className="pb-2 font-bold">প্রোডাক্ট</th>
                  <th className="pb-2 text-right font-bold">মূল্য</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-pink-200">
                  <td className="py-3 pr-2">
                    {product.name} — {pkg.label} <b>× {toBanglaDigits(packageQty)}</b>
                  </td>
                  <td className="py-3 text-right">{taka(subtotal)}</td>
                </tr>
                <tr className="border-b border-pink-200">
                  <td className="py-3">সাবটোটাল</td>
                  <td className="py-3 text-right">{taka(subtotal)}</td>
                </tr>
                <tr className="border-b border-pink-200">
                  <td className="py-3">ডেলিভারি চার্জ</td>
                  <td className="py-3 text-right">{totals.deliveryCharge === 0 ? <span className="font-semibold text-green-600">ফ্রি</span> : taka(totals.deliveryCharge)}</td>
                </tr>
                <tr>
                  <td className="pt-3 text-xl font-bold text-brand">সর্বমোট</td>
                  <td className="pt-3 text-right text-xl font-bold text-brand">{taka(totals.total)}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-5 rounded-xl bg-white p-2">
              <div className="flex items-center gap-3 rounded-lg border-2 border-brand bg-pink-50 px-3 py-2.5 font-semibold">
                <Radio checked />
                ক্যাশ অন ডেলিভারি
              </div>
              {content.paymentNote && <p className="px-2 pb-1 pt-3 text-sm leading-relaxed text-slate-600">{content.paymentNote}</p>}
            </div>

            <p className="mt-4 text-xs leading-relaxed text-slate-500">
              আপনার দেওয়া তথ্য শুধুমাত্র অর্ডার প্রসেস ও ডেলিভারির জন্য ব্যবহার করা হবে।
            </p>

            {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={submitting || outOfStock}
              className="animate-pulse-ring mt-4 w-full rounded-full bg-gradient-to-b from-[#e91e63] to-[#a3104d] py-4 font-display text-2xl font-bold text-white shadow-lg transition hover:brightness-110 disabled:animate-none disabled:opacity-60"
            >
              {outOfStock ? "স্টক শেষ" : submitting ? "অপেক্ষা করুন..." : `অর্ডার করুন ${taka(totals.total)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
