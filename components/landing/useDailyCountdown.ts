"use client";

import { useEffect, useState } from "react";
import { bn } from "@/data/site";

const DAY = 24 * 60 * 60 * 1000;
// Bangladesh somoy (UTC+6) er rat 12 tay protidin notun kore 24 ghontar countdown shuru hoy — shobai eki somoy dekhe
const BD_OFFSET = 6 * 60 * 60 * 1000;

function remaining() {
  return DAY - ((Date.now() + BD_OFFSET) % DAY);
}

const two = (n: number) => (n < 10 ? `০${bn(n)}` : bn(n));

/** দিন/ঘণ্টা/মিনিট/সেকেন্ড — server e "--" (hydration mismatch er bhoy), browser e prothom tick e boshe */
export function useDailyCountdown() {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    setMs(remaining());
    const id = setInterval(() => setMs(remaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const s = ms === null ? null : Math.floor(ms / 1000);
  const fmt = (v: number) => (s === null ? "--" : two(v));
  const sec = s ?? 0;
  return [
    { v: fmt(Math.floor(sec / 86400)), l: "দিন" },
    { v: fmt(Math.floor((sec % 86400) / 3600)), l: "ঘণ্টা" },
    { v: fmt(Math.floor((sec % 3600) / 60)), l: "মিনিট" },
    { v: fmt(sec % 60), l: "সেকেন্ড" },
  ];
}
