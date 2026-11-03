import { NextResponse } from "next/server";
import { guard } from "@/lib/auth";
import { refreshSteadfast, sendToSteadfast } from "@/lib/admin-actions";
import { readDB } from "@/lib/db";
import { steadfastBalance, steadfastConfigured } from "@/lib/orders";

/** { action: "send" | "status", ids } or { action: "balance" } */
export async function POST(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const { action, ids } = await req.json().catch(() => ({}));

  if (action === "balance") {
    const { settings } = await readDB();
    if (!steadfastConfigured(settings)) return NextResponse.json({ error: "API key / Secret key দিন" }, { status: 400 });
    try {
      return NextResponse.json({ balance: await steadfastBalance(settings) });
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 502 });
    }
  }

  if (!Array.isArray(ids) || !ids.length) return NextResponse.json({ error: "কোনো অর্ডার সিলেক্ট করা হয়নি" }, { status: 400 });
  const results = action === "status" ? await refreshSteadfast(ids.map(Number)) : await sendToSteadfast(ids.map(Number));
  return NextResponse.json({ results });
}
