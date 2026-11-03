import "server-only";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import type { DB, IncompleteOrder, Order, PublicSettings, Settings } from "./types";
import { hashPassword } from "./password";
import { pgEnabled, pgReady, pool, type Queryable } from "./pg";

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

// ───────── Postgres backend (Vercel + Neon) ─────────
// Tables (see lib/pg.ts): ts_meta (id 'main' → nextOrderId/settings/admin), ts_orders, ts_incomplete.
// Each write runs in a transaction holding an advisory lock, then upserts only the rows that changed.

type MetaRow = { nextOrderId?: number; settings?: unknown; admin?: DB["admin"] };

async function pgMeta(q: Queryable = pool()): Promise<Meta> {
  await pgReady();
  let row = (await q.query<{ data: MetaRow }>("select data from ts_meta where id = 'main'")).rows[0]?.data;
  if (!row?.admin?.passwordHash) {
    const init: Meta = { nextOrderId: row?.nextOrderId ?? 1001, settings: mergeDefaults(defaultSettings(), row?.settings), admin: freshAdmin() };
    // If another instance initialised it first, keep theirs.
    await q.query(
      `insert into ts_meta (id, data) values ('main', $1::jsonb)
       on conflict (id) do update set data = excluded.data where ts_meta.data->'admin'->>'passwordHash' is null`,
      [JSON.stringify(init)],
    );
    row = (await q.query<{ data: MetaRow }>("select data from ts_meta where id = 'main'")).rows[0].data;
  }
  return {
    nextOrderId: row.nextOrderId ?? 1001,
    settings: mergeDefaults(defaultSettings(), row.settings),
    admin: row.admin!,
  };
}

async function pgAll(q: Queryable = pool()): Promise<DB> {
  const meta = await pgMeta(q);
  const orders = await q.query<{ data: Order }>("select data from ts_orders order by created_at desc, id desc");
  const incomplete = await q.query<{ data: IncompleteOrder }>("select data from ts_incomplete order by created_at desc");
  return { ...meta, orders: orders.rows.map((r) => r.data), incomplete: incomplete.rows.map((r) => r.data) };
}

async function syncTable<T extends { createdAt: string }, K extends string | number>(
  q: Queryable,
  table: "ts_orders" | "ts_incomplete",
  items: T[],
  key: (item: T) => K,
  before: Map<K, string>,
) {
  const seen = new Set<K>();
  for (const item of items) {
    const k = key(item);
    seen.add(k);
    if (before.get(k) === JSON.stringify(item)) continue;
    await q.query(
      `insert into ${table} (id, created_at, data) values ($1, $2, $3::jsonb)
       on conflict (id) do update set created_at = excluded.created_at, data = excluded.data`,
      [k, item.createdAt, JSON.stringify(item)],
    );
  }
  const removed = [...before.keys()].filter((k) => !seen.has(k));
  if (removed.length) await q.query(`delete from ${table} where id = any($1)`, [removed]);
}

async function pgUpdate<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  await pgReady();
  const client = await pool().connect();
  try {
    await client.query("begin");
    await client.query("select pg_advisory_xact_lock(73317)");
    const db = await pgAll(client);
    const metaBefore = JSON.stringify(metaOf(db));
    const ordersBefore = new Map(db.orders.map((o) => [o.id, JSON.stringify(o)]));
    const incompleteBefore = new Map(db.incomplete.map((i) => [i.id, JSON.stringify(i)]));

    const result = await fn(db);

    const meta = JSON.stringify(metaOf(db));
    if (meta !== metaBefore) await client.query("update ts_meta set data = $1::jsonb where id = 'main'", [meta]);
    await syncTable(client, "ts_orders", db.orders, (o) => o.id, ordersBefore);
    await syncTable(client, "ts_incomplete", db.incomplete, (i) => i.id, incompleteBefore);
    await client.query("commit");
    return result;
  } catch (e) {
    await client.query("rollback").catch(() => undefined);
    throw e;
  } finally {
    client.release();
  }
}

// ───────── public API ─────────

export function readDB(): Promise<DB> {
  if (pgEnabled()) return pgAll();
  return (g.__tsQueue ?? Promise.resolve()).then(load);
}

/** Settings + admin auth only; cheaper than readDB on Postgres. */
export async function readMeta(): Promise<Meta> {
  if (pgEnabled()) return pgMeta();
  return metaOf(await readDB());
}

/** Serialised read-modify-write; the callback may mutate `db` directly. */
export function updateDB<T>(fn: (db: DB) => T | Promise<T>): Promise<T> {
  return pgEnabled() ? pgUpdate(fn) : fileUpdate(fn);
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
