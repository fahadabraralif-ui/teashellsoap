import "server-only";
import { readDB, updateDB } from "./db";
import { statusFromCourier, steadfastConfigured, steadfastCreate, steadfastStatus } from "./orders";
import type { DB, Order, OrderStatus } from "./types";

const RELEASES_STOCK: OrderStatus[] = ["cancelled", "returned"];

/** Change an order's status, keeping stock and history in sync. */
export function applyStatus(db: DB, order: Order, status: OrderStatus, note?: string) {
  if (order.status === status) return;
  const wasReleased = RELEASES_STOCK.includes(order.status);
  const isReleased = RELEASES_STOCK.includes(status);
  if (!wasReleased && isReleased) db.settings.product.stock += order.quantity;
  if (wasReleased && !isReleased) db.settings.product.stock -= order.quantity;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  order.history.push({ at: order.updatedAt, status, note });
}

export type CourierResult = { id: number; ok: boolean; message: string };

export async function sendToSteadfast(ids: number[]): Promise<CourierResult[]> {
  const { settings, orders } = await readDB();
  if (!steadfastConfigured(settings)) {
    return ids.map((id) => ({ id, ok: false, message: "Steadfast API key সেট করা নেই (Courier সেটিংস দেখুন)" }));
  }
  const results: CourierResult[] = [];
  for (const id of ids) {
    const order = orders.find((o) => o.id === id);
    if (!order) {
      results.push({ id, ok: false, message: "Order not found" });
      continue;
    }
    if (order.courier) {
      results.push({ id, ok: false, message: `আগেই পাঠানো হয়েছে (${order.courier.trackingCode})` });
      continue;
    }
    try {
      const c = await steadfastCreate(order, settings);
      await updateDB((db) => {
        const o = db.orders.find((x) => x.id === id);
        if (!o) return;
        o.courier = { provider: "steadfast", ...c, sentAt: new Date().toISOString() };
        applyStatus(db, o, "shipped", `Steadfast: ${c.trackingCode}`);
      });
      results.push({ id, ok: true, message: c.trackingCode });
    } catch (e) {
      results.push({ id, ok: false, message: (e as Error).message });
    }
  }
  return results;
}

export async function refreshSteadfast(ids: number[]): Promise<CourierResult[]> {
  const { settings, orders } = await readDB();
  const results: CourierResult[] = [];
  for (const id of ids) {
    const order = orders.find((o) => o.id === id);
    if (!order?.courier) {
      results.push({ id, ok: false, message: "কুরিয়ারে পাঠানো হয়নি" });
      continue;
    }
    try {
      const status = await steadfastStatus(order.courier.consignmentId, settings);
      await updateDB((db) => {
        const o = db.orders.find((x) => x.id === id);
        if (!o?.courier) return;
        o.courier.status = status;
        o.courier.checkedAt = new Date().toISOString();
        const mapped = statusFromCourier(status);
        if (mapped) applyStatus(db, o, mapped, `Steadfast: ${status}`);
      });
      results.push({ id, ok: true, message: status });
    } catch (e) {
      results.push({ id, ok: false, message: (e as Error).message });
    }
  }
  return results;
}
