import type { ProductPackage, Settings } from "./types";

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

export function toBanglaDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

export function toEnglishDigits(input: string): string {
  return input.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
}

/** Normalises Bangladeshi mobile numbers to 01XXXXXXXXX, or returns null if invalid. */
export function normalizePhone(input: string): string | null {
  let p = toEnglishDigits(input || "").replace(/[^\d]/g, "");
  if (p.startsWith("880")) p = p.slice(2);
  else if (p.startsWith("88")) p = p.slice(2);
  return /^01[3-9]\d{8}$/.test(p) ? p : null;
}

export function formatTaka(n: number): string {
  return `৳${n.toLocaleString("en-IN")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/** YYYY-MM-DD in Bangladesh time. */
export function dhakaDay(iso: string | Date): string {
  return new Date(iso).toLocaleDateString("en-CA", { timeZone: "Asia/Dhaka" });
}

/** The packages offered on the order form; falls back to a single piece at the base price. */
export function getPackages(product: Settings["product"]): ProductPackage[] {
  const valid = (product.packages ?? []).filter((p) => p.quantity > 0 && p.price >= 0);
  return valid.length ? valid : [{ id: "p1", label: "১ পিছ", quantity: 1, price: product.price }];
}

export function calcTotals(
  subtotal: number,
  quantity: number,
  area: "inside" | "outside",
  delivery: { inside: number; outside: number; freeDeliveryMinQty: number },
  discount = 0,
) {
  const free = delivery.freeDeliveryMinQty > 0 && quantity >= delivery.freeDeliveryMinQty;
  const deliveryCharge = free ? 0 : area === "inside" ? delivery.inside : delivery.outside;
  return { subtotal, deliveryCharge, total: Math.max(0, subtotal + deliveryCharge - discount) };
}
