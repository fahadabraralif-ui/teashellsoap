"use client";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="rounded-lg bg-brand px-4 py-1.5 font-semibold">
      🖨️ প্রিন্ট করুন
    </button>
  );
}
