import MetaPixel from "@/components/MetaPixel";
import { getPublicSettings } from "@/lib/db";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { marketing } = await getPublicSettings();
  return (
    <>
      {children}
      <MetaPixel pixelId={marketing.pixelId} gtmId={marketing.gtmId} />
    </>
  );
}
