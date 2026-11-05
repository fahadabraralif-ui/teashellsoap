import { bn } from "@/data/site";
import OrderForm, { type FormProduct } from "../landing/OrderForm";
import FloatingActions from "../landing/FloatingActions";
import PackageButton from "./PackageButton";

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
  "inline-flex items-center justify-center rounded-xl bg-[#f26b1d] font-bold text-white shadow-[0_8px_20px_-8px_rgba(242,107,29,0.7)] transition hover:bg-[#e05a10] hover:-translate-y-0.5";

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
  const notes = [t.hero_note1, t.hero_note2, t.hero_note3].filter(Boolean);
  const brandName = t.header_brand || brand;

  return (
    <div className="theme-gluta min-h-screen bg-white text-slate-800">
      {t.topbar && <div className="bg-[#173d22] px-3 py-2 text-center text-xs font-semibold text-white md:text-sm">{t.topbar}</div>}

      {/* ───────── HEADER ───────── */}
      <header className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <span className={`font-display text-2xl font-extrabold uppercase tracking-wide ${GREEN}`}>
            {/* Shesh 3 okkhor komla — design er moto */}
            {brandName.length > 4 ? (
              <>
                {brandName.slice(0, -3)}
                <span className="text-[#f26b1d]">{brandName.slice(-3)}</span>
              </>
            ) : (
              brandName
            )}
          </span>
          <a href="#order" className={`${ORANGE_BTN} rounded-full px-5 py-2 text-sm md:text-base`}>
            {t.header_btn}
          </a>
        </div>
      </header>

      {/* ───────── HERO ───────── */}
      <section className="bg-[#fdf6e3]">
        <div className={`mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:py-16 ${heroImage ? "md:grid-cols-2" : ""}`}>
          <div className={heroImage ? "" : "mx-auto max-w-2xl text-center"}>
            {t.hero_chip && (
              <span className="inline-block rounded-full bg-[#e3efdc] px-3 py-1 text-[11px] font-bold tracking-wide text-[#1e5631] md:text-xs">
                {t.hero_chip}
              </span>
            )}
            <h1 className="mt-4 whitespace-pre-line font-display text-[2.6rem] font-extrabold leading-[1.1] text-[#f26b1d] md:text-[3.4rem]">
              {t.hero_title}
            </h1>
            {t.hero_tagline && <p className={`mt-3 text-xl font-bold md:text-2xl ${GREEN}`}>{t.hero_tagline}</p>}
            {t.hero_sub && <p className="mt-3 leading-relaxed text-slate-600 md:text-lg">{t.hero_sub}</p>}

            <div className={`mt-6 flex flex-wrap gap-3 ${heroImage ? "" : "justify-center"}`}>
              <a href="#order" className={`${ORANGE_BTN} px-6 py-3 text-lg`}>
                {t.cta_btn}
              </a>
              {t.more_btn && (
                <a
                  href="#details"
                  className="inline-flex items-center justify-center rounded-xl border-2 border-[#1e5631]/20 bg-white px-6 py-3 text-lg font-bold text-[#1e5631] transition hover:border-[#1e5631]/50"
                >
                  {t.more_btn}
                </a>
              )}
            </div>

            {notes.length > 0 && (
              <ul className={`mt-5 flex flex-wrap gap-2 ${heroImage ? "" : "justify-center"}`}>
                {notes.map((n, i) => (
                  <li key={i} className="flex items-center gap-1 rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-black/5">
                    <Check className="h-3.5 w-3.5 text-[#1e5631]" />
                    {n}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {heroImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={heroImage}
              alt={t.hero_title?.replace(/\n/g, " ") || brand}
              className="w-full rounded-3xl bg-white object-cover shadow-[0_25px_50px_-20px_rgba(30,86,49,0.45)]"
            />
          )}
        </div>
      </section>

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
        <section className="bg-[#1d5c2e] px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <Heading title={t.pkg_title} sub={t.pkg_sub} dark />
            <div className={`mt-8 grid gap-5 ${products.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-sm"}`}>
              {products.map((p, i) => {
                // Shesh package ta highlight (beshi pcs = beshi shuvidha)
                const featured = products.length > 1 && i === products.length - 1;
                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl bg-white p-5 text-center shadow-xl ${featured ? "ring-4 ring-[#f5b041]" : ""}`}
                  >
                    {t.pkg_chip && (
                      <span className="inline-block rounded-full bg-[#fdebd3] px-3 py-0.5 text-xs font-bold text-[#b45309]">
                        {boxesText(t.pkg_chip, p.boxes)}
                      </span>
                    )}
                    <p className={`mt-3 text-lg font-bold ${GREEN}`}>{p.name}</p>
                    <p className="mt-1 font-display text-4xl font-extrabold text-[#f26b1d]">৳{bn(p.price)}</p>
                    {t.pkg_note && <p className="mt-1 text-sm text-slate-500">{boxesText(t.pkg_note, p.boxes)}</p>}
                    <PackageButton id={p.id} text={t.pkg_btn} className={`${ORANGE_BTN} mt-5 w-full px-4 py-3`} />
                  </div>
                );
              })}
            </div>
            {t.pkg_footer && <p className="mt-6 text-center font-semibold text-white">{t.pkg_footer}</p>}
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
