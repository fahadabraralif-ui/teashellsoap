"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "ড্যাশবোর্ড", icon: "📊" },
  { href: "/admin/orders", label: "অর্ডারসমূহ", icon: "🧾" },
  { href: "/admin/incomplete", label: "ইনকমপ্লিট অর্ডার", icon: "⏳" },
  { href: "/admin/product", label: "প্রোডাক্ট ও ডেলিভারি", icon: "🧼" },
  { href: "/admin/content", label: "ল্যান্ডিং পেজ কনটেন্ট", icon: "🖼️" },
  { href: "/admin/reviews", label: "রিভিউ", icon: "⭐" },
  { href: "/admin/marketing", label: "পিক্সেল ও মার্কেটিং", icon: "📈" },
  { href: "/admin/courier", label: "কুরিয়ার (Steadfast)", icon: "🚚" },
  { href: "/admin/settings", label: "সিকিউরিটি ও পাসওয়ার্ড", icon: "🔒" },
];

export default function AdminShell({ children, incompleteCount, pendingCount }: { children: React.ReactNode; incompleteCount: number; pendingCount: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const badge = (href: string) =>
    href === "/admin/orders" ? pendingCount : href === "/admin/incomplete" ? incompleteCount : 0;

  const nav = (
    <nav className="flex flex-col gap-1 p-3">
      {NAV.map((n) => {
        const active = n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
        const count = badge(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              active ? "bg-brand text-white shadow" : "text-slate-200 hover:bg-white/10"
            }`}
          >
            <span className="text-base">{n.icon}</span>
            <span className="flex-1">{n.label}</span>
            {count > 0 && (
              <span className={`rounded-full px-2 text-xs font-bold ${active ? "bg-white text-brand" : "bg-brand text-white"}`}>{count}</span>
            )}
          </Link>
        );
      })}
      <div className="my-2 border-t border-white/10" />
      <a href="/" target="_blank" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-200 hover:bg-white/10">
        <span>🌐</span> সাইট দেখুন
      </a>
      <button onClick={logout} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-white/10">
        <span>🚪</span> লগআউট
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <aside className="no-print fixed inset-y-0 left-0 z-30 hidden w-64 overflow-y-auto bg-slate-900 lg:block">
        <Brand />
        {nav}
      </aside>

      {open && <div className="no-print fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}
      <aside
        className={`no-print fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-slate-900 transition-transform lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Brand />
        {nav}
      </aside>

      <div className="lg:pl-64">
        <header className="no-print sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-lg" aria-label="Menu">
            ☰
          </button>
          <span className="font-bold text-slate-800">TeaShell Admin</span>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
      <div className="rounded-lg bg-white px-2 py-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.png" alt="TeaShell" className="h-7 w-auto" />
      </div>
      <span className="text-sm font-semibold text-slate-300">Admin</span>
    </div>
  );
}
