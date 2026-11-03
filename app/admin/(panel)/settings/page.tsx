"use client";

import { useState } from "react";
import { Field, Loading, PageHeader, Panel, SaveButton, useSettings } from "@/components/admin/ui";

export default function SecurityPage() {
  const { settings, update, save, saving, toast } = useSettings();
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  if (!settings) return <Loading />;
  const s = settings.security;

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pw.next !== pw.confirm) return toast.error("নতুন পাসওয়ার্ড দুটি মিলছে না");
    setPwSaving(true);
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current: pw.current, next: pw.next }),
    });
    const data = await res.json();
    setPwSaving(false);
    if (res.ok) {
      setPw({ current: "", next: "", confirm: "" });
      toast.success("পাসওয়ার্ড পরিবর্তন হয়েছে");
    } else toast.error(data.error || "ব্যর্থ");
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="সিকিউরিটি ও পাসওয়ার্ড" subtitle="ফেক অর্ডার ঠেকানো ও অ্যাডমিন পাসওয়ার্ড">
        <SaveButton saving={saving} onClick={() => save(["security"])} />
      </PageHeader>

      <div className="space-y-4">
        <Panel title="ফেক অর্ডার প্রোটেকশন">
          <div className="space-y-4">
            <Field label="একই নম্বর থেকে আবার অর্ডার আটকানোর সময় (মিনিট)" hint="০ দিলে বন্ধ থাকবে">
              <input
                type="number"
                className="admin-input max-w-40"
                value={s.duplicateWindowMinutes}
                onChange={(e) => update("security", { duplicateWindowMinutes: Number(e.target.value) })}
              />
            </Field>
            <Field label="ব্লক করা মোবাইল নম্বর" hint="প্রতি লাইনে একটি নম্বর">
              <textarea
                className="admin-input min-h-[110px] font-mono"
                value={s.blockedPhones.join("\n")}
                onChange={(e) => update("security", { blockedPhones: e.target.value.split("\n") })}
              />
            </Field>
            <Field label="ব্লক করা IP" hint="প্রতি লাইনে একটি IP (অর্ডার এডিট করলে IP দেখা যাবে)">
              <textarea
                className="admin-input min-h-[90px] font-mono"
                value={s.blockedIps.join("\n")}
                onChange={(e) => update("security", { blockedIps: e.target.value.split("\n") })}
              />
            </Field>
          </div>
        </Panel>

        <Panel title="পাসওয়ার্ড পরিবর্তন">
          <form onSubmit={changePassword} className="grid gap-4 sm:grid-cols-3">
            <Field label="বর্তমান পাসওয়ার্ড">
              <input type="password" className="admin-input" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" />
            </Field>
            <Field label="নতুন পাসওয়ার্ড">
              <input type="password" className="admin-input" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" />
            </Field>
            <Field label="আবার লিখুন">
              <input type="password" className="admin-input" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" />
            </Field>
            <div className="sm:col-span-3">
              <button className="btn-primary" disabled={pwSaving || !pw.current || !pw.next}>
                {pwSaving ? "পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
              </button>
              <p className="mt-2 text-xs text-slate-500">পাসওয়ার্ড বদলালে অন্য সব ডিভাইস থেকে লগআউট হয়ে যাবে।</p>
            </div>
          </form>
        </Panel>
      </div>
      {toast.node}
    </div>
  );
}
