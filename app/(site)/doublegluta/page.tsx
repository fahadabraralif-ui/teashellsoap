import type { Metadata } from "next";
import GlutaLanding from "@/components/gluta/GlutaLanding";
import Tracking from "@/components/Tracking";
import { getSettings, getProducts, deliveryOptions } from "@/lib/store";
import { getContent, fillTokens, tokenVars, PAGES } from "@/lib/content";

export const dynamic = "force-dynamic";

// roseglowbd.xyz/doublegluta — lekha: admin > ল্যান্ডিং পেজ টেক্সট > Double Gluta, পণ্য: admin > পণ্য (পেজ = Double Gluta)
const PAGE = PAGES.doublegluta;

type Product = { id: number; name: string; price: number; old_price: number; image: string; boxes: number };
type Item = Record<string, string>;
type ListKey = "ingredients" | "why" | "steps";
type Content = { text: Record<string, string>; lists: Record<ListKey, Item[]> };

async function loadPage() {
  const [s, rows] = await Promise.all([getSettings(), getProducts({ page: PAGE.slug })]);
  const products = rows as unknown as Product[];
  const delivery = deliveryOptions(s);
  const main = products[0];
  const price = main?.price || 0;
  const oldPrice = main?.old_price || price;
  const freeBoxes = Number(s.free_delivery_boxes) || 0;
  const vars = tokenVars({ price, oldPrice, brand: s.brand, delivery, freeBoxes });
  const content = getContent(s, "doublegluta") as Content;
  const isImage = (k: string) => k === "image" || k.endsWith("_image");
  const t = Object.fromEntries(Object.entries(content.text).map(([k, v]) => [k, isImage(k) ? v : fillTokens(v, vars)]));
  const fill = (items: Item[]) =>
    items
      .map((item) => Object.fromEntries(Object.entries(item).map(([k, v]) => [k, isImage(k) ? v : fillTokens(v, vars)])))
      .filter((item) => Object.entries(item).some(([k, v]) => !isImage(k) && v));
  const lists = Object.fromEntries(Object.entries(content.lists).map(([k, v]) => [k, fill(v)])) as Content["lists"];
  const heroImage = t.hero_image || main?.image || "";
  return { s, products, delivery, freeBoxes, t, lists, heroImage };
}

export async function generateMetadata(): Promise<Metadata> {
  const { s, t, heroImage } = await loadPage();
  return {
    ...(s.logo ? { icons: { icon: s.logo, apple: s.logo } } : {}),
    title: t.meta_title,
    description: t.meta_desc,
    openGraph: { title: t.meta_title, description: t.meta_desc, ...(heroImage ? { images: [heroImage] } : {}) },
  };
}

export const viewport = { themeColor: "#173d22" };

export default async function DoubleGlutaPage() {
  const { s, products, delivery, freeBoxes, t, lists, heroImage } = await loadPage();
  return (
    <>
      <Tracking pixel={s.fb_pixel} gtm={s.gtm_id} />
      <GlutaLanding
        t={t}
        lists={lists}
        products={products.map((p) => ({ id: p.id, name: p.name, price: p.price, image: p.image, boxes: Number(p.boxes) || 1 }))}
        delivery={delivery}
        freeBoxes={freeBoxes}
        heroImage={heroImage}
        brand={s.brand}
        phone={s.phone}
        whatsapp={s.whatsapp}
      />
    </>
  );
}
