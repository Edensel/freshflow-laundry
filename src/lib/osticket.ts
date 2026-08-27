import "server-only";

import {
  formatKes,
  paymentInstructions,
  paymentOptions,
  statusLabels,
} from "@/lib/business";
import type { Order } from "@/lib/orders";

export type OsTicketResult =
  | {
      status: "created";
      externalId: string | null;
      number: string | null;
    }
  | {
      status: "skipped";
      reason: string;
    };

function osTicketConfigured() {
  return Boolean(process.env.OSTICKET_API_URL && process.env.OSTICKET_API_KEY);
}

function orderMessage(order: Order) {
  const paymentLabel =
    paymentOptions.find((option) => option.id === order.paymentOption)?.label ||
    order.paymentOption;
  const serviceLines = order.serviceDetails.lines
    .map(
      (line) =>
        `- ${line.name}: ${line.quantity} ${line.unit} - ${formatKes(line.lineTotalKe)}`,
    )
    .join("\n");

  return `
Fresh Flow website order

Ticket ID: ${order.ticketId}
Customer: ${order.customerName}
Phone: ${order.customerPhone}
Email: ${order.customerEmail}
Area: ${order.serviceArea}
Address: ${order.address}

Services:
${serviceLines}

Pickup: ${new Date(order.pickupDatetime).toLocaleString("en-KE", {
    timeZone: "Africa/Nairobi",
  })}
Delivery: ${new Date(order.deliveryDatetime).toLocaleString("en-KE", {
    timeZone: "Africa/Nairobi",
  })}

Total: ${formatKes(order.priceTotalKe)}
Payment: ${paymentLabel}
Payment instructions:
${paymentInstructions(order.paymentOption)
  .map((line) => `- ${line}`)
  .join("\n")}

Special instructions:
${order.specialInstructions || "None"}
`.trim();
}

export async function createOsTicketForOrder(
  order: Order,
): Promise<OsTicketResult> {
  if (!osTicketConfigured()) {
    return {
      status: "skipped",
      reason: "OSTICKET_API_URL and OSTICKET_API_KEY are not configured.",
    };
  }

  const payload = {
    alert: true,
    autorespond: false,
    source: "API",
    name: order.customerName,
    email: order.customerEmail,
    phone: order.customerPhone,
    subject: `New Order - ${order.customerName} - ${order.ticketId}`,
    message: orderMessage(order),
    topicId: process.env.OSTICKET_TOPIC_ID
      ? Number(process.env.OSTICKET_TOPIC_ID)
      : undefined,
    freshflow: {
      ticket_id: order.ticketId,
      service_area: order.serviceArea,
      pickup_datetime: order.pickupDatetime,
      delivery_datetime: order.deliveryDatetime,
      payment_option: order.paymentOption,
      payment_status: order.paymentStatus,
      total_ke: order.priceTotalKe,
      status: statusLabels[order.status],
    },
  };

  const response = await fetch(process.env.OSTICKET_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.OSTICKET_API_KEY!,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `osTicket ticket creation failed: ${response.status} ${details}`,
    );
  }

  const data = (await response.json().catch(() => ({}))) as {
    id?: string | number;
    ticket_id?: string | number;
    number?: string | number;
    ticket_number?: string | number;
  };

  return {
    status: "created",
    externalId: data.ticket_id
      ? String(data.ticket_id)
      : data.id
        ? String(data.id)
        : null,
    number: data.ticket_number
      ? String(data.ticket_number)
      : data.number
        ? String(data.number)
        : null,
  };
}

export async function pushStatusToOsTicket(order: Order, notes?: string) {
  if (!process.env.OSTICKET_STATUS_SYNC_URL || !process.env.OSTICKET_API_KEY) {
    return { status: "skipped" as const };
  }

  const response = await fetch(process.env.OSTICKET_STATUS_SYNC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": process.env.OSTICKET_API_KEY,
    },
    body: JSON.stringify({
      ticket_id: order.osTicketTicketId,
      ticket_number: order.osTicketNumber,
      freshflow_ticket_id: order.ticketId,
      status: order.status,
      note: notes || `Fresh Flow status: ${statusLabels[order.status]}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`osTicket status sync failed: ${response.status}`);
  }

  return { status: "synced" as const };
}
