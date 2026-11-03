"use client";

import { Field, ImageUpload, Loading, PageHeader, Panel, SaveButton, useSettings } from "@/components/admin/ui";
import type { Settings } from "@/lib/types";

type ContentKey = keyof Settings["content"];

const TEXT_FIELDS: { key: ContentKey; label: string; multiline?: boolean; hint?: string }[] = [
  { key: "siteTitle", label: "সাইটের টাইটেল (ব্রাউজার ট্যাব ও SEO)" },
  { key: "heroTitleColored", label: "হেডলাইন (রঙিন অংশ)" },
  { key: "heroTitleDark", label: "হেডলাইন (কালো অংশ)" },
  { key: "heroSubtitle", label: "সাব-হেডলাইন", multiline: true },
  { key: "tagline", label: "ট্যাগলাইন", hint: "শেষের দুই শব্দ রঙিন দেখাবে" },
  { key: "ctaText", label: "অর্ডার বাটনের লেখা" },
  { key: "noticeBar", label: "উপরের নোটিশ বার (ফাঁকা রাখলে লুকানো থাকবে)" },
  { key: "orderFormTitle", label: "অর্ডার ফর্মের হেডিং", hint: "“নিচের ফরমটি” অংশ রঙিন দেখাবে" },
  { key: "paymentNote", label: "পেমেন্ট সেকশনের নোট (ফাঁকা রাখলে লুকানো থাকবে)", multiline: true },
  { key: "thankYouMessage", label: "থ্যাংক ইউ পেজের মেসেজ", multiline: true },
  { key: "footerText", label: "ফুটার টেক্সট" },
];

export default function ContentPage() {
  const { settings, update, save, saving, toast } = useSettings();
  if (!settings) return <Loading />;
  const c = settings.content;
  const set = (key: ContentKey, value: string) => update("content", { [key]: value } as Partial<Settings["content"]>);

  return (
    <div className="max-w-4xl">
      <PageHeader title="ল্যান্ডিং পেজ কনটেন্ট" subtitle="লেখা, ছবি ও যোগাযোগের তথ্য">
        <a href="/" target="_blank" className="btn-outline text-sm">👁️ প্রিভিউ</a>
        <SaveButton saving={saving} onClick={() => save(["content"])} />
      </PageHeader>

      <div className="space-y-4">
        <Panel title="লেখা">
          <div className="grid gap-4 sm:grid-cols-2">
            {TEXT_FIELDS.map((f) => (
              <div key={f.key} className={f.multiline ? "sm:col-span-2" : ""}>
                <Field label={f.label} hint={f.hint}>
                  {f.multiline ? (
                    <textarea className="admin-input min-h-[70px]" value={c[f.key]} onChange={(e) => set(f.key, e.target.value)} />
                  ) : (
                    <input className="admin-input" value={c[f.key]} onChange={(e) => set(f.key, e.target.value)} />
                  )}
                </Field>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="ছবি">
          <div className="grid gap-5 sm:grid-cols-2">
            <ImageUpload label="হিরো ছবি (মডেল + প্রোডাক্ট, PNG ট্রান্সপারেন্ট হলে ভালো)" value={c.heroImage} onChange={(u) => set("heroImage", u)} />
            <ImageUpload label="আগে / পরে ছবি" value={c.beforeAfterImage} onChange={(u) => set("beforeAfterImage", u)} />
          </div>
        </Panel>

        <Panel title="যোগাযোগ">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="ফোন নম্বর">
              <input className="admin-input" value={c.phone} onChange={(e) => set("phone", e.target.value)} />
            </Field>
            <Field label="WhatsApp নম্বর" hint="ফাঁকা রাখলে বাটন লুকানো থাকবে">
              <input className="admin-input" value={c.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
            </Field>
            <Field label="ফেসবুক পেজ লিংক">
              <input className="admin-input" value={c.facebookPage} onChange={(e) => set("facebookPage", e.target.value)} />
            </Field>
          </div>
        </Panel>
      </div>
      {toast.node}
    </div>
  );
}
