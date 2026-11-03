import type { Metadata, Viewport } from "next";
import { Baloo_Da_2, Hind_Siliguri } from "next/font/google";

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

const baloo = Baloo_Da_2({
  subsets: ["bengali", "latin"],
  weight: ["600", "700", "800"],
  variable: "--font-baloo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TeaShell স্কিন ব্রাইটেনিং সোপ",
  description: "উজ্জ্বল, ফর্সা ও দাগমুক্ত ত্বকের জন্য TeaShell Ceramide Skin Brightening Soap",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#c2185b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${hind.variable} ${baloo.variable}`}>
      <head>
        {/* The admin panel CSS refers to these families by name */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
