"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Settings } from "@/lib/types";

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function Panel({ title, children, className = "" }: { title?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5 ${className}`}>
      {title && <h2 className="mb-4 text-base font-bold text-slate-800">{title}</h2>}
      {children}
    </section>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function Toast({ message, type = "success", onClose }: { message: string; type?: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [message, onClose]);
  return (
    <div
      className={`no-print fixed bottom-5 right-5 z-[60] max-w-sm rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const close = useCallback(() => setToast(null), []);
  const node = toast ? <Toast message={toast.message} type={toast.type} onClose={close} /> : null;
  return {
    node,
    success: (message: string) => setToast({ message, type: "success" }),
    error: (message: string) => setToast({ message, type: "error" }),
  };
}

/** Loads the full settings object and saves selected sections back. */
export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings));
  }, []);

  async function save(sections: (keyof Settings)[]) {
    if (!settings) return;
    setSaving(true);
    const body = Object.fromEntries(sections.map((k) => [k, settings[k]]));
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setSettings(data.settings);
      toast.success("সেভ হয়েছে ✓");
    } else toast.error(data.error || "সেভ করা যায়নি");
  }

  function update<K extends keyof Settings>(section: K, patch: Partial<Settings[K]>) {
    setSettings((s) => (s ? { ...s, [section]: { ...s[section], ...patch } } : s));
  }

  return { settings, setSettings, update, save, saving, toast };
}

export function SaveButton({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <button className="btn-primary min-w-32" onClick={onClick} disabled={saving}>
      {saving ? "সেভ হচ্ছে..." : "সেভ করুন"}
    </button>
  );
}

export function ImageUpload({ value, onChange, label }: { value: string; onChange: (url: string) => void; label: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setErr("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setBusy(false);
    if (res.ok) onChange(data.url);
    else setErr(data.error || "আপলোড ব্যর্থ");
  }

  return (
    <div>
      <label className="admin-label">{label}</label>
      <div className="flex items-center gap-3">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {value ? <img src={value} alt="" className="h-full w-full object-contain" /> : <span className="text-xs text-slate-400">No image</span>}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} placeholder="/images/... বা https://..." />
          <button type="button" className="btn-outline py-1.5 text-sm" onClick={() => input.current?.click()} disabled={busy}>
            {busy ? "আপলোড হচ্ছে..." : "📤 ছবি আপলোড"}
          </button>
          {err && <p className="text-xs text-red-600">{err}</p>}
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
    </div>
  );
}

export function Loading() {
  return <div className="grid h-60 place-items-center text-slate-500">লোড হচ্ছে...</div>;
}
