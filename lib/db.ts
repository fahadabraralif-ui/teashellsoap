import "server-only";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import type { DB, PublicSettings, Settings } from "./types";
import { hashPassword } from "./password";

export const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const DB_FILE = path.join(DATA_DIR, "db.json");

export function defaultSettings(): Settings {
  return {
    product: {
      name: "TeaShell Ceramide Skin Brightening Soap",
      price: 690,
      regularPrice: 990,
      stock: 500,
      sku: "TS-SOAP-100",
      image: "/images/hero.png",
      maxQuantity: 10,
      packages: [
        { id: "p1", label: "১ পিছ", quantity: 1, price: 690 },
        { id: "p2", label: "২ পিছ", quantity: 2, price: 990 },
      ],
    },
    delivery: {
      inside: 60,
      outside: 120,
      insideLabel: "ঢাকার ভিতরে",
      outsideLabel: "ঢাকার বাইরে",
      freeDeliveryMinQty: 0,
    },
    content: {
      siteTitle: "TeaShell স্কিন ব্রাইটেনিং সোপ",
      heroTitleColored: "স্কিন ব্রাইটেনিং",
      heroTitleDark: "সোপ",
      heroSubtitle: "উজ্জ্বল, ফর্সা ও দাগমুক্ত ত্বকের জন্য একটি পারফেক্ট সমাধান!",
      heroImage: "/images/hero.png",
      beforeAfterImage: "/images/before-after.png",
      tagline: "সুন্দর ত্বক এখন আর স্বপ্ন নয়!",
      ctaText: "এখনই অর্ডার করুন",
      noticeBar: "🎉 সীমিত সময়ের অফার — সারা দেশে ক্যাশ অন ডেলিভারি!",
      phone: "01700000000",
      whatsapp: "01700000000",
      facebookPage: "",
      footerText: "© TeaShell. সর্বস্বত্ব সংরক্ষিত।",
      thankYouMessage:
        "আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমাদের প্রতিনিধি খুব শীঘ্রই আপনাকে কল করে অর্ডারটি কনফার্ম করবেন।",
      orderFormTitle: "অর্ডার করতে আপনার তথ্য দিয়ে নিচের ফরমটি পূরণ করুন",
      paymentNote:
        "রাসুল (সা.) বলেছেন : যদি কোনো ব্যক্তি পণ্য কেনার উদ্দেশ্য ছাড়াই ক্রেতা সেজে বিক্রেতাকে বিপদে ফেলার জন্য পরিস্থিতি তৈরি করে। এটি বিক্রেতা বা সাধারণ ক্রেতা উভয়ের জন্যই ক্ষতিকর। (সহীহ বুখারী : ২১৪০)",
    },
    reviews: [
      { id: "r1", name: "নুসরাত জাহান", text: "ব্যবহার করার পর সত্যিই ত্বক অনেক উজ্জ্বল হয়েছে!", rating: 5, avatar: "/images/review-1.png" },
      { id: "r2", name: "তানিয়া আক্তার", text: "দাগ কমছে, ত্বক এখন অনেক ফর্সা ও মসৃণ!", rating: 5, avatar: "/images/review-2.png" },
      { id: "r3", name: "সুমাইয়া ইসলাম", text: "দারুণ প্রোডাক্ট! অবশ্যই আবার নিবো!", rating: 5, avatar: "/images/review-3.png" },
    ],
    marketing: { pixelId: "", capiToken: "", testEventCode: "", gtmId: "" },
    courier: { steadfastApiKey: "", steadfastSecretKey: "", autoSendOnConfirm: false },
    security: { blockedPhones: [], blockedIps: [], duplicateWindowMinutes: 30 },
  };
}

/** Fill in keys added in newer versions so old db.json files keep working. */
function mergeDefaults<T>(defaults: T, value: unknown): T {
  if (Array.isArray(defaults)) return (Array.isArray(value) ? value : defaults) as T;
  if (defaults && typeof defaults === "object") {
    const out: Record<string, unknown> = { ...(defaults as Record<string, unknown>) };
    if (value && typeof value === "object") {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
        out[k] = k in out ? mergeDefaults(out[k], v) : v;
      }
    }
    return out as T;
  }
  return (value === undefined || value === null ? defaults : value) as T;
}

// Kept on globalThis so every route bundle in the process shares one copy and one write queue.
const g = globalThis as unknown as { __tsDb?: DB; __tsQueue?: Promise<unknown> };

async function persist(db: DB) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await fs.rename(tmp, DB_FILE);
}

async function load(): Promise<DB> {
  if (g.__tsDb) return g.__tsDb;
  let db: DB;
  try {
    const raw = JSON.parse(await fs.readFile(DB_FILE, "utf8"));
    db = {
      nextOrderId: raw.nextOrderId ?? 1001,
      orders: raw.orders ?? [],
      incomplete: raw.incomplete ?? [],
      settings: mergeDefaults(defaultSettings(), raw.settings),
      admin: raw.admin,
    };
  } catch {
    db = {
      nextOrderId: 1001,
      orders: [],
      incomplete: [],
      settings: defaultSettings(),
      admin: undefined as unknown as DB["admin"],
    };
  }
  if (!db.admin?.passwordHash) {
    db.admin = {
      passwordHash: hashPassword(process.env.ADMIN_PASSWORD || "admin123"),
      sessionSecret: crypto.randomBytes(32).toString("hex"),
    };
    await persist(db);
  }
  g.__tsDb = db;
  return db;
}

export function readDB(): Promise<DB> {
  return (g.__tsQueue ?? Promise.resolve()).then(load);
}

/** Serialised read-modify-write; the callback may mutate `db` directly. */
export function updateDB<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  const run = (g.__tsQueue ?? Promise.resolve()).then(async () => {
    const db = await load();
    const result = await fn(db);
    await persist(db);
    return result;
  });
  g.__tsQueue = run.catch(() => undefined);
  return run;
}

export async function getPublicSettings(): Promise<PublicSettings> {
  const { settings } = await readDB();
  return {
    product: settings.product,
    delivery: settings.delivery,
    content: settings.content,
    reviews: settings.reviews,
    marketing: { pixelId: settings.marketing.pixelId, gtmId: settings.marketing.gtmId },
  };
}
