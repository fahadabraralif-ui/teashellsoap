import { site, bn } from "@/data/site";

/**
 * Landing page er shob lekha — admin > "ল্যান্ডিং পেজ টেক্সট" theke bodlano jay.
 * Lekhay {price}, {old_price}, {save}, {off}, {brand}, {inside}, {outside}, {free_boxes} dile nije boshe.
 * [ ] er bhitorer lekha sonali (gradient) highlight hoy.
 */
export const SECTIONS = [
  {
    id: "seo", title: "🔎 গুগল/ফেসবুক শেয়ার টাইটেল",
    fields: [
      ["meta_title", "পেজের টাইটেল", "{brand} স্কিন ব্রাইটেনিং সোপ — মাত্র {price} টাকা"],
      ["meta_desc", "ছোট বর্ণনা", "উজ্জ্বল, ফর্সা ও দাগমুক্ত ত্বকের জন্য Ceramide, Arbutin ও Salicylic Acid সমৃদ্ধ সোপ। সারা দেশে ক্যাশ অন ডেলিভারি।", true],
    ],
  },
  {
    id: "top", title: "📢 একদম উপরের অফার বার",
    fields: [
      ["topbar", "অফার বার (খালি রাখলে লুকানো থাকবে)", "🎉 সীমিত সময়ের অফার — মাত্র {price} টাকা, সারা দেশে ক্যাশ অন ডেলিভারি!"],
    ],
  },
  {
    id: "hero", title: "⭐ প্রথম অংশ (হিরো)",
    fields: [
      ["hero_title", "বড় হেডিং ([ ] = গোলাপি হাইলাইট)", "[স্কিন ব্রাইটেনিং] সোপ"],
      ["hero_sub", "হেডিংয়ের নিচে", "উজ্জ্বল, ফর্সা ও দাগমুক্ত ত্বকের জন্য একটি পারফেক্ট সমাধান!", true],
      ["badge_top", "দামের ব্যাজ — উপরে", "মাত্র"],
      ["badge_bottom", "দামের ব্যাজ — নিচে", "টাকা"],
      ["regular_text", "ব্যাজের নিচের লেখা (খালি রাখলে লুকানো)", "নিয়মিত মূল্য {old_price} টাকা"],
    ],
    list: { key: "features", title: "৪টি ফিচার (দুই লাইনে দেখায়)", fields: [["title", "প্রথম লাইন"], ["text", "দ্বিতীয় লাইন"]] },
  },
  {
    id: "why", title: "✅ কেন TeaShell + আগে/পরে",
    fields: [
      ["why_title", "হেডিং", "কেন {brand}?"],
      ["before_label", "আগে/পরে ছবির বাম লেবেল", "আগে"],
      ["after_label", "আগে/পরে ছবির ডান লেবেল", "এখন"],
    ],
    list: { key: "why", title: "টিক চিহ্নের পয়েন্ট", fields: [["text", "লেখা"]] },
  },
  {
    id: "ingredients", title: "🧪 বিশেষ উপাদান ও ট্যাগলাইন",
    fields: [
      ["ing_title", "উপাদানের হেডিং", "বিশেষ উপাদান"],
      ["tagline", "পাশের বড় লেখা ([ ] = গোলাপি হাইলাইট)", "সুন্দর ত্বক এখন আর [স্বপ্ন নয়!]"],
    ],
    list: { key: "ingredients", title: "উপাদানগুলো", fields: [["image", "ছবি", "image"], ["name", "নাম"], ["note", "নিচের ছোট লেখা"]] },
  },
  {
    id: "reviews", title: "⭐ গ্রাহকদের মতামত",
    fields: [["reviews_title", "হেডিং", "আমাদের গ্রাহকদের মতামত"]],
    list: { key: "reviews", title: "রিভিউগুলো", fields: [["image", "ছবি", "image"], ["text", "রিভিউ", true], ["name", "নাম"]] },
  },
  {
    id: "trust", title: "🚚 ডেলিভারি / অরিজিনাল / ক্যাশ অন ডেলিভারি সারি",
    fields: [
      ["trust1_a", "১ — প্রথম লাইন", "সারা দেশে"],
      ["trust1_b", "১ — দ্বিতীয় লাইন", "দ্রুত ডেলিভারি"],
      ["trust2_a", "২ — প্রথম লাইন", "১০০% অরিজিনাল"],
      ["trust2_b", "২ — দ্বিতীয় লাইন", "প্রোডাক্ট"],
      ["trust3_a", "৩ — প্রথম লাইন", "ক্যাশ অন"],
      ["trust3_b", "৩ — দ্বিতীয় লাইন", "ডেলিভারি"],
      ["cta_btn", "বড় অর্ডার বাটন", "এখনই অর্ডার করুন"],
    ],
  },
  {
    id: "form", title: "📝 অর্ডার ফর্ম",
    fields: [
      ["order_title", "ফর্মের উপরের হেডিং ([ ] = হাইলাইট)", "অর্ডার করতে আপনার তথ্য দিয়ে [নিচের ফরমটি] পূরণ করুন"],
      ["form_head", "প্যাকেজ বাছাইয়ের হেডিং", "পছন্দের প্যাকেজ সিলেক্ট করুন"],
      ["billing_title", "তথ্যের হেডিং", "আপনার তথ্য"],
      ["name_label", "নামের লেবেল", "আপনার নাম"],
      ["name_ph", "নামের ঘরের ভেতরের লেখা", "আপনার নাম"],
      ["address_label", "ঠিকানার লেবেল", "আপনার ঠিকানা"],
      ["address_ph", "ঠিকানার ঘরের ভেতরের লেখা", "বাসা/রোড, থানা, জেলা"],
      ["phone_label", "মোবাইলের লেবেল", "মোবাইল নাম্বার"],
      ["shipping_title", "ডেলিভারির হেডিং", "ডেলিভারি"],
      ["free_hint", "ফ্রি ডেলিভারির ইঙ্গিত", "🚚 {free_boxes} পিছ বা বেশি নিলে ডেলিভারি চার্জ ফ্রি!"],
      ["free_done", "ফ্রি ডেলিভারি পেলে", "🎉 অভিনন্দন! আপনার ডেলিভারি চার্জ সম্পূর্ণ ফ্রি"],
      ["summary_title", "অর্ডারের সারাংশ হেডিং", "আপনার অর্ডার"],
      ["cod_label", "পেমেন্ট", "ক্যাশ অন ডেলিভারি"],
      ["hadith", "হাদিস/নোট", "রাসুল (সা.) বলেছেন : যদি কোনো ব্যক্তি পণ্য কেনার উদ্দেশ্য ছাড়াই ক্রেতা সেজে বিক্রেতাকে বিপদে ফেলার জন্য পরিস্থিতি তৈরি করে। এটি বিক্রেতা বা সাধারণ ক্রেতা উভয়ের জন্যই ক্ষতিকর। (সহীহ বুখারী : ২১৪০)", true],
      ["privacy", "প্রাইভেসি লেখা", "আপনার দেওয়া তথ্য শুধুমাত্র অর্ডার প্রসেস ও ডেলিভারির জন্য ব্যবহার করা হবে।", true],
      ["submit_btn", "অর্ডার বাটন (টাকা নিজে যোগ হয়)", "অর্ডার করুন"],
      ["success_title", "অর্ডারের পর — হেডিং", "ধন্যবাদ! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে"],
      ["success_text", "অর্ডারের পর — লেখা", "আমাদের প্রতিনিধি খুব শীঘ্রই আপনাকে কল করে অর্ডার কনফার্ম করবেন।"],
    ],
  },
  {
    id: "footer", title: "🔻 ফুটার",
    fields: [
      ["footer_call", "কলের লেখা (নাম্বার নিজে বসে)", "যেকোনো প্রয়োজনে কল করুন:"],
      ["footer_copy", "কপিরাইট", "© {year} {brand}. সর্বস্বত্ব সংরক্ষিত।"],
    ],
  },
];

const LIST_DEFAULTS = {
  features: site.features,
  why: site.why,
  ingredients: site.ingredients,
  reviews: site.reviews,
};

export const DEFAULT_TEXT = Object.fromEntries(SECTIONS.flatMap((s) => s.fields.map(([k, , d]) => [k, d])));
export const DEFAULT_LISTS = LIST_DEFAULTS;

/** settings.content (JSON) ar default mile shob lekha */
export function getContent(settings) {
  let saved = {};
  try { saved = JSON.parse(settings.content || "{}") || {}; } catch {}
  const text = { ...DEFAULT_TEXT, ...(saved.text || {}) };
  const lists = {};
  for (const [k, def] of Object.entries(LIST_DEFAULTS)) {
    const s = saved.lists?.[k];
    lists[k] = Array.isArray(s) ? s : def;
  }
  return { text, lists };
}

/** {price} er moto token boshano */
export function fillTokens(str, vars) {
  return String(str ?? "").replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

export function tokenVars({ price, oldPrice, brand, delivery, freeBoxes }) {
  const save = Math.max(0, oldPrice - price);
  return {
    price: bn(price),
    old_price: bn(oldPrice),
    save: bn(save),
    off: bn(oldPrice ? Math.round((save / oldPrice) * 100) : 0),
    brand,
    inside: bn(delivery?.[0]?.charge ?? 0),
    outside: bn(delivery?.[1]?.charge ?? 0),
    free_boxes: bn(freeBoxes || 0),
    year: new Date().getFullYear(),
  };
}
