import type { Metadata } from "next";
import Landing from "@/components/landing/Landing";
import Tracking from "@/components/Tracking";
import VoicePlayer from "@/components/VoicePlayer";
import { site } from "@/data/site";
import { getSettings, getProducts, deliveryOptions } from "@/lib/store";
import { getContent, fillTokens, tokenVars } from "@/lib/content";

export const dynamic = "force-dynamic";

// Shapes of the rows lib/store.js and lib/content.js return (they are plain JS).
type Product = { id: number; name: string; price: number; old_price: number; image: string; boxes: number };
type Item = Record<string, string>;
type Content = { text: Record<string, string>; lists: Record<"features" | "why" | "ingredients" | "reviews", Item[]> };

// Admin > ল্যান্ডিং পেজ টেক্সট er lekha + {price} er moto token boshano
async function loadPage() {
  const [s, rows] = await Promise.all([getSettings(), getProducts({ page: "" })]);
  const products = rows as unknown as Product[];
  const delivery = deliveryOptions(s);
  const main = products[0] || { price: site.price, old_price: site.oldPrice, image: site.gallery[0] };
  const oldPrice = main.old_price || main.price;
  const freeBoxes = Number(s.free_delivery_boxes) || 0;
  const vars = tokenVars({ price: main.price, oldPrice, brand: s.brand, delivery, freeBoxes });
  const content = getContent(s) as Content;
  const t = Object.fromEntries(Object.entries(content.text).map(([k, v]) => [k, fillTokens(v, vars)]));
  const fillItems = (items: Item[]) =>
    items
      .map((item) => Object.fromEntries(Object.entries(item).map(([k, v]) => [k, k === "image" ? v : fillTokens(v, vars)])))
      .filter((item) => Object.entries(item).some(([k, v]) => k !== "image" && v));
  const lists = {
    features: fillItems(content.lists.features),
    why: fillItems(content.lists.why),
    ingredients: fillItems(content.lists.ingredients),
    reviews: fillItems(content.lists.reviews),
  };
  // Banner er 1m chobi = hero, 2y = age/pore
  const banners = String(s.gallery).split("\n").map((x) => x.trim()).filter(Boolean);
  return { s, products, delivery, main, oldPrice, freeBoxes, t, lists, banners };
}

export async function generateMetadata(): Promise<Metadata> {
  const { s, t, banners, main } = await loadPage();
  return {
    ...(s.logo ? { icons: { icon: s.logo, apple: s.logo } } : {}),
    title: t.meta_title,
    description: t.meta_desc,
    openGraph: { title: t.meta_title, description: t.meta_desc, images: [banners[0] || main.image] },
  };
}

export default async function Home() {
  const { s, products, delivery, main, oldPrice, freeBoxes, t, lists, banners } = await loadPage();
  return (
    <>
      <Tracking pixel={s.fb_pixel} gtm={s.gtm_id} />
      <VoicePlayer src={s.voice} />
      <Landing
        t={t}
        lists={lists}
        products={products.map((p) => ({ id: p.id, name: p.name, price: p.price, image: p.image, boxes: Number(p.boxes) || 1 }))}
        delivery={delivery}
        freeBoxes={freeBoxes}
        price={main.price}
        oldPrice={oldPrice}
        heroImage={banners[0] || main.image || "/images/hero.png"}
        beforeAfterImage={banners[1] || ""}
        logo={s.logo || "/images/logo.png"}
        brand={s.brand}
        phone={s.phone}
        whatsapp={s.whatsapp}
      />
    </>
  );
}
