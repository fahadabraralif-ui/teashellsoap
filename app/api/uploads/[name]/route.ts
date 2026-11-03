import path from "path";
import { getUpload } from "@/lib/uploads";

const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const safe = path.basename(name);
  const type = TYPES[path.extname(safe).toLowerCase()];
  if (!type || safe !== name) return new Response("Not found", { status: 404 });
  const file = await getUpload(safe);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(file, {
    headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
