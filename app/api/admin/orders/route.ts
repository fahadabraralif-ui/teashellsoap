import { NextResponse } from "next/server";
import { guard } from "@/lib/auth";
import { applyStatus, sendToSteadfast } from "@/lib/admin-actions";
import { readDB, updateDB } from "@/lib/db";
import { nextOrderId } from "@/lib/orders";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/types";
import { calcTotals, normalizePhone } from "@/lib/utils";

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const { orders } = await readDB();
  return NextResponse.json({ orders });
}

/** Manual order entry from the admin panel (phone orders, inbox orders, etc.). */
export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const body = await req.json().catch(() => ({}));
  const phone = normalizePhone(String(body.phone || ""));
  if (!phone) return NextResponse.json({ error: "সঠিক মোবাইল নম্বর দিন" }, { status: 400 });
  if (!String(body.name || "").trim()) return NextResponse.json({ error: "নাম দিন" }, { status: 400 });

  const order = await updateDB((db) => {
    const now = new Date().toISOString();
    const quantity = Math.max(1, Math.floor(Number(body.quantity) || 1));
    const area = body.area === "outside" ? "outside" : "inside";
    const unitPrice = Number(body.unitPrice) || db.settings.product.price;
    const discount = Math.max(0, Number(body.discount) || 0);
    const totals = calcTotals(quantity * unitPrice, quantity, area, db.settings.delivery, discount);
    const deliveryCharge = body.deliveryCharge !== undefined && body.deliveryCharge !== "" ? Number(body.deliveryCharge) : totals.deliveryCharge;
    const status: OrderStatus = ORDER_STATUSES.includes(body.status) ? body.status : "confirmed";
    const o: Order = {
      id: nextOrderId(db),
      createdAt: now,
      updatedAt: now,
      name: String(body.name).trim(),
      phone,
      address: String(body.address || "").trim(),
      area,
      quantity,
      unitPrice,
      deliveryCharge,
      discount,
      total: Math.max(0, quantity * unitPrice + deliveryCharge - discount),
      status,
      note: "",
      adminNote: String(body.adminNote || ""),
      ip: "",
      userAgent: "",
      source: body.source === "incomplete" ? "incomplete" : "manual",
      history: [{ at: now, status, note: "Admin created" }],
    };
    db.orders.unshift(o);
    if (!["cancelled", "returned"].includes(status)) db.settings.product.stock -= quantity;
    return o;
  });
  return NextResponse.json({ order });
}

/** Bulk status change: { ids: number[], status } */
export async function PATCH(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const { ids, status } = await req.json().catch(() => ({}));
  if (!Array.isArray(ids) || !ORDER_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const autoSend = await updateDB((db) => {
    for (const o of db.orders) if (ids.includes(o.id)) applyStatus(db, o, status);
    return status === "confirmed" && db.settings.courier.autoSendOnConfirm;
  });
  const courier = autoSend ? await sendToSteadfast(ids) : undefined;
  return NextResponse.json({ ok: true, courier });
}

/** Bulk delete: { ids: number[] } */
export async function DELETE(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const { ids } = await req.json().catch(() => ({}));
  if (!Array.isArray(ids)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  await updateDB((db) => {
    for (const o of db.orders) {
      if (ids.includes(o.id) && !["cancelled", "returned"].includes(o.status)) db.settings.product.stock += o.quantity;
    }
    db.orders = db.orders.filter((o) => !ids.includes(o.id));
  });
  return NextResponse.json({ ok: true });
}
