"use client";

import { Field, ImageUpload, Loading, PageHeader, Panel, SaveButton, useSettings } from "@/components/admin/ui";

export default function ProductPage() {
  const { settings, update, save, saving, toast } = useSettings();
  if (!settings) return <Loading />;
  const { product, delivery } = settings;

  return (
    <div className="max-w-4xl">
      <PageHeader title="প্রোডাক্ট ও ডেলিভারি" subtitle="দাম, স্টক ও ডেলিভারি চার্জ">
        <SaveButton saving={saving} onClick={() => save(["product", "delivery"])} />
      </PageHeader>

      <div className="space-y-4">
        <Panel title="প্রোডাক্ট">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="প্রোডাক্টের নাম">
                <input className="admin-input" value={product.name} onChange={(e) => update("product", { name: e.target.value })} />
              </Field>
            </div>
            <Field label="অফার মূল্য — ১ পিছ (৳)" hint="ল্যান্ডিং পেজের দামের ব্যাজে এই দাম দেখাবে; প্যাকেজের দাম নিচে আলাদা">
              <input type="number" className="admin-input" value={product.price} onChange={(e) => update("product", { price: Number(e.target.value) })} />
            </Field>
            <Field label="নিয়মিত মূল্য (৳)" hint="কাটা দাম হিসেবে দেখাবে; অফার মূল্যের চেয়ে বেশি হলে">
              <input type="number" className="admin-input" value={product.regularPrice} onChange={(e) => update("product", { regularPrice: Number(e.target.value) })} />
            </Field>
            <Field label="স্টক" hint="অর্ডার হলে নিজে থেকে কমবে; ক্যানসেল/রিটার্ন হলে বাড়বে">
              <input type="number" className="admin-input" value={product.stock} onChange={(e) => update("product", { stock: Number(e.target.value) })} />
            </Field>
            <Field label="একবারে সর্বোচ্চ পরিমাণ">
              <input type="number" className="admin-input" value={product.maxQuantity} onChange={(e) => update("product", { maxQuantity: Number(e.target.value) })} />
            </Field>
            <Field label="SKU">
              <input className="admin-input" value={product.sku} onChange={(e) => update("product", { sku: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <ImageUpload label="প্রোডাক্ট ছবি (অর্ডার ফর্ম ও শেয়ার প্রিভিউ)" value={product.image} onChange={(url) => update("product", { image: url })} />
            </div>
          </div>
        </Panel>

        <Panel title="প্যাকেজ / অফার (অর্ডার ফর্মে অপশন হিসেবে দেখাবে)">
          <div className="space-y-3">
            {product.packages.map((p, i) => {
              const edit = (patch: Partial<typeof p>) =>
                update("product", { packages: product.packages.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
              return (
                <div key={p.id} className="grid grid-cols-[1fr_80px_100px_auto] items-end gap-2">
                  <Field label="নাম">
                    <input className="admin-input" value={p.label} onChange={(e) => edit({ label: e.target.value })} placeholder="যেমন: ২ পিছ" />
                  </Field>
                  <Field label="পিছ">
                    <input type="number" min={1} className="admin-input" value={p.quantity} onChange={(e) => edit({ quantity: Number(e.target.value) })} />
                  </Field>
                  <Field label="মোট দাম (৳)">
                    <input type="number" min={0} className="admin-input" value={p.price} onChange={(e) => edit({ price: Number(e.target.value) })} />
                  </Field>
                  <button
                    className="btn-outline px-3 text-red-600"
                    title="ডিলিট"
                    onClick={() => update("product", { packages: product.packages.filter((_, j) => j !== i) })}
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
            <button
              className="btn-outline text-sm"
              onClick={() =>
                update("product", {
                  packages: [...product.packages, { id: `p${Date.now()}`, label: "", quantity: product.packages.length + 1, price: 0 }],
                })
              }
            >
              + নতুন প্যাকেজ
            </button>
            <p className="text-xs text-slate-500">প্রথম প্যাকেজটি ফর্মে আগে থেকে সিলেক্ট থাকবে। সব প্যাকেজ মুছে দিলে শুধু ১ পিছ অফার মূল্যে দেখাবে।</p>
          </div>
        </Panel>

        <Panel title="ডেলিভারি চার্জ">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="এরিয়া ১ এর নাম">
              <input className="admin-input" value={delivery.insideLabel} onChange={(e) => update("delivery", { insideLabel: e.target.value })} />
            </Field>
            <Field label="এরিয়া ১ চার্জ (৳)">
              <input type="number" className="admin-input" value={delivery.inside} onChange={(e) => update("delivery", { inside: Number(e.target.value) })} />
            </Field>
            <Field label="এরিয়া ২ এর নাম">
              <input className="admin-input" value={delivery.outsideLabel} onChange={(e) => update("delivery", { outsideLabel: e.target.value })} />
            </Field>
            <Field label="এরিয়া ২ চার্জ (৳)">
              <input type="number" className="admin-input" value={delivery.outside} onChange={(e) => update("delivery", { outside: Number(e.target.value) })} />
            </Field>
            <Field label="ফ্রি ডেলিভারি — ন্যূনতম পরিমাণ" hint="০ দিলে ফ্রি ডেলিভারি বন্ধ থাকবে">
              <input
                type="number"
                className="admin-input"
                value={delivery.freeDeliveryMinQty}
                onChange={(e) => update("delivery", { freeDeliveryMinQty: Number(e.target.value) })}
              />
            </Field>
          </div>
        </Panel>
      </div>
      {toast.node}
    </div>
  );
}
