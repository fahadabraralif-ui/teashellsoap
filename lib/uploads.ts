import "server-only";
import fs from "fs/promises";
import path from "path";
import { UPLOAD_DIR } from "./db";
import { pgEnabled, pgReady, pool } from "./pg";

export async function saveUpload(name: string, type: string, data: Buffer) {
  if (pgEnabled()) {
    await pgReady();
    await pool().query("insert into ts_uploads (name, type, data) values ($1, $2, $3)", [name, type, data]);
    return;
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), data);
}

export async function getUpload(name: string): Promise<Uint8Array | null> {
  if (pgEnabled()) {
    await pgReady();
    const row = (await pool().query<{ data: Buffer }>("select data from ts_uploads where name = $1", [name])).rows[0];
    return row ? new Uint8Array(row.data) : null;
  }
  try {
    return new Uint8Array(await fs.readFile(path.join(UPLOAD_DIR, name)));
  } catch {
    return null;
  }
}
