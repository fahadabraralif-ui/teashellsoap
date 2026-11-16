import { bn } from "@/data/site";
import OrderForm, { type FormProduct } from "../landing/OrderForm";
import FloatingActions from "../landing/FloatingActions";
import CarrotCountdown from "./CarrotCountdown";

type Item = Record<string, string>;

export type CarrotProps = {
  /** /carrotturmericoil er lekha, {price}-er moto token boshano */
  t: Record<string, string>;
  lists: { inside: Item[]; why: Item[]; tips: Item[]; faq: Item[] };
  products: FormProduct[];
  delivery: { id: string; label: string; charge: number }[];
  freeBoxes: number;
  price: number;
  oldPrice: number;
  phone: string;
  whatsapp: string;
};

const FORM_KEYS = [
  "form_head", "billing_title", "name_label", "name_ph", "address_label", "address_ph", "phone_label", "shipping_title",
  "free_hint", "free_done", "summary_title", "cod_label", "hadith", "privacy", "submit_btn", "success_title", "success_text",
];

const BTN =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#ffb020,#f26b0f)] px-6 py-3 font-bold text-[#4a1505] shadow-[0_8px_22px_#f26b0f40] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_#f26b0f55]";
const WRAP = "mx-auto w-[min(1120px,calc(100%-32px))]";
const CARD = "rounded-[18px] border border-[#f6dfc9] bg-white p-5 shadow-[0_10px_30px_rgba(120,50,10,.06)]";

/** [ ] er bhitorer lekha rongin */
function H({ text, cls }: { text: string; cls: string }) {
  return (
    <>
      {String(text || "")
        .split(/(\[[^\]]*\])/)
        .map((part, i) =>
          part.startsWith("[") && part.endsWith("]") ? (
            <span key={i} className={cls}>
              {part.slice(1, -1)}
            </span>
          ) : (
            part
          ),
        )}
    </>
  );
}

function Head({ title, sub }: { title?: string; sub?: string }) {
  if (!title) return null;
  return (
    <div className="mb-8 text-center">
      <h2 className="text-[clamp(25px,3.2vw,36px)] font-bold leading-[1.3] text-[#6b1608]">{title}</h2>
      {sub && <p className="mx-auto mt-1.5 max-w-[620px] text-[15px] text-[#8a6553]">{sub}</p>}
    </div>
  );
}

function IconCards({ items }: { items: Item[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {items.map((it, i) => (
        <div key={i} className={CARD}>
          {it.icon && <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff1d6] text-xl">{it.icon}</div>}
          <h3 className="mb-1 mt-3 text-lg font-bold text-[#3b1a0c]">{it.title}</h3>
          {it.text && <p className="text-sm text-[#8a6553]">{it.text}</p>}
        </div>
      ))}
    </div>
  );
}

export default function CarrotLanding(props: CarrotProps) {
  const { t, lists, products, delivery, freeBoxes, price, oldPrice, phone, whatsapp } = props;
  const formText = Object.fromEntries(FORM_KEYS.map((k) => [k, t[k]]));
  const taka = `৳${bn(price)}`;
  const chips = String(t.hero_chips || "").split("\n").map((s) => s.trim()).filter(Boolean);
  const sticky = Boolean(t.sticky_small && price > 0);

  return (
    <div className="theme-carrot min-h-screen bg-[#fffaf5] leading-[1.65] text-[#3b1a0c]">
      {t.topbar && (
        <div className="bg-[#7a1a0c] px-3 py-2 text-center text-[13px] font-semibold text-white">
          <H text={t.topbar} cls="text-[#ffd666]" />
        </div>
      )}

      <header className="sticky top-0 z-20 border-b border-[#f6dfc9] bg-[#fffaf3]/95 backdrop-blur">
        <div className={`${WRAP} flex items-center justify-between gap-3 py-3 md:py-4`}>
          <span className="text-lg font-extrabold uppercase tracking-wide text-[#a3360c] sm:text-xl md:text-[22px]">{t.brand}</span>
          {t.nav_text && <span className="hidden text-[15px] text-[#7a5a4a] md:block">{t.nav_text}</span>}
          {t.nav_btn && (
            <a href="#order" className={`${BTN} !px-5 !py-2 text-sm md:!px-7 md:!py-3 md:text-base`}>
              {t.nav_btn}
            </a>
          )}
        </div>
      </header>

      <main>
        {/* ───────── HERO ───────── */}
        <section className="bg-[radial-gradient(circle_at_85%_10%,#ffe9c7_0,transparent_45%),linear-gradient(160deg,#fffaf3,#fff3e4)]">
          <div className={`${WRAP} grid items-center gap-8 py-9 md:grid-cols-[1.05fr_1fr] md:gap-12 md:py-16`}>
            <div className="order-2 text-center md:order-1 md:text-left">
              {t.eyebrow && (
                <span className="inline-block rounded-full border border-[#f7d79a] bg-[#fff1cf] px-4 py-1.5 text-sm font-bold text-[#a3360c] md:px-5 md:text-base">
                  {t.eyebrow}
                </span>
              )}
              <h1 className="mb-5 mt-5 whitespace-pre-line text-[40px] font-extrabold leading-[1.18] text-[#6b1608] md:text-[clamp(44px,5.4vw,66px)]">
                <H text={t.hero_title} cls="text-[#f26b0f]" />
              </h1>
              {t.hero_sub && (
                <p className="mx-auto mb-6 max-w-[560px] text-base leading-[1.8] text-[#6e4a38] md:mx-0 md:text-lg">{t.hero_sub}</p>
              )}
              {price > 0 && (
                <div className="mb-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:justify-start">
                  <span className="text-[44px] font-extrabold leading-none text-[#6b1608] md:text-[54px]">{taka}</span>
                  {t.old_label && oldPrice > price && (
                    <span className="text-base text-[#9a7a6a] line-through">
                      {t.old_label}: ৳{bn(oldPrice)}
                    </span>
                  )}
                  {t.price_tag && (
                    <span className="rounded-lg bg-[#9e1d0d] px-4 py-1.5 text-base font-bold text-white shadow-[0_6px_16px_rgba(158,29,13,.25)] md:text-lg">
                      {t.price_tag}
                    </span>
                  )}
                </div>
              )}
              {t.hero_btn && (
                <a href="#order" className={`${BTN} !px-9 !py-4 text-lg`}>
                  {t.hero_btn}
                </a>
              )}
              {chips.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2.5 md:justify-start">
                  {chips.map((c, i) => (
                    <span key={i} className="rounded-full border border-[#f2dcc6] bg-white px-4 py-1.5 text-sm text-[#5e3d2e] md:text-[15px]">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {t.hero_img && (
              <div className="order-1 md:order-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.hero_img}
                  alt={String(t.hero_title || "").replace(/[[\]]/g, "")}
                  className="mx-auto w-full max-w-[520px] rounded-[24px] shadow-[0_24px_60px_rgba(160,60,10,.22)] md:max-w-none"
                />
              </div>
            )}
          </div>
        </section>

        {/* ───────── COUNTDOWN (protidin rat 12 tay notun kore 24 ghonta) ───────── */}
        {t.timer_text && <CarrotCountdown label={t.timer_text} />}

        {/* ───────── WHAT'S INSIDE ───────── */}
        {t.inside_title && lists.inside.length > 0 && (
          <section className="py-12 md:py-16">
            <div className={WRAP}>
              <Head title={t.inside_title} sub={t.inside_sub} />
              <IconCards items={lists.inside} />
            </div>
          </section>
        )}

        {/* ───────── WHY ───────── */}
        {t.why_title && lists.why.length > 0 && (
          <section className="bg-[#fff3e6] py-12 md:py-16">
            <div className={WRAP}>
              <Head title={t.why_title} sub={t.why_sub} />
              <IconCards items={lists.why} />
            </div>
          </section>
        )}

        {/* ───────── BANNER ───────── */}
        {t.banner_title && (
          <section className="py-12 md:py-16">
            <div className={WRAP}>
              <div className="flex flex-col items-center justify-between gap-5 rounded-[24px] bg-[linear-gradient(110deg,#7a1a0c,#b3361a)] px-6 py-8 text-center text-white shadow-[0_18px_40px_rgba(122,26,12,.3)] md:flex-row md:px-10 md:text-left">
                <div>
                  <h2 className="text-[24px] font-bold md:text-[28px]">{t.banner_title}</h2>
                  {t.banner_text && <p className="mt-1 text-sm text-[#ffd9c4]">{t.banner_text}</p>}
                </div>
                <div className="flex shrink-0 flex-col items-center">
                  {price > 0 && <b className="text-[36px] leading-none text-[#ffc94a]">{taka}</b>}
                  {t.banner_price_note && <small className="mb-3 mt-1 text-xs text-[#ffd9c4]">{t.banner_price_note}</small>}
                  {t.banner_btn && (
                    <a href="#order" className={`${BTN} px-9 py-3.5 text-xl`}>
                      {t.banner_btn}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ───────── TIPS ───────── */}
        {t.tips_title && lists.tips.length > 0 && (
          <section className="bg-[#fff8f0] py-12 md:py-16">
            <div className={WRAP}>
              <Head title={t.tips_title} sub={t.tips_sub} />
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {lists.tips.map((s, i) => (
                  <div key={i} className={CARD}>
                    <div className="text-xl font-extrabold text-[#f26b0f]">{"০" + bn(i + 1)}</div>
                    <h3 className="mb-1 mt-2 text-lg font-bold">{s.title}</h3>
                    {s.text && <p className="text-sm text-[#8a6553]">{s.text}</p>}
                  </div>
                ))}
              </div>
              {t.notice && <p className="mt-5 text-xs text-[#8a6553]">{t.notice}</p>}
            </div>
          </section>
        )}

        {/* ───────── ORDER ───────── */}
        <section id="order" className="scroll-mt-20 py-12 md:py-16">
          <div className={WRAP}>
            <Head title={String(t.order_title || "").replace(/[[\]]/g, "")} sub={t.order_sub} />
            <OrderForm products={products} delivery={delivery} freeBoxes={freeBoxes} text={formText} />
          </div>
        </section>

        {/* ───────── FAQ ───────── */}
        {lists.faq.length > 0 && (
          <section className="bg-[#fff3e6] py-12 md:py-16">
            <div className={WRAP}>
              <Head title={t.faq_title} />
              <div className="mx-auto max-w-[790px]">
                {lists.faq.map((f, i) => (
                  <details key={i} className="mb-3 rounded-[14px] border border-[#f6dfc9] bg-white px-5 py-4">
                    <summary className="cursor-pointer font-bold">{f.q}</summary>
                    <p className="mt-2.5 text-sm text-[#8a6553]">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className={`bg-[#4a1505] pt-8 text-white ${sticky ? "pb-[110px] sm:pb-8" : "pb-8"}`}>
        <div className={`${WRAP} text-center`}>
          <div className="text-lg font-extrabold tracking-wide text-[#ffc94a]">{t.brand}</div>
          {t.foot_about && <p className="mx-auto mt-2 max-w-[660px] text-[13px] text-[#f0d5c4]">{t.foot_about}</p>}
          {phone && t.footer_call && (
            <p className="mt-2 text-[13px] text-[#f0d5c4]">
              {t.footer_call}{" "}
              <a href={`tel:${phone}`} className="font-bold text-white underline">
                {phone}
              </a>
            </p>
          )}
          {t.footer_copy && <p className="mt-3 text-xs text-[#c49c86]">{t.footer_copy}</p>}
        </div>
      </footer>

      {/* Mobile er nicher order bar */}
      {sticky && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2.5 border-t border-[#f6dfc9] bg-white px-3.5 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-5px_24px_#5a200a22] sm:hidden">
          <div>
            <small className="block text-[10px] text-[#8a6553]">{t.sticky_small}</small>
            <b className="text-[19px] text-[#6b1608]">{taka}</b>
          </div>
          <a href="#order" className={`${BTN} flex-1 !py-2.5`}>
            {t.sticky_btn}
          </a>
        </div>
      )}

      {/* Sticky bar thakle WhatsApp button upore uthiye rakhi */}
      <div className={sticky ? "[&>a]:max-sm:bottom-24" : ""}>
        <FloatingActions whatsapp={whatsapp} />
      </div>
    </div>
  );
}
