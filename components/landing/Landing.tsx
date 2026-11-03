import type { PublicSettings } from "@/lib/types";
import { toBanglaDigits } from "@/lib/utils";
import {
  BadgeCheckIcon,
  CartIcon,
  CashHandIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  DropIcon,
  HeartIcon,
  LeafIcon,
  ShieldCheckIcon,
  SparkleIcon,
  StarIcon,
  TruckIcon,
} from "../icons";
import OrderForm from "./OrderForm";
import FloatingActions from "./FloatingActions";

const FEATURES = [
  { icon: SparkleIcon, text: ["ত্বক করে", "উজ্জ্বল ও ফর্সা"] },
  { icon: DropIcon, text: ["দাগ ও কালো", "ছোপ দূর করে"] },
  { icon: ShieldCheckIcon, text: ["ত্বককে করে", "সুস্থ ও কোমল"] },
  { icon: LeafIcon, text: ["ত্বকের স্বাভাবিক", "উজ্জ্বলতা ধরে রাখে"] },
];

const WHY = [
  "Ceramide ও Arbutin সমৃদ্ধ",
  "দাগ, পিগমেন্টেশন কমায়",
  "ত্বককে করে মসৃণ ও কোমল",
  "সব ধরনের ত্বকের জন্য উপযোগী",
];

const INGREDIENTS = [
  { img: "/images/ing-ceramide.png", name: "Ceramide", note: "(ত্বক সুরক্ষা)" },
  { img: "/images/ing-arbutin.png", name: "Arbutin", note: "(দাগ হ্রাস)" },
  { img: "/images/ing-salicylic.png", name: "Salicylic Acid", note: "(ত্বক পরিষ্কার)" },
];

function PriceBadge({ price, className = "" }: { price: number; className?: string }) {
  return (
    <div className={`relative inline-block -rotate-[8deg] ${className}`}>
      {/* yellow sparkle strokes */}
      <span className="absolute -left-5 top-2 h-1.5 w-6 rotate-[35deg] rounded-full bg-gold" />
      <span className="absolute -left-6 top-7 h-1.5 w-5 rounded-full bg-gold" />
      <span className="absolute -right-4 -top-1 h-1.5 w-6 -rotate-[40deg] rounded-full bg-gold" />
      <span className="absolute -right-6 top-5 h-1.5 w-5 -rotate-[10deg] rounded-full bg-gold" />
      <div className="brush bg-gradient-to-br from-[#d81b60] via-[#b0124f] to-[#8a0c3d] px-8 pb-4 pt-3 text-center shadow-xl">
        <div className="font-display text-3xl font-bold leading-none text-white md:text-4xl">মাত্র</div>
        <div className="gold-text font-display text-7xl font-extrabold leading-[0.95] md:text-[6.5rem]">
          {toBanglaDigits(price)}
        </div>
        <div className="font-display text-3xl font-bold leading-none text-white md:text-4xl">টাকা</div>
      </div>
    </div>
  );
}

function OrderButton({ text }: { text: string }) {
  return (
    <a
      href="#order"
      className="animate-pulse-ring group mx-auto flex w-full max-w-xl items-center justify-between gap-3 rounded-full border-4 border-white/70 bg-gradient-to-b from-[#e91e63] via-[#c2185b] to-[#8e0e44] py-3 pl-6 pr-3 text-white shadow-2xl transition hover:scale-[1.02] md:py-4"
    >
      <CartIcon className="h-9 w-9 shrink-0 md:h-12 md:w-12" />
      <span className="font-display text-2xl font-bold md:text-4xl">{text}</span>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-brand md:h-12 md:w-12">
        <ChevronRightIcon className="h-6 w-6 transition group-hover:translate-x-0.5" />
      </span>
    </a>
  );
}

export default function Landing({ settings }: { settings: PublicSettings }) {
  const { content, product, reviews } = settings;

  return (
    <div className="page-bg min-h-screen">
      {content.noticeBar && (
        <div className="overflow-hidden bg-brand py-1.5 text-sm font-medium text-white">
          <div className="animate-marquee whitespace-nowrap">{content.noticeBar}</div>
        </div>
      )}

      <main className="relative mx-auto max-w-[900px] overflow-hidden pb-28 md:pb-12">
        {/* ───────── HERO ───────── */}
        <section className="relative md:min-h-[700px]">
          <div className="relative z-10 px-4 pt-6 text-center md:w-[56%] md:pl-10 md:pt-9 md:text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="TeaShell" className="mx-auto h-auto w-56 md:mx-0 md:w-[330px]" />
            <div className="mx-auto my-2 flex w-56 items-center gap-2 md:mx-0 md:w-80">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-600/70" />
              <LeafIcon className="h-4 w-4 text-amber-600" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-600/70" />
            </div>
            <h1 className="font-display text-[2.3rem] font-extrabold leading-tight min-[400px]:text-[2.6rem] md:whitespace-nowrap md:text-[3.15rem]">
              <span className="text-brand">{content.heroTitleColored}</span>{" "}
              <span className="text-slate-900">{content.heroTitleDark}</span>
            </h1>
            <p className="mx-auto mt-2 max-w-sm rounded-[2rem] bg-gradient-to-r from-pink-200/90 via-pink-100/90 to-pink-200/90 px-5 py-2 text-lg font-semibold leading-snug text-slate-900 shadow-sm md:mx-0 md:max-w-[400px] md:text-[1.35rem]">
              {content.heroSubtitle}
            </p>
            <svg viewBox="0 0 300 20" className="mx-auto mt-2 hidden w-64 text-brand md:mx-0 md:block" aria-hidden>
              <path d="M5 16 Q150 -4 295 8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
            <div className="mt-4 hidden md:block md:pl-6">
              <PriceBadge price={product.price} />
              {product.regularPrice > product.price && (
                <p className="mt-3 pl-4 text-lg font-semibold text-slate-600">
                  নিয়মিত মূল্য <del className="text-red-500">{toBanglaDigits(product.regularPrice)}</del> টাকা
                </p>
              )}
            </div>
          </div>

          <div className="relative mt-2 md:absolute md:bottom-0 md:right-0 md:top-0 md:mt-0 md:w-[62%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.heroImage}
              alt={product.name}
              className="ml-auto h-auto w-[92%] [mask-image:linear-gradient(to_right,transparent,black_6%)] md:h-full md:w-full md:object-contain md:object-bottom"
            />
            <div className="absolute left-3 top-[12%] origin-top-left scale-[0.62] md:hidden">
              <PriceBadge price={product.price} />
            </div>
          </div>
        </section>

        {/* ───────── FEATURES ───────── */}
        <section className="relative z-10 mx-3 -mt-2 grid grid-cols-2 gap-y-5 rounded-2xl bg-white/80 px-2 py-5 shadow-card backdrop-blur md:mx-0 md:mt-0 md:grid-cols-4 md:rounded-none md:bg-white/60 md:py-6">
          {FEATURES.map(({ icon: Icon, text }, i) => (
            <div
              key={i}
              className={`flex flex-col items-center text-center ${i % 2 === 0 ? "border-r border-pink-200" : ""} md:border-r md:border-pink-300 md:last:border-0`}
            >
              <span className="mb-2 grid h-14 w-14 place-items-center rounded-full border-2 border-brand bg-white text-brand">
                <Icon className="h-7 w-7" />
              </span>
              <p className="text-[15px] font-semibold leading-snug md:text-lg">
                {text[0]}
                <br />
                {text[1]}
              </p>
            </div>
          ))}
        </section>

        {/* ───────── WHY TEASHELL ───────── */}
        <section className="mt-6 grid gap-4 px-3 md:grid-cols-[1fr_1.15fr] md:px-5">
          <div className="card bg-gradient-to-br from-white to-pink-50 p-5">
            <div className="brush -ml-1 inline-block bg-gradient-to-r from-[#d81b60] to-[#ad1457] px-6 py-2 shadow-md">
              <h2 className="font-display text-3xl font-bold text-white">
                কেন <span className="font-sans italic">TeaShell?</span>
              </h2>
            </div>
            <ul className="mt-4 space-y-3">
              {WHY.map((w) => (
                <li key={w} className="flex items-center gap-3 text-lg font-semibold md:text-xl">
                  <CheckCircleIcon className="h-6 w-6 shrink-0 text-brand" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-2xl shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={content.beforeAfterImage} alt="ব্যবহারের আগে ও পরে" className="h-full w-full object-cover" />
            <span className="absolute bottom-2 left-[13%] rounded-md bg-slate-700/90 px-6 py-0.5 text-xl font-bold text-white">আগে</span>
            <span className="absolute bottom-2 right-[13%] rounded-md bg-brand px-6 py-0.5 text-xl font-bold text-white">এখন</span>
          </div>
        </section>

        {/* ───────── INGREDIENTS + TAGLINE ───────── */}
        <section className="relative mt-10 grid items-center gap-6 px-3 md:grid-cols-[1.55fr_1fr] md:px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/leaf-left.png" alt="" className="pointer-events-none absolute -left-1 top-4 hidden w-10 md:block" />
          <div className="card relative bg-gradient-to-b from-pink-100 to-pink-50 px-3 pb-5 pt-9 md:ml-6">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="pill-heading">বিশেষ উপাদান</span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-pink-300">
              {INGREDIENTS.map((ing) => (
                <div key={ing.name} className="flex flex-col items-center px-1 text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ing.img} alt={ing.name} className="h-16 w-16 md:h-20 md:w-20" />
                  <p className="mt-2 text-sm font-semibold text-slate-800 md:text-lg">{ing.name}</p>
                  <p className="text-xs font-medium text-slate-700 md:text-base">{ing.note}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative py-2 text-center">
            <p className="-rotate-[5deg] font-display text-4xl font-extrabold leading-tight text-slate-900 md:text-[2.6rem]">
              {content.tagline.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="text-brand">{content.tagline.split(" ").slice(-2).join(" ")}</span>
            </p>
            <svg viewBox="0 0 220 24" className="mx-auto mt-1 w-48 -rotate-[5deg] text-brand" aria-hidden>
              <path d="M4 18 Q110 0 216 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
            <HeartIcon className="absolute bottom-0 right-[18%] h-5 w-5 text-brand" />
          </div>
        </section>

        {/* ───────── REVIEWS ───────── */}
        <section className="mt-10 bg-white/50 px-3 py-6 md:px-5">
          <div className="text-center">
            <span className="pill-heading">
              <StarIcon className="h-6 w-6 text-gold" />
              আমাদের গ্রাহকদের মতামত
              <StarIcon className="h-6 w-6 text-gold" />
            </span>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.id} className="card flex items-center gap-3 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.avatar || "/images/review-2.png"} alt={r.name} className="h-20 w-20 shrink-0 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold leading-snug">“{r.text}”</p>
                  <p className="mt-1 text-sm text-slate-600">— {r.name}</p>
                  <div className="mt-1 flex text-amber-400">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ───────── TRUST BAR ───────── */}
        <section className="grid grid-cols-3 divide-x divide-slate-300 px-2 py-6 md:px-10">
          <div className="flex flex-col items-center gap-2 text-center md:flex-row md:text-left">
            <TruckIcon className="h-9 w-14 shrink-0 text-brand md:h-11 md:w-20" />
            <p className="text-sm font-semibold leading-snug md:text-lg">সারা দেশে<br />দ্রুত ডেলিভারি</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 text-center md:flex-row md:text-left">
            <BadgeCheckIcon className="h-11 w-10 shrink-0 md:h-14 md:w-12" />
            <p className="text-sm font-semibold leading-snug md:text-lg">১০০% অরিজিনাল<br />প্রোডাক্ট</p>
          </div>
          <div className="flex flex-col items-center justify-end gap-2 text-center md:flex-row md:text-left">
            <CashHandIcon className="h-11 w-12 shrink-0 md:h-14 md:w-14" />
            <p className="text-sm font-semibold leading-snug md:text-lg">ক্যাশ অন<br />ডেলিভারি</p>
          </div>
        </section>

        <div className="px-4">
          <OrderButton text={content.ctaText} />
        </div>

        {/* ───────── ORDER FORM ───────── */}
        <section id="order" className="scroll-mt-4 px-3 pt-10 md:px-5">
          <OrderForm settings={settings} />
        </section>

        <footer className="mt-10 px-4 text-center text-sm text-slate-600">
          {content.phone && (
            <p>
              যেকোনো প্রয়োজনে কল করুন:{" "}
              <a href={`tel:${content.phone}`} className="font-semibold text-brand">
                {toBanglaDigits(content.phone)}
              </a>
            </p>
          )}
          <p className="mt-1">{content.footerText}</p>
        </footer>
      </main>

      <FloatingActions phone={content.phone} whatsapp={content.whatsapp} />
    </div>
  );
}
