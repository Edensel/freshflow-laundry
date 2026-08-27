import "server-only";

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { query, transaction, isDatabaseConfigured } from "@/lib/db";
import {
  statusLabels,
  statusSteps,
  type PaymentOption,
} from "@/lib/business";
import type { BookingInput } from "@/lib/validation";
import type { Quote } from "@/lib/pricing";

export type OrderStatus = (typeof statusSteps)[number];

export type Order = {
  id: number;
  ticketId: string;
  osTicketTicketId: string | null;
  osTicketNumber: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceArea: string;
  serviceDetails: Quote;
  pickupDatetime: string;
  deliveryDatetime: string;
  address: string;
  specialInstructions: string;
  priceTotalKe: number;
  paymentOption: PaymentOption;
  paymentStatus: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type StatusHistoryItem = {
  id: number;
  orderId: number;
  oldStatus: OrderStatus | null;
  newStatus: OrderStatus;
  changedBy: string;
  changedAt: string;
  notes: string | null;
};

type OrderRow = {
  id: number | string;
  ticket_id: string;
  osticket_ticket_id: string | null;
  osticket_number: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  service_area: string;
  service_details_json: Quote;
  pickup_datetime: Date;
  delivery_datetime: Date;
  address: string;
  special_instructions: string;
  price_total_ke: number | string;
  payment_option: PaymentOption;
  payment_status: string;
  status: OrderStatus;
  created_at: Date;
  updated_at: Date;
};

export type NotificationStatus = "SENT" | "FAILED" | "SKIPPED";

export type NotificationItem = {
  id: number;
  orderId: number | null;
  channel: string;
  recipient: string;
  status: NotificationStatus;
  providerMessageId: string | null;
  errorMessage: string | null;
  createdAt: string;
};

type DemoData = {
  orders: Order[];
  history: StatusHistoryItem[];
  notifications: NotificationItem[];
};

const demoDataPath = path.join(process.cwd(), ".data", "demo-orders.json");

let dbWarningLogged = false;

function logDbFallback(context: string) {
  if (!dbWarningLogged) {
    dbWarningLogged = true;
    console.info(
      `[FreshFlow] PostgreSQL is not reachable during ${context}. Running seamlessly in Demo Mode (.data/demo-orders.json). Run 'npm run db:start' if you wish to enable local PostgreSQL.`
    );
  }
}

function makeTicketId(id: number | string, dateInput?: Date | string) {
  const date = dateInput ? new Date(dateInput) : new Date();
  const year = date.getFullYear();
  const paddedId = String(id).padStart(5, "0");
  return `FFL-KE-${year}-${paddedId}`;
}

function mapOrder(row: OrderRow): Order {
  return {
    id: Number(row.id),
    ticketId: row.ticket_id,
    osTicketTicketId: row.osticket_ticket_id,
    osTicketNumber: row.osticket_number,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    serviceArea: row.service_area,
    serviceDetails: row.service_details_json,
    pickupDatetime: row.pickup_datetime.toISOString(),
    deliveryDatetime: row.delivery_datetime.toISOString(),
    address: row.address,
    specialInstructions: row.special_instructions || "",
    priceTotalKe: Number(row.price_total_ke),
    paymentOption: row.payment_option,
    paymentStatus: row.payment_status,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

async function ensureDemoDataFile(): Promise<DemoData> {
  try {
    const raw = await readFile(demoDataPath, "utf-8");
    return JSON.parse(raw) as DemoData;
  } catch {
    const defaultData: DemoData = {
      orders: [],
      history: [],
      notifications: [],
    };
    await mkdir(path.dirname(demoDataPath), { recursive: true });
    await writeFile(demoDataPath, JSON.stringify(defaultData, null, 2), "utf-8");
    return defaultData;
  }
}

async function readDemoData(): Promise<DemoData> {
  return ensureDemoDataFile();
}

async function writeDemoData(data: DemoData): Promise<void> {
  await mkdir(path.dirname(demoDataPath), { recursive: true });
  await writeFile(demoDataPath, JSON.stringify(data, null, 2), "utf-8");
}

async function createDemoOrder(input: BookingInput, quote: Quote): Promise<Order> {
  const data = await readDemoData();
  const nextId = Math.max(0, ...data.orders.map((o) => o.id)) + 1;
  const now = new Date().toISOString();
  const ticketId = makeTicketId(nextId, now);

  const order: Order = {
    id: nextId,
    ticketId,
    osTicketTicketId: null,
    osTicketNumber: null,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail,
    serviceArea: input.serviceArea,
    serviceDetails: quote,
    pickupDatetime: new Date(input.pickupSlot).toISOString(),
    deliveryDatetime: new Date(input.deliverySlot).toISOString(),
    address: input.address,
    specialInstructions: input.specialInstructions || "",
    priceTotalKe: quote.totalKe,
    paymentOption: input.paymentOption,
    paymentStatus: "PENDING",
    status: "NEW",
    createdAt: now,
    updatedAt: now,
  };

  data.orders.push(order);
  data.history.push({
    id: Math.max(0, ...data.history.map((h) => h.id)) + 1,
    orderId: order.id,
    oldStatus: null,
    newStatus: "NEW",
    changedBy: "system",
    changedAt: now,
    notes: "Order created from website booking flow.",
  });

  await writeDemoData(data);
  return order;
}

export async function createOrder(input: BookingInput, quote: Quote) {
  if (isDatabaseConfigured()) {
    try {
      return await transaction(async (client) => {
        const inserted = await client.query<OrderRow>(
          `
            INSERT INTO orders (
              customer_name,
              customer_phone,
              customer_email,
              service_area,
              service_details_json,
              pickup_datetime,
              delivery_datetime,
              address,
              special_instructions,
              price_total_ke,
              payment_option,
              payment_status,
              status,
              consent_email_updates
            )
            VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8, $9, $10, $11, 'PENDING', 'NEW', $12)
            RETURNING *
          `,
          [
            input.customerName,
            input.customerPhone,
            input.customerEmail,
            input.serviceArea,
            JSON.stringify(quote),
            input.pickupSlot,
            input.deliverySlot,
            input.address,
            input.specialInstructions,
            quote.totalKe,
            input.paymentOption,
            input.consentUpdates,
          ],
        );

        const row = inserted.rows[0];
        const ticketId = makeTicketId(row.id, row.created_at);

        const updated = await client.query<OrderRow>(
          "UPDATE orders SET ticket_id = $1 WHERE id = $2 RETURNING *",
          [ticketId, row.id],
        );

        await client.query(
          `
            INSERT INTO order_status_history
              (order_id, old_status, new_status, changed_by, notes)
            VALUES ($1, NULL, 'NEW', 'system', 'Order created from website booking flow.')
          `,
          [row.id],
        );

        return mapOrder(updated.rows[0]);
      });
    } catch {
      logDbFallback("createOrder");
    }
  }

  return createDemoOrder(input, quote);
}

export async function updateOrderExternalTicket(
  orderId: number,
  osTicketTicketId: string | null,
  osTicketNumber: string | null,
) {
  if (isDatabaseConfigured()) {
    try {
      const result = await query<OrderRow>(
        `
          UPDATE orders
          SET osticket_ticket_id = $2, osticket_number = $3, updated_at = now()
          WHERE id = $1
          RETURNING *
        `,
        [orderId, osTicketTicketId, osTicketNumber],
      );

      return result.rows[0] ? mapOrder(result.rows[0]) : null;
    } catch {
      logDbFallback("updateOrderExternalTicket");
    }
  }

  const data = await readDemoData();
  const order = data.orders.find((item) => item.id === orderId);

  if (!order) {
    return null;
  }

  order.osTicketTicketId = osTicketTicketId;
  order.osTicketNumber = osTicketNumber;
  order.updatedAt = new Date().toISOString();
  await writeDemoData(data);

  return order;
}

export async function countOrdersForPickupSlot(slotIso: string) {
  if (isDatabaseConfigured()) {
    try {
      const result = await query<{ count: string }>(
        `
          SELECT COUNT(*)::text AS count
          FROM orders
          WHERE pickup_datetime = $1
            AND status NOT IN ('COMPLETED', 'CANCELLED')
        `,
        [slotIso],
      );

      return Number(result.rows[0]?.count || 0);
    } catch {
      logDbFallback("countOrdersForPickupSlot");
    }
  }

  const data = await readDemoData();
  const targetSlot = new Date(slotIso).toISOString();

  return data.orders.filter(
    (order) =>
      order.pickupDatetime === targetSlot && order.status !== "COMPLETED",
  ).length;
}

export async function findOrderForTracking(params: {
  ticketId?: string;
  email?: string;
  phone?: string;
}) {
  if (isDatabaseConfigured()) {
    try {
      if (params.ticketId) {
        const result = await query<OrderRow>(
          "SELECT * FROM orders WHERE upper(ticket_id) = upper($1) LIMIT 1",
          [params.ticketId.trim()],
        );

        if (result.rows[0]) return mapOrder(result.rows[0]);
      }

      if (params.email && params.phone) {
        const result = await query<OrderRow>(
          `
            SELECT *
            FROM orders
            WHERE lower(customer_email) = lower($1)
              AND customer_phone = $2
            ORDER BY created_at DESC
            LIMIT 1
          `,
          [params.email.trim(), params.phone.trim()],
        );

        if (result.rows[0]) return mapOrder(result.rows[0]);
      }
    } catch {
      logDbFallback("findOrderForTracking");
    }
  }

  const data = await readDemoData();

  if (params.ticketId) {
    return (
      data.orders.find(
        (order) =>
          order.ticketId.toLowerCase() === params.ticketId?.toLowerCase(),
      ) || null
    );
  }

  if (params.phone) {
    const matchByPhone = data.orders
      .filter((order) => order.customerPhone === params.phone)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    if (matchByPhone) return matchByPhone;
  }

  if (params.email && params.phone) {
    return (
      data.orders
        .filter(
          (order) =>
            order.customerEmail.toLowerCase() === params.email?.toLowerCase() &&
            order.customerPhone === params.phone,
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] || null
    );
  }

  return null;
}

export async function getOrderStatusHistory(orderId: number) {
  if (isDatabaseConfigured()) {
    try {
      const result = await query<{
        id: number | string;
        order_id: number | string;
        old_status: OrderStatus | null;
        new_status: OrderStatus;
        changed_by: string;
        changed_at: Date;
        notes: string | null;
      }>(
        `
          SELECT *
          FROM order_status_history
          WHERE order_id = $1
          ORDER BY changed_at ASC
        `,
        [orderId],
      );

      return result.rows.map((row) => ({
        id: Number(row.id),
        orderId: Number(row.order_id),
        oldStatus: row.old_status,
        newStatus: row.new_status,
        changedBy: row.changed_by,
        changedAt: row.changed_at.toISOString(),
        notes: row.notes,
      }));
    } catch {
      logDbFallback("getOrderStatusHistory");
    }
  }

  const data = await readDemoData();
  return data.history
    .filter((item) => item.orderId === orderId)
    .sort((a, b) => a.changedAt.localeCompare(b.changedAt));
}

export async function listRecentOrders(status?: OrderStatus) {
  if (isDatabaseConfigured()) {
    try {
      const result = await query<OrderRow>(
        `
          SELECT *
          FROM orders
          WHERE ($1::text IS NULL OR status = $1)
          ORDER BY created_at DESC
          LIMIT 100
        `,
        [status || null],
      );

      return result.rows.map(mapOrder);
    } catch {
      logDbFallback("listRecentOrders");
    }
  }

  const data = await readDemoData();
  return data.orders
    .filter((order) => !status || order.status === status)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 100);
}

export async function updateOrderStatus(params: {
  orderId: number;
  newStatus: OrderStatus;
  changedBy: string;
  notes?: string;
}) {
  if (isDatabaseConfigured()) {
    try {
      return await transaction(async (client) => {
        const existing = await client.query<OrderRow>(
          "SELECT * FROM orders WHERE id = $1 FOR UPDATE",
          [params.orderId],
        );
        const current = existing.rows[0];

        if (!current) {
          return null;
        }

        const updated = await client.query<OrderRow>(
          `
            UPDATE orders
            SET status = $2, updated_at = now()
            WHERE id = $1
            RETURNING *
          `,
          [params.orderId, params.newStatus],
        );

        await client.query(
          `
            INSERT INTO order_status_history
              (order_id, old_status, new_status, changed_by, notes)
            VALUES ($1, $2, $3, $4, $5)
          `,
          [
            params.orderId,
            current.status,
            params.newStatus,
            params.changedBy,
            params.notes ||
              `Status changed from ${statusLabels[current.status]} to ${statusLabels[params.newStatus]}.`,
          ],
        );

        return mapOrder(updated.rows[0]);
      });
    } catch {
      logDbFallback("updateOrderStatus");
    }
  }

  const data = await readDemoData();
  const order = data.orders.find((item) => item.id === params.orderId);

  if (!order) {
    return null;
  }

  const oldStatus = order.status;
  const now = new Date().toISOString();
  order.status = params.newStatus;
  order.updatedAt = now;
  data.history.push({
    id: Math.max(0, ...data.history.map((item) => item.id)) + 1,
    orderId: order.id,
    oldStatus,
    newStatus: params.newStatus,
    changedBy: params.changedBy,
    changedAt: now,
    notes:
      params.notes ||
      `Status changed from ${statusLabels[oldStatus]} to ${statusLabels[params.newStatus]}.`,
  });
  await writeDemoData(data);

  return order;
}

export async function logNotification(params: {
  orderId: number;
  channel: string;
  recipient: string;
  status: NotificationStatus;
  providerMessageId?: string | null;
  errorMessage?: string | null;
}) {
  if (isDatabaseConfigured()) {
    try {
      await query(
        `
          INSERT INTO notifications_log (
            order_id,
            channel,
            recipient,
            status,
            provider_message_id,
            error_message
          )
          VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          params.orderId,
          params.channel,
          params.recipient,
          params.status,
          params.providerMessageId || null,
          params.errorMessage || null,
        ],
      );
      return;
    } catch {
      logDbFallback("logNotification");
    }
  }

  const data = await readDemoData();

  data.notifications.push({
    id: Math.max(0, ...data.notifications.map((item) => item.id)) + 1,
    orderId: params.orderId || null,
    channel: params.channel,
    recipient: params.recipient,
    status: params.status,
    providerMessageId: params.providerMessageId || null,
    errorMessage: params.errorMessage || null,
    createdAt: new Date().toISOString(),
  });
  await writeDemoData(data);
}

export async function getPublicMetrics() {
  if (isDatabaseConfigured()) {
    try {
      const result = await query<{
        orders_today: string;
        in_progress: string;
        completed_30_days: string;
        avg_turnaround_hours: string | null;
      }>(
        `
          SELECT
            COUNT(*) FILTER (WHERE created_at::date = now()::date)::text AS orders_today,
            COUNT(*) FILTER (WHERE status IN ('NEW', 'PICKED_UP', 'IN_PROGRESS', 'READY', 'OUT_FOR_DELIVERY'))::text AS in_progress,
            COUNT(*) FILTER (WHERE status = 'COMPLETED' AND created_at >= now() - interval '30 days')::text AS completed_30_days,
            ROUND(
              (AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600))::numeric,
              1
            )::text AS avg_turnaround_hours
          FROM orders
        `,
      );

      const row = result.rows[0];

      return {
        ordersToday: Number(row.orders_today),
        inProgress: Number(row.in_progress),
        completed30Days: Number(row.completed_30_days),
        averageTurnaroundHours: row.avg_turnaround_hours
          ? Number(row.avg_turnaround_hours)
          : null,
      };
    } catch {
      logDbFallback("getPublicMetrics");
    }
  }

  const data = await readDemoData();
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Africa/Nairobi",
  });
  const completedOrders = data.orders.filter(
    (order) => order.status === "COMPLETED",
  );
  const averageTurnaroundHours =
    completedOrders.length > 0
      ? Math.round(
          (completedOrders.reduce(
            (sum, order) =>
              sum +
              (new Date(order.updatedAt).getTime() -
                new Date(order.createdAt).getTime()) /
                3600000,
            0,
          ) /
            completedOrders.length) *
            10,
        ) / 10
      : null;

  return {
    ordersToday: data.orders.filter(
      (order) =>
        new Date(order.createdAt).toLocaleDateString("en-CA", {
          timeZone: "Africa/Nairobi",
        }) === today,
    ).length,
    inProgress: data.orders.filter((order) =>
      [
        "NEW",
        "PICKED_UP",
        "IN_PROGRESS",
        "READY",
        "OUT_FOR_DELIVERY",
      ].includes(order.status),
    ).length,
    completed30Days: completedOrders.length,
    averageTurnaroundHours,
  };
}
