"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
    } else {
      setError(data.error || "লগইন ব্যর্থ");
      setLoading(false);
    }
  }

  return (
    <div className="page-bg grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="card w-full max-w-sm p-7">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo.png" alt="TeaShell" className="mx-auto h-auto w-44" />
        <h1 className="mt-4 text-center text-2xl font-bold text-slate-800">অ্যাডমিন প্যানেল</h1>
        <label className="admin-label mt-6">পাসওয়ার্ড</label>
        <div className="relative">
          <input
            type={show ? "text" : "password"}
            className="admin-input py-2.5 pr-12"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="current-password"
          />
          <button type="button" onClick={() => setShow((s) => !s)} className="absolute inset-y-0 right-3 text-sm text-slate-500">
            {show ? "🙈" : "👁️"}
          </button>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button className="btn-primary mt-5 w-full py-2.5" disabled={loading || !password}>
          {loading ? "অপেক্ষা করুন..." : "লগইন করুন"}
        </button>
      </form>
    </div>
  );
}
