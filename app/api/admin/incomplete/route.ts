import { NextResponse } from "next/server";
import { guard } from "@/lib/auth";
import { readDB, updateDB } from "@/lib/db";

export async function GET() {
  const denied = await guard();
  if (denied) return denied;
  const { incomplete } = await readDB();
  return NextResponse.json({ incomplete });
}

/** { ids: string[] } — also used after converting an entry into an order. */
export async function DELETE(req: Request) {
  const denied = await guard();
  if (denied) return denied;
  const { ids } = await req.json().catch(() => ({}));
  if (!Array.isArray(ids)) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  await updateDB((db) => {
    db.incomplete = db.incomplete.filter((i) => !ids.includes(i.id));
  });
  return NextResponse.json({ ok: true });
}
