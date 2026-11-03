"use client";

import { useEffect } from "react";
import { track } from "@/lib/pixel";

export default function PurchaseEvent({ id, value, quantity, name }: { id: number; value: number; quantity: number; name: string }) {
  useEffect(() => {
    const key = `ts_purchase_${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {}
    // The pixel script may still be loading; retry briefly.
    let tries = 0;
    const timer = setInterval(() => {
      const ready = typeof (window as unknown as { fbq?: unknown }).fbq === "function";
      if (ready || ++tries > 20) {
        clearInterval(timer);
        if (!ready) return;
        track("Purchase", { currency: "BDT", value, num_items: quantity, content_name: name }, `order-${id}`);
        try {
          sessionStorage.setItem(key, "1");
        } catch {}
      }
    }, 250);
    return () => clearInterval(timer);
  }, [id, value, quantity, name]);
  return null;
}
