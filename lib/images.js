import { del } from "@vercel/blob";
import { unlink } from "fs/promises";
import path from "path";

// Shudhu amader Blob store e upload kora chobi muche — /images/... (project er nijer chobi) ke hat dey na
const isBlob = (url) => /^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(url || "");
// Token chara local e save kora file (/uploads/...)
const isLocal = (url) => /^\/uploads\/[\w-]+\/[\w.-]+$/.test(url || "");

export async function deleteImages(urls) {
  const list = urls.filter(isBlob);
  const local = urls.filter(isLocal);
  await Promise.all(local.map((u) => unlink(path.join(process.cwd(), "public", u)).catch(() => {})));
  if (!list.length) return;
  try {
    await del(list);
  } catch (err) {
    console.error("Image delete failed", err);
  }
}
