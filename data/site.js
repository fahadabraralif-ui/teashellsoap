// Shob text, price, phone ekhane change korben — page automatic update hobe.
export const site = {
  brand: "TeaShell",
  domain: "TEASHELL",
  phone: "01XXXXXXXXX",
  whatsapp: "8801XXXXXXXXX",

  price: 690,
  oldPrice: 990,

  // Prothom bar database e ei product gulo boshbe — erpor admin panel (Products) theke change korben
  packages: [
    { id: "single", name: "TeaShell স্কিন ব্রাইটেনিং সোপ — ১ পিছ", price: 690, oldPrice: 990 },
    { id: "double", name: "TeaShell স্কিন ব্রাইটেনিং সোপ — ২ পিছ", price: 990, oldPrice: 1980, boxes: 2 },
  ],

  delivery: [
    { id: "inside", label: "ঢাকা সিটির ভেতরে", charge: 60 },
    { id: "outside", label: "ঢাকা সিটির বাহিরে", charge: 120 },
  ],

  // Landing page e: ১ম ছবি = হিরো (মডেল + প্রোডাক্ট), ২য় ছবি = আগে / পরে
  gallery: ["/images/hero.png", "/images/before-after.png"],

  features: [
    { title: "ত্বক করে", text: "উজ্জ্বল ও ফর্সা" },
    { title: "দাগ ও কালো", text: "ছোপ দূর করে" },
    { title: "ত্বককে করে", text: "সুস্থ ও কোমল" },
    { title: "ত্বকের স্বাভাবিক", text: "উজ্জ্বলতা ধরে রাখে" },
  ],

  why: [
    { text: "Ceramide ও Arbutin সমৃদ্ধ" },
    { text: "দাগ, পিগমেন্টেশন কমায়" },
    { text: "ত্বককে করে মসৃণ ও কোমল" },
    { text: "সব ধরনের ত্বকের জন্য উপযোগী" },
  ],

  ingredients: [
    { image: "/images/ing-ceramide.png", name: "Ceramide", note: "(ত্বক সুরক্ষা)" },
    { image: "/images/ing-arbutin.png", name: "Arbutin", note: "(দাগ হ্রাস)" },
    { image: "/images/ing-salicylic.png", name: "Salicylic Acid", note: "(ত্বক পরিষ্কার)" },
  ],

  reviews: [
    { image: "/images/review-1.png", text: "ব্যবহার করার পর সত্যিই ত্বক অনেক উজ্জ্বল হয়েছে!", name: "নুসরাত জাহান" },
    { image: "/images/review-2.png", text: "দাগ কমছে, ত্বক এখন অনেক ফর্সা ও মসৃণ!", name: "তানিয়া আক্তার" },
    { image: "/images/review-3.png", text: "দারুণ প্রোডাক্ট! অবশ্যই আবার নিবো!", name: "সুমাইয়া ইসলাম" },
  ],
};

// ইংরেজি সংখ্যা → বাংলা সংখ্যা (৯৯০, ১,৪৯৯)
export const bn = (n) => Number(n).toLocaleString("en-IN").replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
export const tk = (n) => Number(n).toLocaleString("en-IN") + ".00";
