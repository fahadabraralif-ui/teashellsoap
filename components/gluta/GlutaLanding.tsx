import { bn } from "@/data/site";
import OrderForm, { type FormProduct } from "../landing/OrderForm";
import FloatingActions from "../landing/FloatingActions";
import PackageButton from "./PackageButton";
import Countdown from "./Countdown";

type Item = Record<string, string>;

export type GlutaProps = {
  /** /doublegluta er lekha, {price}-er moto token boshano */
  t: Record<string, string>;
  lists: { ingredients: Item[]; why: Item[]; steps: Item[] };
  products: FormProduct[];
  delivery: { id: string; label: string; charge: number }[];
  freeBoxes: number;
  heroImage: string;
  brand: string;
  phone: string;
  whatsapp: string;
};

const FORM_KEYS = [
  "form_head", "billing_title", "name_label", "name_ph", "address_label", "address_ph", "phone_label", "shipping_title",
  "free_hint", "free_done", "summary_title", "cod_label", "hadith", "privacy", "submit_btn", "success_title", "success_text",
];

const GREEN = "text-[#1e5631]";
const ORANGE_BTN =
  "inline-flex items-center justify-center bg-[#f26b1d] font-bold text-white shadow-[0_8px_20px_-8px_rgba(242,107,29,0.7)] transition hover:bg-[#e05a10] hover:-translate-y-0.5";

function Heading({ title, sub, dark = false }: { title: string; sub?: string; dark?: boolean }) {
  if (!title) return null;
  return (
    <div className="text-center">
      <h2 className={`font-display text-[1.75rem] font-extrabold leading-tight md:text-[2.4rem] ${dark ? "text-white" : GREEN}`}>{title}</h2>
      {sub && <p className={`mt-1 md:text-lg ${dark ? "text-green-50/90" : "text-slate-600"}`}>{sub}</p>}
    </div>
  );
}

function Check({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

const boxesText = (tpl: string, boxes: number) => String(tpl || "").replace(/\{boxes\}/g, bn(boxes));

export default function GlutaLanding(props: GlutaProps) {
  const { t, lists, products, delivery, freeBoxes, heroImage, brand, phone, whatsapp } = props;
  const formText = Object.fromEntries(FORM_KEYS.map((k) => [k, t[k]]));
  const brandName = t.header_brand || brand;

  return (
    <div className="theme-gluta min-h-screen bg-white text-slate-800">
      {t.topbar && <div className="bg-[#173d22] px-3 py-2 text-center text-xs font-semibold text-white md:text-sm">{t.topbar}</div>}

      {/* ───────── HEADER ───────── */}
      <header className="bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:py-4">
          <span className={`font-display text-2xl font-extrabold uppercase tracking-wide md:text-[1.7rem] ${GREEN}`}>
            {/* Prothom ordhek sobuj, baki komla — BON + ZELA */}
            {brandName.slice(0, Math.floor(brandName.length / 2))}
            <span className="text-[#f26b1d]">{brandName.slice(Math.floor(brandName.length / 2))}</span>
          </span>
          <a href="#order" className={`${ORANGE_BTN} rounded-full px-5 py-2 text-sm md:px-7 md:py-2.5 md:text-lg`}>
            {t.header_btn}
          </a>
        </div>
      </header>

      {/* ───────── HERO ───────── */}
      <section className="bg-gradient-to-br from-[#fbf6e6] to-[#f8f3df]">
        <div className={`mx-auto grid max-w-6xl items-center gap-8 px-5 pb-12 pt-8 md:gap-14 md:px-4 md:py-24 ${heroImage ? "md:grid-cols-[1.15fr_1fr]" : ""}`}>
          {/* Mobile e shob majhkhane, desktop e bame */}
          <div className={`text-center ${heroImage ? "md:text-left" : "mx-auto max-w-2xl"}`}>
            {t.hero_chip && (
              <span className="inline-block rounded-full bg-[#e3efdc] px-4 py-1.5 text-[11px] font-bold tracking-wide text-[#1e5631] min-[400px]:text-xs md:text-sm">
                {t.hero_chip}
              </span>
            )}
            <h1 className="mt-4 whitespace-pre-line font-display text-[2.5rem] font-extrabold leading-[1.1] text-[#e8541a] min-[400px]:text-[2.8rem] md:text-[3.9rem]">
              {t.hero_title}
            </h1>
            {t.hero_tagline && <p className={`mt-3 text-[1.3rem] font-bold leading-snug md:text-[1.75rem] ${GREEN}`}>{t.hero_tagline}</p>}
            {t.hero_sub && <p className="mx-auto mt-3 max-w-md leading-relaxed text-slate-600 md:mx-0 md:max-w-none md:text-lg">{t.hero_sub}</p>}

            <a
              href="#order"
              className={`${ORANGE_BTN} mt-7 w-full gap-2 rounded-2xl px-6 py-4 text-xl sm:w-auto md:rounded-xl md:px-8 md:text-lg`}
            >
              {t.cta_btn}
              <span aria-hidden>→</span>
            </a>
          </div>

          {heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt={t.hero_title?.replace(/\n/g, " ") || brand}
              className="mx-auto w-full max-w-md rounded-[1.75rem] bg-white object-cover shadow-[0_30px_60px_-25px_rgba(30,86,49,0.5)] ring-4 ring-white md:ml-auto md:mr-0 md:max-w-[36rem] md:ring-0"
            />
          )}
        </div>
      </section>

      {/* ───────── COUNTDOWN (protidin rat 12 tay notun kore 24 ghonta) ───────── */}
      {t.timer_text !== "" && <Countdown label={t.timer_text} />}

      {/* ───────── INGREDIENTS ───────── */}
      {lists.ingredients.length > 0 && (
        <section id="details" className="scroll-mt-4 px-4 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <Heading title={t.ing_title} sub={t.ing_sub} />
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {lists.ingredients.map((ing, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center rounded-2xl border border-[#efe3c4] bg-[#fdf8ea] px-3 py-5 text-center ${
                    i === lists.ingredients.length - 1 && lists.ingredients.length % 2 === 1 ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  {ing.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ing.image} alt={ing.name} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    ing.icon && <span className="text-3xl leading-none">{ing.icon}</span>
                  )}
                  <p className={`mt-3 font-bold ${GREEN}`}>{ing.name}</p>
                  {ing.note && <p className="mt-1 text-sm leading-snug text-slate-600">{ing.note}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── WHY ───────── */}
      {lists.why.length > 0 && (
        <section className="bg-[#f1f7ee] px-4 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <Heading title={t.why_title} sub={t.why_sub} />
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {lists.why.map((w, i) => (
                <div key={i} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e3efdc] text-[#1e5631]">
                    <Check className="h-4 w-4" />
                  </span>
                  <div>
                    <p className={`font-bold md:text-lg ${GREEN}`}>{w.title}</p>
                    {w.text && <p className="text-sm text-slate-600 md:text-[15px]">{w.text}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── HOW TO USE ───────── */}
      {lists.steps.length > 0 && (
        <section className="px-4 py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <Heading title={t.steps_title} sub={t.steps_sub} />
            <ol className="mt-8 grid gap-4 md:grid-cols-3">
              {lists.steps.map((s, i) => (
                <li key={i} className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                  <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-[#1e5631] font-bold text-white">{bn(i + 1)}</span>
                  <p className={`mt-3 text-lg font-bold ${GREEN}`}>{s.title}</p>
                  {s.text && <p className="mt-1 text-sm leading-relaxed text-slate-600 md:text-[15px]">{s.text}</p>}
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ───────── PACKAGES ───────── */}
      {products.length > 0 && (
        <section className="bg-gradient-to-br from-[#14532d] via-[#155e33] to-[#134e2a] px-4 py-12 md:py-14">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <h2 className="font-display text-[2rem] font-extrabold leading-tight text-white md:text-[3.2rem]">{t.pkg_title}</h2>
              {t.pkg_sub && <p className="mt-1 text-lg text-white/90 md:text-xl">{t.pkg_sub}</p>}
            </div>
            <div className={`mt-9 grid gap-6 ${products.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-lg"}`}>
              {products.map((p, i) => {
                // Shesh package ta highlight (beshi pcs = beshi shuvidha)
                const featured = products.length > 1 && i === products.length - 1;
                return (
                  <div
                    key={p.id}
                    className={`rounded-[1.4rem] bg-white px-6 py-8 text-center md:px-9 ${featured ? "ring-[3px] ring-[#f5b02e]" : ""}`}
                  >
                    {t.pkg_chip && (
                      <span className="inline-block rounded-full bg-[#fdefd5] px-4 py-1 text-base font-bold text-[#a8560c]">
                        {boxesText(t.pkg_chip, p.boxes)}
                      </span>
                    )}
                    <p className={`mt-4 text-2xl font-bold md:text-[1.75rem] ${GREEN}`}>{p.name}</p>
                    <p className="mt-2 font-display text-5xl font-extrabold text-[#f26b1d] md:text-[3.4rem]">৳{bn(p.price)}</p>
                    {t.pkg_note && <p className="mt-1 text-xl text-slate-500">{boxesText(t.pkg_note, p.boxes)}</p>}
                    <PackageButton id={p.id} text={t.pkg_btn} className={`${ORANGE_BTN} mt-6 w-full rounded-xl px-4 py-4 text-xl md:text-[1.4rem]`} />
                  </div>
                );
              })}
            </div>
            {t.pkg_footer && <p className="mt-7 text-center text-lg font-bold text-white md:text-xl">{t.pkg_footer}</p>}
          </div>
        </section>
      )}

      {/* ───────── ORDER FORM ───────── */}
      <section id="order" className="scroll-mt-4 bg-[#fdf6e3] px-3 py-12 md:px-5 md:py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className={`mx-auto mb-8 max-w-2xl text-center font-display text-[1.6rem] font-extrabold leading-snug md:text-[2.2rem] ${GREEN}`}>
            {String(t.order_title || "").replace(/[[\]]/g, "")}
          </h2>
          <OrderForm products={products} delivery={delivery} freeBoxes={freeBoxes} text={formText} />
        </div>
      </section>

      <footer className="bg-[#173d22] px-4 py-6 text-center text-sm text-green-50/80">
        {phone && (
          <p>
            {t.footer_call}{" "}
            <a href={`tel:${phone}`} className="font-bold text-white">
              {phone}
            </a>
          </p>
        )}
        <p className="mt-1">{t.footer_copy}</p>
      </footer>

      <FloatingActions whatsapp={whatsapp} />
    </div>
  );
}
