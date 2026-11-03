"use client";

import { Field, ImageUpload, Loading, PageHeader, Panel, SaveButton, useSettings } from "@/components/admin/ui";
import type { Review } from "@/lib/types";

export default function ReviewsPage() {
  const { settings, setSettings, save, saving, toast } = useSettings();
  if (!settings) return <Loading />;
  const reviews = settings.reviews;

  const setReviews = (next: Review[]) => setSettings({ ...settings, reviews: next });
  const edit = (i: number, patch: Partial<Review>) => setReviews(reviews.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...reviews];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setReviews(next);
  };

  return (
    <div className="max-w-4xl">
      <PageHeader title="কাস্টমার রিভিউ" subtitle="ল্যান্ডিং পেজের “আমাদের গ্রাহকদের মতামত” সেকশন">
        <button
          className="btn-outline text-sm"
          onClick={() => setReviews([...reviews, { id: `r${Date.now()}`, name: "", text: "", rating: 5, avatar: "" }])}
        >
          + নতুন রিভিউ
        </button>
        <SaveButton saving={saving} onClick={() => save(["reviews"])} />
      </PageHeader>

      <div className="space-y-4">
        {reviews.map((r, i) => (
          <Panel key={r.id}>
            <div className="grid gap-4 sm:grid-cols-[1fr_1.4fr]">
              <ImageUpload label="ছবি" value={r.avatar} onChange={(u) => edit(i, { avatar: u })} />
              <div className="space-y-3">
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <Field label="নাম">
                    <input className="admin-input" value={r.name} onChange={(e) => edit(i, { name: e.target.value })} />
                  </Field>
                  <Field label="রেটিং">
                    <select className="admin-input" value={r.rating} onChange={(e) => edit(i, { rating: Number(e.target.value) })}>
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{"★".repeat(n)}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="রিভিউ">
                  <textarea className="admin-input" value={r.text} onChange={(e) => edit(i, { text: e.target.value })} />
                </Field>
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2 border-t border-slate-100 pt-3">
              <button className="btn-outline py-1 text-xs" onClick={() => move(i, -1)} disabled={i === 0}>↑ উপরে</button>
              <button className="btn-outline py-1 text-xs" onClick={() => move(i, 1)} disabled={i === reviews.length - 1}>↓ নিচে</button>
              <button className="btn-outline py-1 text-xs text-red-600" onClick={() => setReviews(reviews.filter((_, j) => j !== i))}>ডিলিট</button>
            </div>
          </Panel>
        ))}
        {reviews.length === 0 && <p className="text-slate-500">কোনো রিভিউ নেই।</p>}
      </div>
      {toast.node}
    </div>
  );
}
