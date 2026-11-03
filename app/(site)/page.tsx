import type { Metadata } from "next";
import Landing from "@/components/landing/Landing";
import { getPublicSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { content, product } = await getPublicSettings();
  return {
    title: content.siteTitle,
    description: content.heroSubtitle,
    openGraph: { title: content.siteTitle, description: content.heroSubtitle, images: [product.image] },
  };
}

export default async function Home() {
  return <Landing settings={await getPublicSettings()} />;
}
