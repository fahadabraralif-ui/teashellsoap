"use client";

import { useEffect, useState } from "react";
import { bn } from "@/data/site";

const DAY = 24 * 60 * 60 * 1000;
// Bangladesh somoy (UTC+6) er rat 12 tay protidin notun kore 24 ghontar countdown shuru hoy — shobai eki somoy dekhe
const BD_OFFSET = 6 * 60 * 60 * 1000;

function remaining() {
  const now = Date.now();
  return DAY - ((now + BD_OFFSET) % DAY);
}

const two = (n: number) => (n < 10 ? `০${bn(n)}` : bn(n));

export default function Countdown({ label }: { label: string }) {
  // Server e somoy dekhai na (hydration mismatch), browser e prothom tick e boshe
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    setMs(remaining());
    const id = setInterval(() => setMs(remaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const s = ms === null ? null : Math.floor(ms / 1000);
  const parts = [
    { v: s === null ? null : Math.floor(s / 86400), l: "দিন" },
    { v: s === null ? null : Math.floor((s % 86400) / 3600), l: "ঘণ্টা" },
    { v: s === null ? null : Math.floor((s % 3600) / 60), l: "মিনিট" },
    { v: s === null ? null : s % 60, l: "সেকেন্ড" },
  ];

  return (
    <section className="bg-gradient-to-r from-[#f26b1d] via-[#f47a2a] to-[#e8541a] px-4 py-5 md:py-6">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 md:flex-row md:gap-8">
        {label && (
          <p className="flex items-center gap-2 text-center font-display text-2xl font-extrabold text-white md:text-[2rem]">
            <span aria-hidden>🔥</span>
            {label}
          </p>
        )}
        <div className="grid grid-cols-4 gap-2.5 md:gap-3" role="timer" aria-live="off">
          {parts.map((p) => (
            <div
              key={p.l}
              className="flex w-[4.6rem] flex-col items-center rounded-2xl bg-[#173d22] py-2.5 shadow-[0_8px_18px_-8px_rgba(0,0,0,0.5)] min-[400px]:w-20 md:w-[6.5rem] md:py-3"
            >
              <span className="font-display text-[1.9rem] font-extrabold leading-none text-[#fcd34d] tabular-nums md:text-[2.6rem]">
                {p.v === null ? "--" : two(p.v)}
              </span>
              <span className="mt-1 text-sm font-semibold text-white md:text-lg">{p.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
