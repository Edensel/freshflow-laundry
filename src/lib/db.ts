import "server-only";

import { Pool, type PoolClient, type QueryResultRow } from "pg";
import { ensureDatabaseSchema } from "@/lib/db-init";

declare global {
  var freshFlowPool: Pool | undefined;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.");
  }

  if (!globalThis.freshFlowPool) {
    globalThis.freshFlowPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.DATABASE_POOL_MAX || 10),
      ssl:
        process.env.DATABASE_SSL === "true"
          ? { rejectUnauthorized: false }
          : { rejectUnauthorized: false },
    });
  }

  return globalThis.freshFlowPool;
}

export async function query<T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
) {
  const pool = getPool();
  await ensureDatabaseSchema(pool);
  return pool.query<T>(text, values);
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>,
) {
  const pool = getPool();
  await ensureDatabaseSchema(pool);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
