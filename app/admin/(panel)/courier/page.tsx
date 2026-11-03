"use client";

import { useState } from "react";
import { Field, Loading, PageHeader, Panel, SaveButton, useSettings } from "@/components/admin/ui";

export default function CourierPage() {
  const { settings, update, save, saving, toast } = useSettings();
  const [checking, setChecking] = useState(false);
  if (!settings) return <Loading />;
  const c = settings.courier;

  async function checkBalance() {
    setChecking(true);
    // Save first so the check uses the keys on screen.
    await save(["courier"]);
    const res = await fetch("/api/admin/courier", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "balance" }),
    });
    const data = await res.json();
    setChecking(false);
    if (res.ok) toast.success(`✓ কানেক্টেড — ব্যালান্স: ৳${data.balance}`);
    else toast.error(`কানেকশন ব্যর্থ: ${data.error}`);
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="কুরিয়ার (Steadfast)" subtitle="এক ক্লিকে অর্ডার Steadfast এ পাঠান ও ডেলিভারি স্ট্যাটাস আপডেট করুন">
        <SaveButton saving={saving} onClick={() => save(["courier"])} />
      </PageHeader>

      <Panel title="Steadfast API">
        <div className="space-y-4">
          <Field label="API Key">
            <input className="admin-input font-mono" value={c.steadfastApiKey} onChange={(e) => update("courier", { steadfastApiKey: e.target.value })} />
          </Field>
          <Field label="Secret Key">
            <input type="password" className="admin-input font-mono" value={c.steadfastSecretKey} onChange={(e) => update("courier", { steadfastSecretKey: e.target.value })} />
          </Field>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-brand"
              checked={c.autoSendOnConfirm}
              onChange={(e) => update("courier", { autoSendOnConfirm: e.target.checked })}
            />
            অর্ডার “কনফার্মড” করলে স্বয়ংক্রিয়ভাবে Steadfast এ পাঠাও
          </label>
          <button className="btn-outline text-sm" onClick={checkBalance} disabled={checking}>
            {checking ? "চেক হচ্ছে..." : "🔌 কানেকশন টেস্ট ও ব্যালান্স দেখুন"}
          </button>
          <p className="rounded-lg bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
            Steadfast প্যানেল → Settings → API থেকে key দুটি নিন। অর্ডার পাঠালে স্ট্যাটাস নিজে থেকে “শিপড” হবে এবং ট্র্যাকিং কোড সেভ হবে।
            “কুরিয়ার স্ট্যাটাস” চাপলে ডেলিভারড / ক্যানসেলড হলে অর্ডার স্ট্যাটাসও আপডেট হবে।
          </p>
        </div>
      </Panel>
      {toast.node}
    </div>
  );
}
