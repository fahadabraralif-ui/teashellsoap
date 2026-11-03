import { bn } from "@/data/site";
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
import OrderForm, { type FormProduct } from "./OrderForm";
import FloatingActions from "./FloatingActions";

const FEATURE_ICONS = [SparkleIcon, DropIcon, ShieldCheckIcon, LeafIcon];

type Item = Record<string, string>;

export type LandingProps = {
  /** Landing text with {price}-style tokens already filled in. */
  t: Record<string, string>;
  lists: { features: Item[]; why: Item[]; ingredients: Item[]; reviews: Item[] };
  products: FormProduct[];
  delivery: { id: string; label: string; charge: number }[];
  freeBoxes: number;
  price: number;
  oldPrice: number;
  heroImage: string;
  beforeAfterImage: string;
  logo: string;
  brand: string;
  phone: string;
  whatsapp: string;
};

/** Text inside [ ] is highlighted in the brand colour. */
function H({ text }: { text: string }) {
  return (
    <>
      {String(text)
        .split(/(\[[^\]]*\])/)
        .map((part, i) =>
          part.startsWith("[") && part.endsWith("]") ? (
            <span key={i} className="text-brand">
              {part.slice(1, -1)}
            </span>
          ) : (
            part
          ),
        )}
    </>
  );
}

function PriceBadge({ price, top, bottom, className = "" }: { price: number; top: string; bottom: string; className?: string }) {
  return (
    <div className={`relative inline-block -rotate-[8deg] ${className}`}>
      {/* yellow sparkle strokes */}
      <span className="absolute -left-5 top-2 h-1.5 w-6 rotate-[35deg] rounded-full bg-gold" />
      <span className="absolute -left-6 top-7 h-1.5 w-5 rounded-full bg-gold" />
      <span className="absolute -right-4 -top-1 h-1.5 w-6 -rotate-[40deg] rounded-full bg-gold" />
      <span className="absolute -right-6 top-5 h-1.5 w-5 -rotate-[10deg] rounded-full bg-gold" />
      <div className="brush bg-gradient-to-br from-[#d81b60] via-[#b0124f] to-[#8a0c3d] px-8 pb-4 pt-3 text-center shadow-xl">
        <div className="font-display text-3xl font-bold leading-none text-white md:text-4xl">{top}</div>
        <div className="gold-text font-display text-7xl font-extrabold leading-[0.95] md:text-[6.5rem]">{bn(price)}</div>
        <div className="font-display text-3xl font-bold leading-none text-white md:text-4xl">{bottom}</div>
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

export default function Landing(props: LandingProps) {
  const { t, lists, products, delivery, freeBoxes, price, oldPrice, heroImage, beforeAfterImage, logo, brand, phone, whatsapp } = props;

  const formText = Object.fromEntries(
    [
      "form_head", "billing_title", "name_label", "name_ph", "address_label", "address_ph", "phone_label", "shipping_title",
      "free_hint", "free_done", "summary_title", "cod_label", "hadith", "privacy", "submit_btn", "success_title", "success_text",
    ].map((k) => [k, t[k]]),
  );

  return (
    <div className="page-bg min-h-screen">
      {t.topbar && (
        <div className="overflow-hidden bg-brand py-1.5 text-sm font-medium text-white">
          <div className="animate-marquee whitespace-nowrap">{t.topbar}</div>
        </div>
      )}

      <main className="relative mx-auto max-w-[900px] overflow-hidden pb-28 md:pb-12">
        {/* ───────── HERO ───────── */}
        <section className="relative md:min-h-[700px]">
          <div className="relative z-10 px-4 pt-6 text-center md:w-[56%] md:pl-10 md:pt-9 md:text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={brand} className="mx-auto h-auto w-56 md:mx-0 md:w-[330px]" />
            <div className="mx-auto my-2 flex w-56 items-center gap-2 md:mx-0 md:w-80">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-600/70" />
              <LeafIcon className="h-4 w-4 text-amber-600" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-600/70" />
            </div>
            <h1 className="font-display text-[2.3rem] font-extrabold leading-tight text-slate-900 min-[400px]:text-[2.6rem] md:whitespace-nowrap md:text-[3.15rem]">
              <H text={t.hero_title} />
            </h1>
            <p className="mx-auto mt-2 max-w-sm rounded-[2rem] bg-gradient-to-r from-pink-200/90 via-pink-100/90 to-pink-200/90 px-5 py-2 text-lg font-semibold leading-snug text-slate-900 shadow-sm md:mx-0 md:max-w-[400px] md:text-[1.35rem]">
              {t.hero_sub}
            </p>
            <svg viewBox="0 0 300 20" className="mx-auto mt-2 hidden w-64 text-brand md:mx-0 md:block" aria-hidden>
              <path d="M5 16 Q150 -4 295 8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
            <div className="mt-4 hidden md:block md:pl-6">
              <PriceBadge price={price} top={t.badge_top} bottom={t.badge_bottom} />
              {oldPrice > price && t.regular_text && (
                <p className="mt-3 pl-4 text-lg font-semibold text-slate-600">{t.regular_text}</p>
              )}
            </div>
          </div>

          <div className="relative mt-2 md:absolute md:bottom-0 md:right-0 md:top-0 md:mt-0 md:w-[62%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt={brand}
              className="ml-auto h-auto w-[92%] [mask-image:linear-gradient(to_right,transparent,black_6%)] md:h-full md:w-full md:object-contain md:object-bottom"
            />
            <div className="absolute left-3 top-[12%] origin-top-left scale-[0.62] md:hidden">
              <PriceBadge price={price} top={t.badge_top} bottom={t.badge_bottom} />
            </div>
          </div>
        </section>

        {/* ───────── FEATURES ───────── */}
        <section className="relative z-10 mx-3 -mt-2 grid grid-cols-2 gap-y-5 rounded-2xl bg-white/80 px-2 py-5 shadow-card backdrop-blur md:mx-0 md:mt-0 md:grid-cols-4 md:rounded-none md:bg-white/60 md:py-6">
          {lists.features.slice(0, 4).map((f, i) => {
            const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
            return (
              <div
                key={i}
                className={`flex flex-col items-center text-center ${i % 2 === 0 ? "border-r border-pink-200" : ""} md:border-r md:border-pink-300 md:last:border-0`}
              >
                <span className="mb-2 grid h-14 w-14 place-items-center rounded-full border-2 border-brand bg-white text-brand">
                  <Icon className="h-7 w-7" />
                </span>
                <p className="text-[15px] font-semibold leading-snug md:text-lg">
                  {f.title}
                  <br />
                  {f.text}
                </p>
              </div>
            );
          })}
        </section>

        {/* ───────── WHY ───────── */}
        <section className="mt-6 grid gap-4 px-3 md:grid-cols-[1fr_1.15fr] md:px-5">
          <div className="card bg-gradient-to-br from-white to-pink-50 p-5">
            <div className="brush -ml-1 inline-block bg-gradient-to-r from-[#d81b60] to-[#ad1457] px-6 py-2 shadow-md">
              <h2 className="font-display text-3xl font-bold text-white">{t.why_title}</h2>
            </div>
            <ul className="mt-4 space-y-3">
              {lists.why.map((w, i) => (
                <li key={i} className="flex items-center gap-3 text-lg font-semibold md:text-xl">
                  <CheckCircleIcon className="h-6 w-6 shrink-0 text-brand" />
                  {w.text}
                </li>
              ))}
            </ul>
          </div>
          {beforeAfterImage && (
            <div className="relative overflow-hidden rounded-2xl shadow-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={beforeAfterImage} alt={`${t.before_label} / ${t.after_label}`} className="h-full w-full object-cover" />
              <span className="absolute bottom-2 left-[13%] rounded-md bg-slate-700/90 px-6 py-0.5 text-xl font-bold text-white">{t.before_label}</span>
              <span className="absolute bottom-2 right-[13%] rounded-md bg-brand px-6 py-0.5 text-xl font-bold text-white">{t.after_label}</span>
            </div>
          )}
        </section>

        {/* ───────── INGREDIENTS + TAGLINE ───────── */}
        <section className="relative mt-10 grid items-center gap-6 px-3 md:grid-cols-[1.55fr_1fr] md:px-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/leaf-left.png" alt="" className="pointer-events-none absolute -left-1 top-4 hidden w-10 md:block" />
          <div className="card relative bg-gradient-to-b from-pink-100 to-pink-50 px-3 pb-5 pt-9 md:ml-6">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="pill-heading">{t.ing_title}</span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-pink-300">
              {lists.ingredients.slice(0, 3).map((ing, i) => (
                <div key={i} className="flex flex-col items-center px-1 text-center">
                  {ing.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ing.image} alt={ing.name} className="h-16 w-16 rounded-full object-cover md:h-20 md:w-20" />
                  )}
                  <p className="mt-2 text-sm font-semibold text-slate-800 md:text-lg">{ing.name}</p>
                  <p className="text-xs font-medium text-slate-700 md:text-base">{ing.note}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative py-2 text-center">
            <p className="-rotate-[5deg] font-display text-4xl font-extrabold leading-tight text-slate-900 md:text-[2.6rem]">
              <H text={t.tagline} />
            </p>
            <svg viewBox="0 0 220 24" className="mx-auto mt-1 w-48 -rotate-[5deg] text-brand" aria-hidden>
              <path d="M4 18 Q110 0 216 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
            <HeartIcon className="absolute bottom-0 right-[18%] h-5 w-5 text-brand" />
          </div>
        </section>

        {/* ───────── REVIEWS ───────── */}
        {lists.reviews.length > 0 && (
          <section className="mt-10 bg-white/50 px-3 py-6 md:px-5">
            <div className="text-center">
              <span className="pill-heading">
                <StarIcon className="h-6 w-6 text-gold" />
                {t.reviews_title}
                <StarIcon className="h-6 w-6 text-gold" />
              </span>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {lists.reviews.map((r, i) => (
                <div key={i} className="card flex items-center gap-3 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image || "/images/review-2.png"} alt={r.name} className="h-20 w-20 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold leading-snug">“{r.text}”</p>
                    <p className="mt-1 text-sm text-slate-600">— {r.name}</p>
                    <div className="mt-1 flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <StarIcon key={j} className="h-4 w-4" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ───────── TRUST BAR ───────── */}
        <section className="grid grid-cols-3 divide-x divide-slate-300 px-2 py-6 md:px-10">
          <div className="flex flex-col items-center gap-2 text-center md:flex-row md:text-left">
            <TruckIcon className="h-9 w-14 shrink-0 text-brand md:h-11 md:w-20" />
            <p className="text-sm font-semibold leading-snug md:text-lg">{t.trust1_a}<br />{t.trust1_b}</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2 text-center md:flex-row md:text-left">
            <BadgeCheckIcon className="h-11 w-10 shrink-0 md:h-14 md:w-12" />
            <p className="text-sm font-semibold leading-snug md:text-lg">{t.trust2_a}<br />{t.trust2_b}</p>
          </div>
          <div className="flex flex-col items-center justify-end gap-2 text-center md:flex-row md:text-left">
            <CashHandIcon className="h-11 w-12 shrink-0 md:h-14 md:w-14" />
            <p className="text-sm font-semibold leading-snug md:text-lg">{t.trust3_a}<br />{t.trust3_b}</p>
          </div>
        </section>

        <div className="px-4">
          <OrderButton text={t.cta_btn} />
        </div>

        {/* ───────── ORDER FORM ───────── */}
        <section id="order" className="scroll-mt-4 px-3 pt-10 md:px-5">
          <h2 className="mx-auto mb-6 max-w-2xl text-center font-display text-[1.7rem] font-extrabold leading-snug text-slate-900 md:text-4xl">
            <H text={t.order_title} />
          </h2>
          <OrderForm products={products} delivery={delivery} freeBoxes={freeBoxes} text={formText} />
        </section>

        <footer className="mt-10 px-4 text-center text-sm text-slate-600">
          {phone && (
            <p>
              {t.footer_call}{" "}
              <a href={`tel:${phone}`} className="font-semibold text-brand">
                {phone}
              </a>
            </p>
          )}
          <p className="mt-1">{t.footer_copy}</p>
        </footer>
      </main>

      <FloatingActions phone={phone} whatsapp={whatsapp} />
    </div>
  );
}
