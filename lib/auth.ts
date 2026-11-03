import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { readMeta } from "./db";

export const SESSION_COOKIE = "ts_admin";
const SESSION_DAYS = 7;

function sign(payload: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export async function createSessionToken(): Promise<{ token: string; maxAge: number }> {
  const { admin } = await readMeta();
  const maxAge = SESSION_DAYS * 24 * 60 * 60;
  const exp = Date.now() + maxAge * 1000;
  // Tie the token to the current password hash so changing the password logs out other sessions.
  const payload = `${exp}`;
  return { token: `${payload}.${sign(payload + admin.passwordHash, admin.sessionSecret)}`, maxAge };
}

export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const { admin } = await readMeta();
  const expected = sign(exp + admin.passwordHash, admin.sessionSecret);
  return sig.length === expected.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

/** Returns a 401 response when not logged in, otherwise null. */
export async function guard(): Promise<NextResponse | null> {
  return (await isAdmin()) ? null : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
