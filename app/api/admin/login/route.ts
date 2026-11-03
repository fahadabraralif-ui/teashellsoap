import { NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth";
import { readMeta } from "@/lib/db";
import { clientIp } from "@/lib/orders";
import { verifyPassword } from "@/lib/password";

const attempts = new Map<string, { count: number; until: number }>();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60_000;

export async function POST(req: Request) {
  const ip = clientIp(req) || "local";
  const entry = attempts.get(ip);
  if (entry && entry.count >= MAX_ATTEMPTS && entry.until > Date.now()) {
    return NextResponse.json({ error: "অনেকবার ভুল পাসওয়ার্ড দেওয়া হয়েছে। ১৫ মিনিট পর চেষ্টা করুন।" }, { status: 429 });
  }

  const { password } = await req.json().catch(() => ({ password: "" }));
  const { admin } = await readMeta();
  if (!password || !verifyPassword(String(password), admin.passwordHash)) {
    const count = (entry && entry.until > Date.now() ? entry.count : 0) + 1;
    attempts.set(ip, { count, until: Date.now() + LOCK_MS });
    return NextResponse.json({ error: "ভুল পাসওয়ার্ড" }, { status: 401 });
  }

  attempts.delete(ip);
  const { token, maxAge } = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return res;
}
