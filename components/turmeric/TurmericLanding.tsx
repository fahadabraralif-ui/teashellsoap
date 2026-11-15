import { bn } from "@/data/site";
import OrderForm, { type FormProduct } from "../landing/OrderForm";
import FloatingActions from "../landing/FloatingActions";

type Item = Record<string, string>;

export type TurmericProps = {
  /** /turmericoilcombo er lekha, {price}-er moto token boshano */
  t: Record<string, string>;
  lists: { perks: Item[]; items: Item[]; steps: Item[]; faq: Item[] };
  products: FormProduct[];
  delivery: { id: string; label: string; charge: number }[];
  freeBoxes: number;
  price: number;
  phone: string;
  whatsapp: string;
  /** DM Sans font er CSS variable class (page.tsx theke) */
  fontClass: string;
};

const FORM_KEYS = [
  "form_head", "billing_title", "name_label", "name_ph", "address_label", "address_ph", "phone_label", "shipping_title",
  "free_hint", "free_done", "summary_title", "cod_label", "hadith", "privacy", "submit_btn", "success_title", "success_text",
];

const DM = "font-[family-name:var(--font-dm)]";
const BTN =
  "inline-flex items-center justify-center gap-2 rounded-[13px] bg-[#742348] px-[26px] py-[15px] font-bold text-white shadow-[0_8px_24px_#882a5630] transition hover:-translate-y-0.5 hover:bg-[#9b315e]";
const WRAP = "mx-auto w-[min(1120px,calc(100%-28px))] sm:w-[min(1120px,calc(100%-36px))]";

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

function Head({ tag, title, sub }: { tag?: string; title?: string; sub?: string }) {
  if (!title) return null;
  return (
    <div className="mb-8 text-center">
      {tag && <div className="text-[13px] font-extrabold tracking-[0.5px] text-[#ad426d]">{tag}</div>}
      <h2 className="my-[7px] text-[clamp(27px,3vw,39px)] font-bold leading-[1.3]">{title}</h2>
      {sub && <p className="mx-auto max-w-[600px] text-[#756571]">{sub}</p>}
    </div>
  );
}

const PHOTO_BG = ["bg-[#fff1ec]", "bg-[#fef5fa]", "bg-[#fff5df]"];

export default function TurmericLanding(props: TurmericProps) {
  const { t, lists, products, delivery, freeBoxes, price, phone, whatsapp, fontClass } = props;
  const formText = Object.fromEntries(FORM_KEYS.map((k) => [k, t[k]]));
  const taka = `৳${bn(price)}`;
  const brand = (
    <span className={`${DM} text-[21px] font-extrabold tracking-[-1.2px] sm:text-2xl`}>
      {t.brand_a}
      <em className="not-italic text-[#ad426d]">{t.brand_b}</em>
    </span>
  );

  return (
    <div className={`theme-rose ${fontClass} min-h-screen bg-[#fffdfc] leading-[1.65] text-[#352432]`}>
      {t.topbar && (
        <div className="bg-[#351d30] px-3 py-2 text-center text-[13px] text-white">
          <H text={t.topbar} cls="font-bold text-[#ffdb9b]" />
        </div>
      )}

      <header className={`${WRAP} flex items-center justify-between gap-3 py-3.5 sm:py-[19px]`}>
        {brand}
        {t.nav_btn && (
          <a href="#order" className="text-xs font-bold text-[#ad426d] sm:text-sm">
            {t.nav_btn}
          </a>
        )}
      </header>

      <main>
        {/* ───────── HERO ───────── */}
        <section className="overflow-hidden bg-[radial-gradient(circle_at_84%_10%,#ffe3bd_0,transparent_38%),linear-gradient(130deg,#fff5f1,#ffe8ee)]">
          <div className={`${WRAP} grid items-center gap-2.5 pb-10 pt-[35px] md:grid-cols-2 md:gap-8 md:pb-[60px] md:pt-[49px]`}>
            <div className="text-center md:text-left">
              {t.eyebrow && (
                <span className="inline-flex items-center gap-[7px] rounded-[40px] border border-[#f2c7d5] bg-white px-3.5 py-[7px] text-[13px] font-bold text-[#973e5b]">
                  {t.eyebrow}
                </span>
              )}
              <h1 className="mb-[15px] mt-[19px] whitespace-pre-line text-[38px] font-bold leading-[1.18] tracking-[-1px] md:text-[clamp(36px,4.9vw,61px)]">
                <H text={t.hero_title} cls="text-[#aa4269]" />
              </h1>
              {t.hero_sub && (
                <p className="mx-auto mb-[23px] max-w-[515px] whitespace-pre-line text-[15px] text-[#675461] md:mx-0 md:text-[17px]">{t.hero_sub}</p>
              )}
              {price > 0 && (
                <div className="mb-[22px] flex flex-wrap items-baseline justify-center gap-[13px] md:justify-start">
                  <span className="text-[42px] font-extrabold leading-none text-[#742348] md:text-[46px]">
                    {taka} <small className="text-[19px]">{t.price_small}</small>
                  </span>
                  {t.price_note && <span className="text-sm text-[#745d63]">{t.price_note}</span>}
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-[11px] md:justify-start">
                <a href="#order" className={BTN}>
                  {t.hero_btn}
                </a>
                {t.hero_btn2 && (
                  <a
                    href="#products"
                    className="inline-flex items-center justify-center rounded-[13px] border border-[#e7b8c9] bg-white px-[26px] py-[15px] font-bold text-[#742348] transition hover:-translate-y-0.5"
                  >
                    {t.hero_btn2}
                  </a>
                )}
              </div>
              {t.hero_tiny && <p className="mt-4 text-xs text-[#7f6975]">{t.hero_tiny}</p>}
            </div>

            {/* 3 ta chobi gol halo-r upor */}
            <div className="relative mx-auto flex min-h-[315px] w-full max-w-[500px] items-end justify-center pb-5 sm:min-h-[350px] md:min-h-[450px] md:max-w-none">
              <div className="absolute left-1/2 top-[5%] h-[290px] w-[290px] -translate-x-1/2 rounded-full bg-[linear-gradient(140deg,#fff,#ffcedf)] shadow-[0_25px_75px_#dc81a133] sm:h-[330px] sm:w-[330px] md:h-[420px] md:w-[420px]" />
              {t.hero_img1 && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.hero_img1} alt="" className="absolute bottom-[5%] left-[3%] h-[73%] w-[38%] rounded-2xl bg-white object-cover shadow-[0_17px_36px_#7f486032]" />
              )}
              {t.hero_img2 && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.hero_img2} alt="" className="absolute bottom-[6%] right-[2%] h-[76%] w-[39%] rounded-2xl bg-white object-cover shadow-[0_17px_36px_#7f486032]" />
              )}
              {t.hero_img3 && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.hero_img3} alt="" className="absolute bottom-0 left-[34%] z-[2] h-[35%] w-[29%] rounded-2xl bg-white object-contain p-1.5 shadow-[0_17px_36px_#7f486032]" />
              )}
              {(t.badge_top || t.badge_bottom) && (
                <div className="absolute right-[4%] top-[4%] z-[3] flex h-[72px] w-[72px] rotate-[13deg] flex-col items-center justify-center rounded-full bg-[#742348] font-extrabold text-white shadow-[0_10px_28px_#a52d5845] md:right-0 md:top-[8%] md:h-[92px] md:w-[92px]">
                  <span className={`${DM} text-xs font-semibold`}>{t.badge_top}</span>
                  <b className="text-[21px] leading-tight md:text-[25px]">{t.badge_bottom}</b>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ───────── PERKS ───────── */}
        {lists.perks.length > 0 && (
          <div className={`${WRAP} relative z-[5] -mt-3 grid gap-2 sm:grid-cols-2 sm:gap-3 md:-mt-[25px] md:grid-cols-3`}>
            {lists.perks.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-[13px] rounded-[15px] border border-[#f0dfe5] bg-white px-3.5 py-2.5 text-[13px] font-bold shadow-[0_16px_50px_rgba(76,35,54,.08)] sm:p-[17px] sm:text-sm"
              >
                <i className="text-[25px] not-italic">{p.icon}</i>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* ───────── PRODUCTS ───────── */}
        {lists.items.length > 0 && (
          <section id="products" className="scroll-mt-4 py-[52px] md:py-[74px]">
            <div className={WRAP}>
              <Head tag={t.prod_tag} title={t.prod_title} sub={t.prod_sub} />
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                {lists.items.map((it, i) => (
                  <article key={i} className="flex flex-col overflow-hidden rounded-[21px] border border-[#f0dfe5] bg-white shadow-[0_8px_32px_#48213609]">
                    <div className={`h-[340px] overflow-hidden sm:h-[284px] ${PHOTO_BG[i % 3]}`}>
                      {it.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={it.image} alt={it.name?.replace(/\n/g, " ")} loading="lazy" className="h-full w-full object-contain" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-[22px]">
                      {it.chip && (
                        <span className="self-start rounded-[30px] bg-[#fff0f5] px-2.5 py-[3px] text-xs font-bold text-[#ad426d]">{it.chip}</span>
                      )}
                      <h3 className="mb-2 mt-[13px] whitespace-pre-line text-xl font-bold leading-[1.35]">{it.name}</h3>
                      {it.desc && <p className="mb-3 text-sm text-[#756571]">{it.desc}</p>}
                      {it.facts && (
                        <div className="mt-auto whitespace-pre-line rounded-[10px] bg-[#fff8fa] px-3 py-2.5 text-[13px]">{it.facts}</div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ───────── ROUTINE ───────── */}
        {lists.steps.length > 0 && (
          <section className="bg-[#fff9f5] py-[52px] md:py-[74px]">
            <div className={WRAP}>
              <Head tag={t.routine_tag} title={t.routine_title} sub={t.routine_sub} />
              <div className="grid gap-[17px] sm:grid-cols-2 md:grid-cols-3">
                {lists.steps.map((s, i) => (
                  <div key={i} className="rounded-[18px] border border-[#f0dfe5] bg-white p-[23px]">
                    <div className="grid h-[39px] w-[39px] place-items-center rounded-full bg-[#ffebf1] font-extrabold text-[#742348]">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mb-1.5 mt-[13px] text-xl font-bold">{s.title}</h3>
                    {s.text && <p className="text-sm text-[#756571]">{s.text}</p>}
                  </div>
                ))}
              </div>
              {t.notice && (
                <div className="mt-5 rounded-[5px] border-l-[3px] border-[#dfaa57] bg-[#fff8ec] px-3.5 py-2.5 text-[13px] text-[#665446]">{t.notice}</div>
              )}
            </div>
          </section>
        )}

        {/* ───────── BANNER ───────── */}
        {t.banner_title && (
          <section className="py-[52px] md:py-[74px]">
            <div className={WRAP}>
              <div className="flex flex-col items-center justify-between gap-[18px] rounded-[25px] bg-[linear-gradient(110deg,#3e2034,#7c2d53)] px-5 py-[25px] text-center text-white md:flex-row md:px-[39px] md:py-[33px] md:text-left">
                <div>
                  <h2 className="mb-[7px] text-[25px] font-bold md:text-[31px]">{t.banner_title}</h2>
                  {t.banner_text && <p className="text-[#ffe0ec]">{t.banner_text}</p>}
                </div>
                {t.banner_btn && (
                  <a href="#order" className={`${BTN} whitespace-nowrap !bg-white !text-[#742348]`}>
                    {t.banner_btn}
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ───────── ORDER ───────── */}
        <section id="order" className="scroll-mt-4 bg-[linear-gradient(180deg,#fff1f5,#fffbfa)] py-[52px] md:py-[74px]">
          <div className={WRAP}>
            <Head tag={t.order_tag} title={String(t.order_title || "").replace(/[[\]]/g, "")} sub={t.order_sub} />
            <OrderForm products={products} delivery={delivery} freeBoxes={freeBoxes} text={formText} />
          </div>
        </section>

        {/* ───────── FAQ ───────── */}
        {lists.faq.length > 0 && (
          <section className="py-[52px] md:py-[74px]">
            <div className={WRAP}>
              <Head tag={t.faq_tag} title={t.faq_title} />
              <div className="mx-auto max-w-[790px]">
                {lists.faq.map((f, i) => (
                  <details key={i} className="mb-[11px] rounded-[13px] border border-[#f0dfe5] bg-white px-[19px] py-[15px]">
                    <summary className="cursor-pointer font-bold">{f.q}</summary>
                    <p className="mt-2.5 text-sm text-[#756571]">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className={`bg-[#311d2b] pt-[34px] text-white ${t.sticky_small ? "pb-[110px] sm:pb-[90px]" : "pb-[34px]"}`}>
        <div className={`${WRAP} gap-[25px] sm:flex sm:items-start sm:justify-between`}>
          <div>
            {brand}
            {t.foot_about && <p className="max-w-[660px] text-[13px] text-[#e4cfd9]">{t.foot_about}</p>}
            {phone && t.footer_call && (
              <p className="mt-2 text-[13px] text-[#e4cfd9]">
                {t.footer_call}{" "}
                <a href={`tel:${phone}`} className="font-bold text-white underline">
                  {phone}
                </a>
              </p>
            )}
            {t.footer_copy && <p className="mt-3.5 text-xs text-[#9f8993]">{t.footer_copy}</p>}
          </div>
          {t.foot_note && <p className="mt-4 max-w-[660px] text-[13px] text-[#e4cfd9] sm:mt-0">{t.foot_note}</p>}
        </div>
      </footer>

      {/* Mobile er nicher order bar */}
      {t.sticky_small && price > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2.5 border-t border-[#f1d8e3] bg-white px-3.5 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-5px_24px_#3d1b2b22] sm:hidden">
          <div>
            <small className="block text-[10px] text-[#775e69]">{t.sticky_small}</small>
            <b className="text-[19px] text-[#742348]">{taka}</b>
          </div>
          <a href="#order" className={`${BTN} flex-1 !px-[13px] !py-[11px]`}>
            {t.sticky_btn}
          </a>
        </div>
      )}

      {/* Sticky bar thakle WhatsApp button upore uthiye rakhi */}
      <div className={t.sticky_small && price > 0 ? "[&>a]:max-sm:bottom-24" : ""}>
        <FloatingActions whatsapp={whatsapp} />
      </div>
    </div>
  );
}
