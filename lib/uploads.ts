import "server-only";
import fs from "fs/promises";
import path from "path";
import { Binary } from "mongodb";
import { UPLOAD_DIR } from "./db";
import { mongo, mongoEnabled } from "./mongo";

type UploadDoc = { _id: string; type: string; data: Binary; createdAt: Date };

export async function saveUpload(name: string, type: string, data: Buffer) {
  if (mongoEnabled()) {
    await (await mongo()).collection<UploadDoc>("uploads").insertOne({ _id: name, type, data: new Binary(data), createdAt: new Date() });
    return;
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), data);
}

export async function getUpload(name: string): Promise<Uint8Array | null> {
  if (mongoEnabled()) {
    const doc = await (await mongo()).collection<UploadDoc>("uploads").findOne({ _id: name });
    return doc ? new Uint8Array(doc.data.buffer) : null;
  }
  try {
    return new Uint8Array(await fs.readFile(path.join(UPLOAD_DIR, name)));
  } catch {
    return null;
  }
}
