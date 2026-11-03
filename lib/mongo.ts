import "server-only";
import { MongoClient, type Db } from "mongodb";

// One client per server instance, reused across requests and hot reloads.
const g = globalThis as unknown as { __tsMongo?: Promise<MongoClient> };

/** MongoDB is used when MONGODB_URI is set (e.g. on Vercel); otherwise data lives in ./data. */
export function mongoEnabled() {
  return Boolean(process.env.MONGODB_URI);
}

export async function mongo(): Promise<Db> {
  g.__tsMongo ??= new MongoClient(process.env.MONGODB_URI!).connect().catch((e) => {
    g.__tsMongo = undefined;
    throw e;
  });
  return (await g.__tsMongo).db(process.env.MONGODB_DB || "teashell");
}
