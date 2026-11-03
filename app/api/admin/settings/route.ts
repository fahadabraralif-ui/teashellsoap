import { NextResponse } from "next/server";
import { guard } from "@/lib/auth";
import { readDB, updateDB } from "@/lib/db";
import type { Settings } from "@/lib/types";
import { normalizePhone } from "@/lib/utils";

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const { settings } = await readDB();
  return NextResponse.json({ settings });
}

const SECTIONS = ["product", "delivery", "content", "reviews", "marketing", "courier", "security"] as const;
const NUMERIC: Record<string, string[]> = {
  product: ["price", "regularPrice", "stock", "maxQuantity"],
  delivery: ["inside", "outside", "freeDeliveryMinQty"],
  security: ["duplicateWindowMinutes"],
};

/** Body: a partial Settings object; each section given replaces the stored one (merged by key). */
export async function PUT(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = (await req.json().catch(() => null)) as Partial<Settings> | null;
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const settings = await updateDB((db) => {
    for (const key of SECTIONS) {
      const value = body[key];
      if (value === undefined) continue;
      if (key === "reviews") {
        if (!Array.isArray(value)) continue;
        db.settings.reviews = (value as Settings["reviews"]).map((r, i) => ({
          id: String(r.id || `r${Date.now()}${i}`),
          name: String(r.name || ""),
          text: String(r.text || ""),
          rating: Math.max(1, Math.min(5, Math.round(Number(r.rating) || 5))),
          avatar: String(r.avatar || ""),
        }));
        continue;
      }
      const section = { ...(db.settings[key] as object), ...(value as object) } as Record<string, unknown>;
      for (const n of NUMERIC[key] ?? []) section[n] = Math.max(0, Number(section[n]) || 0);
      if (key === "product") {
        section.packages = ((section.packages as Settings["product"]["packages"]) || [])
          .map((p, i) => ({
            id: String(p.id || `p${Date.now()}${i}`),
            label: String(p.label || "").trim(),
            quantity: Math.max(1, Math.floor(Number(p.quantity) || 1)),
            price: Math.max(0, Number(p.price) || 0),
          }))
          .filter((p) => p.label);
      }
      if (key === "security") {
        section.blockedPhones = ((section.blockedPhones as string[]) || [])
          .map((p) => normalizePhone(String(p)) || String(p).trim())
          .filter(Boolean);
        section.blockedIps = ((section.blockedIps as string[]) || []).map((p) => String(p).trim()).filter(Boolean);
      }
      (db.settings as unknown as Record<string, unknown>)[key] = section;
    }
    return db.settings;
  });
  return NextResponse.json({ settings });
}
