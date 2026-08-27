import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { query, isDatabaseConfigured } from "@/lib/db";

export type FeedbackItem = {
  id: number;
  customerName: string;
  locationArea: string;
  rating: number;
  serviceType: string;
  reviewText: string;
  approved: boolean;
  createdAt: string;
};

type FeedbackRow = {
  id: number | string;
  customer_name: string;
  location_area: string;
  rating: number;
  service_type: string;
  review_text: string;
  approved: boolean;
  created_at: Date;
};

const demoDataPath = path.join(process.cwd(), ".data", "demo-orders.json");

async function readDemoFeedback(): Promise<FeedbackItem[]> {
  try {
    const raw = await readFile(demoDataPath, "utf-8");
    const parsed = JSON.parse(raw);
    return (parsed.feedback || []) as FeedbackItem[];
  } catch {
    return [];
  }
}

async function writeDemoFeedback(items: FeedbackItem[]): Promise<void> {
  let parsed: Record<string, unknown> = {};
  try {
    const raw = await readFile(demoDataPath, "utf-8");
    parsed = JSON.parse(raw);
  } catch {
    try {
      await mkdir(path.dirname(demoDataPath), { recursive: true });
    } catch {
      // Ignore
    }
  }

  parsed.feedback = items;
  try {
    await writeFile(demoDataPath, JSON.stringify(parsed, null, 2), "utf-8");
  } catch {
    // Ignore write error on read-only serverless environment
  }
}

function mapRow(row: FeedbackRow): FeedbackItem {
  return {
    id: Number(row.id),
    customerName: row.customer_name,
    locationArea: row.location_area,
    rating: Number(row.rating),
    serviceType: row.service_type,
    reviewText: row.review_text,
    approved: Boolean(row.approved),
    createdAt: row.created_at.toISOString(),
  };
}

export async function submitFeedback(input: {
  customerName: string;
  locationArea: string;
  rating: number;
  serviceType: string;
  reviewText: string;
}): Promise<FeedbackItem> {
  if (isDatabaseConfigured()) {
    try {
      const result = await query<FeedbackRow>(
        `
          INSERT INTO customer_feedback (customer_name, location_area, rating, service_type, review_text, approved)
          VALUES ($1, $2, $3, $4, $5, false)
          RETURNING *
        `,
        [
          input.customerName,
          input.locationArea,
          input.rating,
          input.serviceType,
          input.reviewText,
        ]
      );

      if (result.rows[0]) {
        return mapRow(result.rows[0]);
      }
    } catch {
      // Fallback to demo file
    }
  }

  const list = await readDemoFeedback();
  const nextId = Math.max(0, ...list.map((f) => f.id)) + 1;
  const now = new Date().toISOString();

  const item: FeedbackItem = {
    id: nextId,
    customerName: input.customerName,
    locationArea: input.locationArea,
    rating: input.rating,
    serviceType: input.serviceType,
    reviewText: input.reviewText,
    approved: false,
    createdAt: now,
  };

  list.push(item);
  await writeDemoFeedback(list);
  return item;
}

export async function getApprovedFeedback(): Promise<FeedbackItem[]> {
  if (isDatabaseConfigured()) {
    try {
      const result = await query<FeedbackRow>(
        `
          SELECT * FROM customer_feedback
          WHERE approved = true
          ORDER BY created_at DESC
          LIMIT 50
        `
      );
      return result.rows.map(mapRow);
    } catch {
      // Fallback
    }
  }

  const list = await readDemoFeedback();
  return list
    .filter((f) => f.approved)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listAllFeedback(): Promise<FeedbackItem[]> {
  if (isDatabaseConfigured()) {
    try {
      const result = await query<FeedbackRow>(
        `
          SELECT * FROM customer_feedback
          ORDER BY approved ASC, created_at DESC
          LIMIT 100
        `
      );
      return result.rows.map(mapRow);
    } catch {
      // Fallback
    }
  }

  const list = await readDemoFeedback();
  return list.sort((a, b) => {
    if (a.approved !== b.approved) return a.approved ? 1 : -1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export async function approveFeedback(id: number): Promise<boolean> {
  if (isDatabaseConfigured()) {
    try {
      const result = await query(
        `UPDATE customer_feedback SET approved = true WHERE id = $1`,
        [id]
      );
      if (result.rowCount && result.rowCount > 0) return true;
    } catch {
      // Fallback
    }
  }

  const list = await readDemoFeedback();
  const target = list.find((f) => f.id === id);
  if (target) {
    target.approved = true;
    await writeDemoFeedback(list);
    return true;
  }
  return false;
}

export async function deleteFeedback(id: number): Promise<boolean> {
  if (isDatabaseConfigured()) {
    try {
      const result = await query(`DELETE FROM customer_feedback WHERE id = $1`, [id]);
      if (result.rowCount && result.rowCount > 0) return true;
    } catch {
      // Fallback
    }
  }

  const list = await readDemoFeedback();
  const next = list.filter((f) => f.id !== id);
  if (next.length !== list.length) {
    await writeDemoFeedback(next);
    return true;
  }
  return false;
}
