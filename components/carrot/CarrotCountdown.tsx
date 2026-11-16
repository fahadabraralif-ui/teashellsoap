"use client";

import { useDailyCountdown } from "../landing/useDailyCountdown";

/** Carrot page er rong: komla/holud gradient card, gaRho lal (maroon) box e sonali shongkha */
export default function CarrotCountdown({ label }: { label: string }) {
  const parts = useDailyCountdown();

  return (
    <section className="pb-2 pt-8 md:pt-10">
      <div className="mx-auto w-[min(1120px,calc(100%-32px))] rounded-[22px] border border-[#f7c97f] bg-[linear-gradient(120deg,#ffe2b0_0%,#ffb020_50%,#f26b0f_100%)] px-4 py-6 text-center shadow-[0_18px_40px_rgba(242,107,15,.22)] md:py-7">
        {label && (
          <p className="mb-4 flex items-center justify-center gap-2 text-xl font-extrabold text-[#6b1608] md:text-2xl">
            <span aria-hidden>🔥</span>
            {label}
          </p>
        )}
        <div className="inline-grid grid-cols-4 gap-2.5 md:gap-4" role="timer" aria-live="off">
          {parts.map((p) => (
            <div
              key={p.l}
              className="flex w-[4.4rem] flex-col items-center rounded-2xl bg-[linear-gradient(180deg,#8a1f0c,#5e1206)] py-2.5 shadow-[0_10px_22px_-8px_rgba(107,22,8,.6)] ring-1 ring-[#ffd666]/30 min-[400px]:w-20 md:w-24 md:py-3"
            >
              <span className="text-[1.8rem] font-extrabold leading-none text-[#ffd666] tabular-nums md:text-[2.3rem]">{p.v}</span>
              <span className="mt-1.5 text-sm font-semibold text-[#fff3e0] md:text-base">{p.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
