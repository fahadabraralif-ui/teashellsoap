"use client";

import { Field, Loading, PageHeader, Panel, SaveButton, useSettings } from "@/components/admin/ui";

export default function MarketingPage() {
  const { settings, update, save, saving, toast } = useSettings();
  if (!settings) return <Loading />;
  const m = settings.marketing;

  return (
    <div className="max-w-3xl">
      <PageHeader title="পিক্সেল ও মার্কেটিং" subtitle="Facebook Pixel, Conversions API ও Google Tag Manager">
        <SaveButton saving={saving} onClick={() => save(["marketing"])} />
      </PageHeader>

      <div className="space-y-4">
        <Panel title="Facebook (Meta) Pixel">
          <div className="space-y-4">
            <Field label="Pixel ID" hint="PageView, InitiateCheckout ও Purchase ইভেন্ট নিজে থেকেই ফায়ার হবে">
              <input className="admin-input" value={m.pixelId} onChange={(e) => update("marketing", { pixelId: e.target.value })} placeholder="যেমন: 123456789012345" />
            </Field>
            <Field label="Conversions API Access Token (ঐচ্ছিক)" hint="দিলে প্রতিটি অর্ডারে সার্ভার-সাইড Purchase ইভেন্ট যাবে; ব্রাউজার ইভেন্টের সাথে event_id দিয়ে ডুপ্লিকেট বাদ যাবে">
              <textarea className="admin-input font-mono text-xs" value={m.capiToken} onChange={(e) => update("marketing", { capiToken: e.target.value })} />
            </Field>
            <Field label="Test Event Code (ঐচ্ছিক)" hint="Events Manager এ টেস্ট করার সময় দিন, পরে মুছে ফেলুন">
              <input className="admin-input" value={m.testEventCode} onChange={(e) => update("marketing", { testEventCode: e.target.value })} placeholder="TEST12345" />
            </Field>
          </div>
        </Panel>
        <Panel title="Google Tag Manager">
          <Field label="GTM Container ID">
            <input className="admin-input" value={m.gtmId} onChange={(e) => update("marketing", { gtmId: e.target.value })} placeholder="GTM-XXXXXXX" />
          </Field>
        </Panel>
      </div>
      {toast.node}
    </div>
  );
}
