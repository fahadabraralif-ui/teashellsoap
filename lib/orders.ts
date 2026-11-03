import "server-only";
import crypto from "crypto";
import type { DB, Order, Settings } from "./types";

export function orderToken(id: number, secret: string) {
  return crypto.createHmac("sha256", secret).update(`order:${id}`).digest("hex").slice(0, 16);
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : req.headers.get("x-real-ip") || "").trim();
}

export function nextOrderId(db: DB): number {
  return db.nextOrderId++;
}

const sha256 = (v: string) => crypto.createHash("sha256").update(v.trim().toLowerCase()).digest("hex");

/** Server-side Purchase event (Meta Conversions API). Deduplicated with the browser pixel via event_id. */
export async function sendCapiPurchase(order: Order, settings: Settings, pageUrl: string) {
  const { pixelId, capiToken, testEventCode } = settings.marketing;
  if (!pixelId || !capiToken) return;
  const body: Record<string, unknown> = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: `order-${order.id}`,
        action_source: "website",
        event_source_url: pageUrl,
        user_data: {
          ph: [sha256(`88${order.phone}`)],
          fn: [sha256(order.name.split(" ")[0] || order.name)],
          client_ip_address: order.ip || undefined,
          client_user_agent: order.userAgent || undefined,
        },
        custom_data: { currency: "BDT", value: order.total, num_items: order.quantity },
      },
    ],
  };
  if (testEventCode) body.test_event_code = testEventCode;
  try {
    await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(pixelId)}/events?access_token=${encodeURIComponent(capiToken)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error("CAPI error", e);
  }
}

// ───────── Steadfast courier ─────────

const STEADFAST_BASE = "https://portal.packzy.com/api/v1";

function steadfastHeaders(settings: Settings) {
  return {
    "Api-Key": settings.courier.steadfastApiKey,
    "Secret-Key": settings.courier.steadfastSecretKey,
    "Content-Type": "application/json",
  };
}

export function steadfastConfigured(settings: Settings) {
  return Boolean(settings.courier.steadfastApiKey && settings.courier.steadfastSecretKey);
}

export async function steadfastCreate(order: Order, settings: Settings) {
  const res = await fetch(`${STEADFAST_BASE}/create_order`, {
    method: "POST",
    headers: steadfastHeaders(settings),
    body: JSON.stringify({
      invoice: String(order.id),
      recipient_name: order.name,
      recipient_phone: order.phone,
      recipient_address: order.address,
      cod_amount: order.total,
      note: order.adminNote || order.note || "",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status !== 200 || !data.consignment) {
    throw new Error(data.message || (data.errors ? JSON.stringify(data.errors) : `Steadfast error ${res.status}`));
  }
  return {
    consignmentId: String(data.consignment.consignment_id),
    trackingCode: String(data.consignment.tracking_code),
    status: String(data.consignment.status || "in_review"),
  };
}

export async function steadfastStatus(consignmentId: string, settings: Settings): Promise<string> {
  const res = await fetch(`${STEADFAST_BASE}/status_by_cid/${encodeURIComponent(consignmentId)}`, {
    headers: steadfastHeaders(settings),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.delivery_status) throw new Error(data.message || `Steadfast error ${res.status}`);
  return String(data.delivery_status);
}

export async function steadfastBalance(settings: Settings): Promise<number> {
  const res = await fetch(`${STEADFAST_BASE}/get_balance`, { headers: steadfastHeaders(settings) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.status !== 200) throw new Error(data.message || `Steadfast error ${res.status}`);
  return Number(data.current_balance);
}

/** Map a Steadfast delivery status onto our order status, if it implies one. */
export function statusFromCourier(s: string): Order["status"] | null {
  if (s === "delivered" || s === "partial_delivered") return "delivered";
  if (s === "cancelled") return "returned";
  return null;
}
