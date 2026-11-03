import { after, NextResponse } from "next/server";
import { updateDB } from "@/lib/db";
import { clientIp, nextOrderId, orderToken, sendCapiPurchase } from "@/lib/orders";
import type { Order } from "@/lib/types";
import { calcTotals, getPackages, normalizePhone, toBanglaDigits } from "@/lib/utils";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const name = String(body.name || "").trim().slice(0, 80);
  const phone = normalizePhone(String(body.phone || ""));
  const address = String(body.address || "").trim().slice(0, 300);
  const note = String(body.note || "").trim().slice(0, 300);
  const area = body.area === "outside" ? "outside" : "inside";
  const packageId = String(body.packageId || "");
  const sid = String(body.sid || "");

  if (name.length < 2) return NextResponse.json({ error: "অনুগ্রহ করে আপনার নাম লিখুন" }, { status: 400 });
  if (!phone) return NextResponse.json({ error: "সঠিক মোবাইল নম্বর লিখুন" }, { status: 400 });
  if (address.length < 8) return NextResponse.json({ error: "সম্পূর্ণ ঠিকানা লিখুন" }, { status: 400 });

  const ip = clientIp(req);
  const userAgent = req.headers.get("user-agent")?.slice(0, 300) || "";

  const result = await updateDB((db) => {
    const { settings } = db;
    const packages = getPackages(settings.product);
    const pkg = packages.find((p) => p.id === packageId) ?? packages[0];
    const packageQty = Math.max(1, Math.floor(Number(body.packageQty) || 1));
    const quantity = pkg.quantity * packageQty;
    if (quantity > settings.product.maxQuantity) {
      return { error: `একবারে সর্বোচ্চ ${toBanglaDigits(settings.product.maxQuantity)} পিছ অর্ডার করা যাবে`, status: 400 } as const;
    }
    if (settings.security.blockedPhones.includes(phone) || (ip && settings.security.blockedIps.includes(ip))) {
      return { error: "দুঃখিত, এই নম্বর থেকে অর্ডার গ্রহণ করা সম্ভব নয়। প্রয়োজনে আমাদের কল করুন।", status: 403 } as const;
    }
    const windowMs = settings.security.duplicateWindowMinutes * 60_000;
    if (windowMs > 0) {
      const recent = db.orders.find(
        (o) => o.phone === phone && o.status !== "cancelled" && Date.now() - Date.parse(o.createdAt) < windowMs,
      );
      if (recent) {
        return {
          error: `এই নম্বর থেকে ইতিমধ্যে একটি অর্ডার (#${recent.id}) গ্রহণ করা হয়েছে। আমরা শীঘ্রই কল করব।`,
          status: 409,
        } as const;
      }
    }
    if (settings.product.stock < quantity) {
      return { error: "দুঃখিত, পর্যাপ্ত স্টক নেই", status: 400 } as const;
    }

    const now = new Date().toISOString();
    const totals = calcTotals(pkg.price * packageQty, quantity, area, settings.delivery);
    const order: Order = {
      id: nextOrderId(db),
      createdAt: now,
      updatedAt: now,
      name,
      phone,
      address,
      area,
      quantity,
      unitPrice: pkg.price / pkg.quantity,
      deliveryCharge: totals.deliveryCharge,
      discount: 0,
      total: totals.total,
      status: "pending",
      note,
      adminNote: "",
      ip,
      userAgent,
      source: "landing",
      packageLabel: packageQty > 1 ? `${pkg.label} × ${packageQty}` : pkg.label,
      history: [{ at: now, status: "pending" }],
    };
    db.orders.unshift(order);
    settings.product.stock -= quantity;
    db.incomplete = db.incomplete.filter((i) => i.phone !== phone && (!sid || i.id !== sid));
    return { order, settings: structuredClone(settings), token: orderToken(order.id, db.admin.sessionSecret) } as const;
  });

  if ("error" in result) return NextResponse.json({ error: result.error }, { status: result.status });

  // Runs after the response is sent; on serverless the function stays alive until it finishes.
  after(() => sendCapiPurchase(result.order, result.settings, req.headers.get("referer") || ""));
  return NextResponse.json({ id: result.order.id, total: result.order.total, token: result.token });
}
