/**
 * /turmericoilcombo landing page er lekha — admin > ল্যান্ডিং পেজ টেক্সট > Turmeric Combo theke bodlano jay.
 * Field: [key, label, default, long] — long = true hole boro ghor, "image" hole chobi upload.
 * Dam ({price}) ashe admin > পণ্য (পেজ = Turmeric Combo) theke. Order form ar footer er lekha lib/content.js theke.
 */
export const TURMERIC_SECTIONS = [
  {
    id: "seo", title: "🔎 গুগল/ফেসবুক শেয়ার টাইটেল",
    fields: [
      ["meta_title", "পেজের টাইটেল", "Daily Glow Combo | ৩টি স্কিনকেয়ার প্রোডাক্ট মাত্র ৳{price}"],
      ["meta_desc", "ছোট বর্ণনা", "Daily Glow 3-in-1 Body & Lip Care Combo: Lily Whipped Shea Body Wash, Veet Gold Turmeric Body Oil ও Laneige Lip Sleeping Mask (Berry) — অফার মূল্য {price} টাকা।", true],
    ],
  },
  {
    id: "top", title: "📢 উপরের বার ও হেডার",
    fields: [
      ["topbar", "একদম উপরের লেখা ([ ] = সোনালি, খালি রাখলে লুকানো)", "🌸 Body + Lip Care — [৩টি প্রোডাক্ট, এক কম্বো, মাত্র ৳{price}]"],
      ["brand_a", "লোগোর প্রথম অংশ", "daily"],
      ["brand_b", "লোগোর রঙিন অংশ", "glow."],
      ["nav_btn", "হেডারের ডান পাশের লিংক", "এখনই অর্ডার করুন →"],
    ],
  },
  {
    id: "hero", title: "⭐ প্রথম অংশ (হিরো)",
    fields: [
      ["eyebrow", "উপরের ছোট ব্যাজ", "✨ YOUR DAILY SELF-CARE ROUTINE"],
      ["hero_title", "বড় হেডিং (Enter = নতুন লাইন, [ ] = গোলাপি)", "নিজের যত্নে\n[একটু বেশি ভালোবাসা]", true],
      ["hero_sub", "হেডিংয়ের নিচের লেখা", "বডি ওয়াশ, বডি অয়েল আর লিপ স্লিপিং মাস্ক—একসাথে আপনার ডেইলি বডি ও লিপ কেয়ার রুটিন।", true],
      ["price_small", "দামের পাশের ছোট লেখা", "মাত্র"],
      ["price_note", "দামের পাশের বর্ণনা", "৩টি প্রোডাক্টের কম্বো মূল্য"],
      ["hero_btn", "অর্ডার বাটন", "🛍️ কম্বোটি অর্ডার করুন"],
      ["hero_btn2", "দ্বিতীয় বাটন (খালি = লুকানো)", "প্রোডাক্ট দেখুন"],
      ["hero_tiny", "বাটনের নিচের ছোট লেখা", "💗 প্রোডাক্টের ছবি ও প্যাক সাইজ নিচে দেওয়া আছে · ডেলিভারি চার্জ আলাদা"],
      ["badge_top", "গোল ব্যাজ — উপরে", "COMBO"],
      ["badge_bottom", "গোল ব্যাজ — নিচে", "৳{price}"],
      ["hero_img1", "হিরোর বাম ছবি", "/images/turmeric/lily-body-wash.webp", "image"],
      ["hero_img2", "হিরোর ডান ছবি", "/images/turmeric/veet-gold-oil.webp", "image"],
      ["hero_img3", "হিরোর মাঝের ছোট ছবি", "/images/turmeric/laneige-lip-mask.webp", "image"],
    ],
    list: { key: "perks", title: "হিরোর নিচের ৩টি ছোট কার্ড", fields: [["icon", "ইমোজি"], ["text", "লেখা"]] },
  },
  {
    id: "products", title: "🧴 কম্বোতে যা থাকছে",
    fields: [
      ["prod_tag", "ছোট লেখা", "WHAT'S INSIDE"],
      ["prod_title", "হেডিং", "আপনার কম্বোতে যা থাকছে"],
      ["prod_sub", "হেডিংয়ের নিচে", "তিনটি আলাদা কেয়ার স্টেপ, একসাথে একটি সহজ রুটিন।"],
    ],
    list: {
      key: "items", title: "প্রোডাক্টগুলো",
      fields: [["image", "ছবি", "image"], ["chip", "উপরের ছোট ট্যাগ"], ["name", "নাম (Enter = নতুন লাইন)", true], ["desc", "বর্ণনা", true], ["facts", "নিচের তথ্যের বক্স", true]],
    },
  },
  {
    id: "routine", title: "🪄 ব্যবহার করবেন যেভাবে",
    fields: [
      ["routine_tag", "ছোট লেখা", "SIMPLE SELF-CARE"],
      ["routine_title", "হেডিং", "ব্যবহার করবেন যেভাবে"],
      ["routine_sub", "হেডিংয়ের নিচে", "বডি ও লিপ কেয়ারের একটি সহজ তিন ধাপের রুটিন।"],
      ["notice", "সতর্কতার বক্স (খালি = লুকানো)", "সতর্কতা: এগুলো কসমেটিক পণ্য, চিকিৎসা নয়। অ্যালার্জি বা জ্বালা হলে ব্যবহার বন্ধ করুন। চোখ ও ক্ষতস্থানে লাগাবেন না। গায়ের রং স্থায়ীভাবে বদলানোর প্রতিশ্রুতি দেওয়া হচ্ছে না।", true],
    ],
    list: { key: "steps", title: "ধাপগুলো", fields: [["title", "ধাপের নাম"], ["text", "বর্ণনা", true]] },
  },
  {
    id: "banner", title: "💝 অফার ব্যানার",
    fields: [
      ["banner_title", "হেডিং (খালি = ব্যানার লুকানো)", "নিজের জন্য, অথবা গিফট হিসেবে 💝"],
      ["banner_text", "লেখা", "৩টি কেয়ার প্রোডাক্টের কম্বো — অফার মূল্য মাত্র ৳{price}"],
      ["banner_btn", "বাটন", "কম্বো অর্ডার করুন →"],
    ],
  },
  {
    id: "order", title: "🛒 অর্ডার সেকশনের উপরের লেখা",
    fields: [
      ["order_tag", "ছোট লেখা", "EASY CHECKOUT"],
      ["order_sub", "হেডিংয়ের নিচে (হেডিং বদলাতে নিচে 📝 অর্ডার ফর্ম দেখুন)", "নাম, মোবাইল ও ঠিকানা লিখে অর্ডার করুন — পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।"],
    ],
  },
  {
    id: "faq", title: "❓ সাধারণ প্রশ্ন (FAQ)",
    fields: [
      ["faq_tag", "ছোট লেখা", "FAQ"],
      ["faq_title", "হেডিং", "সাধারণ কিছু প্রশ্ন"],
    ],
    list: { key: "faq", title: "প্রশ্নগুলো (সব মুছে দিলে FAQ লুকানো)", fields: [["q", "প্রশ্ন"], ["a", "উত্তর", true]] },
  },
  {
    id: "foot", title: "🔻 ফুটারের বর্ণনা ও মোবাইলের নিচের বার",
    fields: [
      ["foot_about", "ফুটারের বাম লেখা", "প্রতিদিনের ছোট্ট সেলফ-কেয়ার রুটিন। এই পেইজে প্রদর্শিত ব্র্যান্ডগুলো নিজ নিজ ট্রেডমার্কের মালিকানাধীন; এটি কোনো অফিসিয়াল ব্র্যান্ড ওয়েবসাইট বলে দাবি করা হচ্ছে না।", true],
      ["foot_note", "ফুটারের ডান লেখা", "অর্ডার দেওয়ার আগে প্যাক সাইজ, স্টক ও ডেলিভারি শর্ত জেনে নিন।", true],
      ["sticky_small", "মোবাইলের নিচের বার — ছোট লেখা (খালি = বার লুকানো)", "কম্বো প্রাইস"],
      ["sticky_btn", "মোবাইলের নিচের বার — বাটন", "🛍️ এখনই অর্ডার করুন"],
    ],
  },
];

const IMG = "/images/turmeric";

export const TURMERIC_LISTS = {
  perks: [
    { icon: "🧴", text: "ডেইলি বডি ক্লেনজিং" },
    { icon: "✨", text: "ময়েশ্চারাইজিং বডি কেয়ার" },
    { icon: "💋", text: "নাইটটাইম লিপ কেয়ার" },
  ],
  items: [
    {
      image: `${IMG}/lily-body-wash.webp`, chip: "STEP 01 • CLEANSE", name: "Lily Whipped Shea\nMystic Glowing Body Wash",
      desc: "শিয়া-ভিত্তিক ক্রিমি বডি ওয়াশ, যা গোসলের সময় শরীর পরিষ্কার করতে এবং ত্বককে নরম অনুভূতি দিতে ডিজাইন করা হয়েছে।",
      facts: "প্যাকেজে 72 Hour Moisture Lock লেখা আছে—এটি ব্র্যান্ডের দাবি, ব্যক্তিভেদে ফল ভিন্ন হতে পারে।",
    },
    {
      image: `${IMG}/veet-gold-oil.webp`, chip: "STEP 02 • MOISTURIZE", name: "Veet Gold Turmeric\nBody Oil",
      desc: "হলুদ-থিমযুক্ত বডি অয়েল, ম্যাসাজ বা গোসলের পর শরীরের ত্বক নরম ও ময়েশ্চারাইজড রাখতে ব্যবহার করা যায়।",
      facts: "সাইজ: ২০০ মিলি\nপ্যাকেজের “Super Whitening” নামটি কোনো নিশ্চিত ত্বক ফর্সা হওয়ার ফলের প্রমাণ নয়।",
    },
    {
      image: `${IMG}/laneige-lip-mask.webp`, chip: "STEP 03 • LIP CARE", name: "LANEIGE Lip Sleeping Mask EX\nBerry",
      desc: "রাতে ব্যবহারের জন্য ময়েশ্চারাইজিং লিপ মাস্ক। শিয়া বাটারসহ ইমোলিয়েন্ট উপাদান শুষ্ক ঠোঁটকে নরম অনুভব করতে সাহায্য করে।",
      facts: "সাইজ: ৩ গ্রাম (মিনি)\nব্যবহার: ঘুমানোর আগে ঠোঁটে লাগান।",
    },
  ],
  steps: [
    { title: "গোসলের সময়", text: "ভেজা শরীরে Lily Body Wash ব্যবহার করে পরিষ্কার পানিতে ধুয়ে ফেলুন।" },
    { title: "গোসলের পরে", text: "পরিষ্কার শরীরের ত্বকে অল্প Veet Gold Body Oil ম্যাসাজ করুন। প্রথমে ছোট জায়গায় পরীক্ষা করুন।" },
    { title: "ঘুমানোর আগে", text: "পরিষ্কার ঠোঁটে LANEIGE Berry Lip Sleeping Mask-এর পাতলা স্তর লাগান।" },
  ],
  faq: [
    { q: "{price} টাকায় কী কী পাব?", a: "১টি Lily Whipped Shea Body Wash, ১টি Veet Gold Turmeric Body Oil (২০০ মিলি), এবং ১টি LANEIGE Lip Sleeping Mask EX Berry (৩ গ্রাম)।" },
    { q: "ডেলিভারি চার্জ কত?", a: "ঢাকা সিটির ভেতরে {inside} টাকা এবং বাইরে {outside} টাকা।" },
    { q: "ক্যাশ অন ডেলিভারি পাওয়া যাবে?", a: "হ্যাঁ, পণ্য হাতে পেয়ে মূল্য পরিশোধ করতে পারবেন।" },
    { q: "সব ধরনের ত্বকে ব্যবহার করা যাবে?", a: "ত্বকের ধরন ও সংবেদনশীলতা ভেদে অভিজ্ঞতা আলাদা হতে পারে। প্রথমে প্যাচ টেস্ট করুন। অ্যালার্জি থাকলে প্যাকের উপাদান যাচাই করুন।" },
    { q: "এগুলো কি ত্বক স্থায়ীভাবে ফর্সা করে?", a: "না, এমন ফলের নির্ভরযোগ্য নিশ্চয়তা দেওয়া হচ্ছে না। এই কম্বোকে মূলত ক্লেনজিং, ময়েশ্চারাইজিং ও লিপ কেয়ার রুটিন হিসেবে দেখানো হয়েছে।" },
  ],
};
