import { NextResponse } from "next/server";
import { createSessionToken, guard, SESSION_COOKIE } from "@/lib/auth";
import { readMeta, updateDB } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const { current, next } = await req.json().catch(() => ({}));
  const { admin } = await readMeta();
  if (!verifyPassword(String(current || ""), admin.passwordHash)) {
    return NextResponse.json({ error: "বর্তমান পাসওয়ার্ড ভুল" }, { status: 400 });
  }
  if (String(next || "").length < 6) {
    return NextResponse.json({ error: "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" }, { status: 400 });
  }
  await updateDB((db) => {
    db.admin.passwordHash = hashPassword(String(next));
  });
  // Old sessions are now invalid; issue a fresh one for this browser.
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
