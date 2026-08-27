import "server-only";

import { Pool } from "pg";

let tablesInitialized = false;

export async function ensureDatabaseSchema(pool: Pool): Promise<void> {
  if (tablesInitialized) return;

  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        ticket_id VARCHAR(50) UNIQUE NOT NULL,
        osticket_ticket_id VARCHAR(50),
        osticket_number VARCHAR(50),
        customer_name VARCHAR(120) NOT NULL,
        customer_phone VARCHAR(50) NOT NULL,
        customer_email VARCHAR(160) NOT NULL,
        service_area VARCHAR(120) NOT NULL,
        service_details_json JSONB NOT NULL,
        pickup_datetime TIMESTAMPTZ NOT NULL,
        delivery_datetime TIMESTAMPTZ NOT NULL,
        address TEXT NOT NULL,
        special_instructions TEXT,
        price_total_ke NUMERIC(10, 2) NOT NULL,
        payment_option VARCHAR(50) NOT NULL,
        payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
        status VARCHAR(50) NOT NULL DEFAULT 'NEW',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS order_status_history (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        old_status VARCHAR(50),
        new_status VARCHAR(50) NOT NULL,
        changed_by VARCHAR(100) NOT NULL,
        changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        channel VARCHAR(50) NOT NULL,
        recipient VARCHAR(160) NOT NULL,
        status VARCHAR(50) NOT NULL,
        provider_message_id VARCHAR(100),
        error_message TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS customer_feedback (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(120) NOT NULL,
        location_area VARCHAR(120) NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        service_type VARCHAR(120) NOT NULL,
        review_text TEXT NOT NULL,
        approved BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    tablesInitialized = true;
  } catch (error) {
    console.warn("[FreshFlow DB] Table auto-migration notice:", error);
  } finally {
    client.release();
  }
}
