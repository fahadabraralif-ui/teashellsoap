import "server-only";
import { Pool, type PoolClient } from "pg";

export type Queryable = Pick<Pool | PoolClient, "query">;

// One pool per server instance, reused across requests and hot reloads.
const g = globalThis as unknown as { __tsPg?: Pool; __tsPgReady?: Promise<void> };

const SCHEMA = `
create table if not exists ts_meta (id text primary key, data jsonb not null);
create table if not exists ts_orders (id integer primary key, created_at timestamptz not null, data jsonb not null);
create table if not exists ts_incomplete (id text primary key, created_at timestamptz not null, data jsonb not null);
create table if not exists ts_uploads (name text primary key, type text not null, data bytea not null, created_at timestamptz not null default now());
`;

/** Postgres is used when DATABASE_URL is set (Vercel + Neon); otherwise data lives in ./data. */
export function pgEnabled() {
  return Boolean(process.env.DATABASE_URL);
}

export function pool(): Pool {
  g.__tsPg ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 3 });
  return g.__tsPg;
}

/** Creates the tables on first use. Retries once in case two cold starts race on CREATE TABLE. */
export function pgReady(): Promise<void> {
  g.__tsPgReady ??= pool()
    .query(SCHEMA)
    .catch(() => pool().query(SCHEMA))
    .then(() => undefined)
    .catch((e) => {
      g.__tsPgReady = undefined;
      throw e;
    });
  return g.__tsPgReady;
}
