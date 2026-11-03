import crypto from "crypto";
import { NextResponse } from "next/server";
import { guard } from "@/lib/auth";
import { saveUpload } from "@/lib/uploads";

const ALLOWED: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "কোনো ফাইল নেই" }, { status: 400 });
  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: "শুধু PNG, JPG, WEBP বা GIF ছবি" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "ছবি ৫MB এর বেশি হতে পারবে না" }, { status: 400 });

  const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  await saveUpload(name, file.type, Buffer.from(await file.arrayBuffer()));
  return NextResponse.json({ url: `/api/uploads/${name}` });
}
