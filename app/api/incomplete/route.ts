import { NextResponse } from "next/server";
import { updateDB } from "@/lib/db";
import { clientIp } from "@/lib/orders";
import { normalizePhone } from "@/lib/utils";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const phone = normalizePhone(String(body?.phone || ""));
  const sid = String(body?.sid || "").slice(0, 64);
  if (!phone || !sid) return NextResponse.json({ ok: false }, { status: 400 });

  await updateDB((db) => {
    // Skip if this phone placed an order in the last day.
    const ordered = db.orders.some((o) => o.phone === phone && Date.now() - Date.parse(o.createdAt) < 24 * 3600_000);
    if (ordered) return;
    const now = new Date().toISOString();
    const data = {
      name: String(body.name || "").trim().slice(0, 80),
      phone,
      address: String(body.address || "").trim().slice(0, 300),
      area: body.area === "outside" ? ("outside" as const) : ("inside" as const),
      quantity: Math.max(1, Math.min(99, Math.floor(Number(body.quantity) || 1))),
      ip: clientIp(req),
      updatedAt: now,
    };
    const existing = db.incomplete.find((i) => i.id === sid);
    if (existing) Object.assign(existing, data);
    else {
      db.incomplete.unshift({ id: sid, createdAt: now, ...data });
      db.incomplete = db.incomplete.slice(0, 2000);
    }
  });
  return NextResponse.json({ ok: true });
}
