import "server-only";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import type { AnyBulkWriteOperation } from "mongodb";
import type { DB, IncompleteOrder, Order, PublicSettings, Settings } from "./types";
import { hashPassword } from "./password";
import { mongo, mongoEnabled } from "./mongo";

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

function freshAdmin(): DB["admin"] {
  return {
    passwordHash: hashPassword(process.env.ADMIN_PASSWORD || "admin123"),
    sessionSecret: crypto.randomBytes(32).toString("hex"),
  };
}

export type Meta = Pick<DB, "nextOrderId" | "settings" | "admin">;
const metaOf = (db: DB): Meta => ({ nextOrderId: db.nextOrderId, settings: db.settings, admin: db.admin });

// ───────── file backend (local / VPS) ─────────

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
    db.admin = freshAdmin();
    await persist(db);
  }
  g.__tsDb = db;
  return db;
}

function fileUpdate<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  const run = (g.__tsQueue ?? Promise.resolve()).then(async () => {
    const db = await load();
    const result = await fn(db);
    await persist(db);
    return result;
  });
  g.__tsQueue = run.catch(() => undefined);
  return run;
}

// ───────── MongoDB backend (Vercel / serverless) ─────────
// Layout: meta {_id:"main", nextOrderId, settings, admin}, orders {_id: order.id}, incomplete {_id: id}.
// Writes are serialised across server instances with a lease in `locks`, then only changed docs are written.

type MetaDoc = { _id: string; nextOrderId?: number; settings?: unknown; admin?: DB["admin"] };

async function mongoMeta(): Promise<Meta> {
  const m = await mongo();
  const metaCol = m.collection<MetaDoc>("meta");
  let raw = await metaCol.findOne({ _id: "main" });
  if (!raw?.admin?.passwordHash) {
    try {
      await metaCol.updateOne(
        { _id: "main", "admin.passwordHash": { $exists: false } },
        { $set: { admin: freshAdmin(), nextOrderId: raw?.nextOrderId ?? 1001, settings: mergeDefaults(defaultSettings(), raw?.settings) } },
        { upsert: true },
      );
    } catch (e) {
      if ((e as { code?: number }).code !== 11000) throw e; // another instance initialised it first
    }
    raw = await metaCol.findOne({ _id: "main" });
  }
  return {
    nextOrderId: raw?.nextOrderId ?? 1001,
    settings: mergeDefaults(defaultSettings(), raw?.settings),
    admin: raw!.admin!,
  };
}

async function mongoAll(): Promise<DB> {
  const m = await mongo();
  const [meta, orders, incomplete] = await Promise.all([
    mongoMeta(),
    m.collection("orders").find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray(),
    m.collection("incomplete").find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray(),
  ]);
  return { ...meta, orders: orders as unknown as Order[], incomplete: incomplete as unknown as IncompleteOrder[] };
}

async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const locks = (await mongo()).collection<{ _id: string; until: number; owner: string }>("locks");
  const owner = crypto.randomUUID();
  for (let attempt = 0; ; attempt++) {
    const now = Date.now();
    try {
      await locks.findOneAndUpdate({ _id: "db", until: { $lt: now } }, { $set: { until: now + 15_000, owner } }, { upsert: true });
      break;
    } catch (e) {
      // Duplicate key means the lease is held by someone else.
      if ((e as { code?: number }).code !== 11000) throw e;
    }
    if (attempt > 150) throw new Error("Database busy, please retry");
    await new Promise((r) => setTimeout(r, 40 + Math.random() * 80));
  }
  try {
    return await fn();
  } finally {
    await locks.updateOne({ _id: "db", owner }, { $set: { until: 0 } });
  }
}

async function syncCollection<T extends object, K extends string | number>(
  name: string,
  items: T[],
  key: (item: T) => K,
  before: Map<K, string>,
) {
  type KeyedDoc = { _id: string | number };
  const ops: AnyBulkWriteOperation<KeyedDoc>[] = [];
  const seen = new Set<K>();
  for (const item of items) {
    const k = key(item);
    seen.add(k);
    if (before.get(k) !== JSON.stringify(item)) {
      ops.push({ replaceOne: { filter: { _id: k }, replacement: { ...item, _id: k }, upsert: true } });
    }
  }
  for (const k of before.keys()) if (!seen.has(k)) ops.push({ deleteOne: { filter: { _id: k } } });
  if (ops.length) await (await mongo()).collection<KeyedDoc>(name).bulkWrite(ops, { ordered: false });
}

function mongoUpdate<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  return withLock(async () => {
    const db = await mongoAll();
    const metaBefore = JSON.stringify(metaOf(db));
    const ordersBefore = new Map(db.orders.map((o) => [o.id, JSON.stringify(o)]));
    const incompleteBefore = new Map(db.incomplete.map((i) => [i.id, JSON.stringify(i)]));

    const result = await fn(db);

    const meta = metaOf(db);
    if (JSON.stringify(meta) !== metaBefore) {
      await (await mongo()).collection<MetaDoc>("meta").replaceOne({ _id: "main" }, meta, { upsert: true });
    }
    await syncCollection("orders", db.orders, (o) => o.id, ordersBefore);
    await syncCollection("incomplete", db.incomplete, (i) => i.id, incompleteBefore);
    return result;
  });
}

// ───────── public API ─────────

export function readDB(): Promise<DB> {
  if (mongoEnabled()) return mongoAll();
  return (g.__tsQueue ?? Promise.resolve()).then(load);
}

/** Settings + admin auth only; cheaper than readDB on MongoDB. */
export async function readMeta(): Promise<Meta> {
  if (mongoEnabled()) return mongoMeta();
  return metaOf(await readDB());
}

/** Serialised read-modify-write; the callback may mutate `db` directly. */
export function updateDB<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  return mongoEnabled() ? mongoUpdate(fn) : fileUpdate(fn);
}

export async function getPublicSettings(): Promise<PublicSettings> {
  const { settings } = await readMeta();
  return {
    product: settings.product,
    delivery: settings.delivery,
    content: settings.content,
    reviews: settings.reviews,
    marketing: { pixelId: settings.marketing.pixelId, gtmId: settings.marketing.gtmId },
  };
}
