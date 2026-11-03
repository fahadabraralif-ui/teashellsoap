import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import { randomBytes } from "crypto";
import path from "path";
import { isAdmin } from "@/lib/auth";

const MAX = 4 * 1024 * 1024;

// BLOB_READ_WRITE_TOKEN na thakle (local dev) public/uploads e save kore
async function saveLocal(folder, name, file) {
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  const fileName = name.replace(".", `-${randomBytes(6).toString("hex")}.`);
  await writeFile(path.join(dir, fileName), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${fileName}`;
}

// Admin panel theke chobi upload — browser age chobi choto (webp) kore pathay
export async function POST(req) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!file || typeof file === "string") return Response.json({ error: "কোনো ফাইল পাওয়া যায়নি" }, { status: 400 });
  // "voice" folder e shudhu audio, baki shob jaygay shudhu chobi
  const folder = ["banners", "logo", "voice"].includes(form.get("folder")) ? form.get("folder") : "products";
  const isVoice = folder === "voice";
  if (isVoice ? !file.type.startsWith("audio/") : !file.type.startsWith("image/")) {
    return Response.json({ error: isVoice ? "শুধু অডিও ফাইল (MP3) আপলোড করা যাবে" : "শুধু ছবি আপলোড করা যাবে" }, { status: 400 });
  }
  if (file.size > MAX) return Response.json({ error: "ফাইল ৪ MB এর বেশি" }, { status: 400 });

  const ext = (file.type.split("/")[1] || "bin").replace("jpeg", "jpg").replace("mpeg", "mp3").replace("x-m4a", "m4a");
  const name = `${isVoice ? "voice" : "image"}.${ext}`;
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ url: await saveLocal(folder, name, file) });
    const blob = await put(`${folder}/${name}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return Response.json({ url: blob.url });
  } catch (err) {
    console.error("Upload failed", err);
    return Response.json({ error: "আপলোড হয়নি, আবার চেষ্টা করুন" }, { status: 500 });
  }
}
