import "server-only";

import { Pool, type PoolClient, type QueryResultRow } from "pg";

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
          : undefined,
    });
  }

  return globalThis.freshFlowPool;
}

export async function query<T extends QueryResultRow>(
  text: string,
  values: unknown[] = [],
) {
  return getPool().query<T>(text, values);
}

export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>,
) {
  const client = await getPool().connect();

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
