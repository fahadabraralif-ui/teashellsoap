import { NextResponse } from "next/server";
import { guard } from "@/lib/auth";
import { applyStatus, sendToSteadfast } from "@/lib/admin-actions";
import { updateDB } from "@/lib/db";
import { ORDER_STATUSES } from "@/lib/types";
import { normalizePhone } from "@/lib/utils";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await guard();
  if (denied) return denied;
  const id = Number((await params).id);
  const body = await req.json().catch(() => ({}));

  if (body.phone !== undefined && !normalizePhone(String(body.phone))) {
    return NextResponse.json({ error: "সঠিক মোবাইল নম্বর দিন" }, { status: 400 });
  }

  const result = await updateDB((db) => {
    const o = db.orders.find((x) => x.id === id);
    if (!o) return null;
    const releases = ["cancelled", "returned"].includes(o.status);

    if (body.quantity !== undefined) {
      const q = Math.max(1, Math.floor(Number(body.quantity) || 1));
      if (!releases) db.settings.product.stock -= q - o.quantity;
      o.quantity = q;
    }
    if (body.name !== undefined) o.name = String(body.name).trim();
    if (body.phone !== undefined) o.phone = normalizePhone(String(body.phone))!;
    if (body.address !== undefined) o.address = String(body.address).trim();
    if (body.area === "inside" || body.area === "outside") o.area = body.area;
    if (body.unitPrice !== undefined) o.unitPrice = Math.max(0, Number(body.unitPrice) || 0);
    if (body.deliveryCharge !== undefined) o.deliveryCharge = Math.max(0, Number(body.deliveryCharge) || 0);
    if (body.discount !== undefined) o.discount = Math.max(0, Number(body.discount) || 0);
    if (body.adminNote !== undefined) o.adminNote = String(body.adminNote);
    o.total = Math.max(0, o.quantity * o.unitPrice + o.deliveryCharge - o.discount);
    o.updatedAt = new Date().toISOString();

    let autoSend = false;
    if (ORDER_STATUSES.includes(body.status) && body.status !== o.status) {
      applyStatus(db, o, body.status);
      autoSend = body.status === "confirmed" && db.settings.courier.autoSendOnConfirm;
    }
    return { order: structuredClone(o), autoSend };
  });

  if (!result) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const courier = result.autoSend ? await sendToSteadfast([id]) : undefined;
  return NextResponse.json({ order: result.order, courier });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const denied = await guard();
  if (denied) return denied;
  const id = Number((await params).id);
  await updateDB((db) => {
    const o = db.orders.find((x) => x.id === id);
    if (o && !["cancelled", "returned"].includes(o.status)) db.settings.product.stock += o.quantity;
    db.orders = db.orders.filter((x) => x.id !== id);
  });
  return NextResponse.json({ ok: true });
}
