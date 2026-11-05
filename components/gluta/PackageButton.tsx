"use client";

// Package card er bottom: order form e oi package select kore form e niye jay
export default function PackageButton({ id, text, className }: { id: number; text: string; className?: string }) {
  return (
    <a
      href="#order"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent("select-package", { detail: id }))}
    >
      {text}
    </a>
  );
}
