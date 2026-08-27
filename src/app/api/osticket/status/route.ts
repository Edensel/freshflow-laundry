import { z } from "zod";
import { sendStatusEmail } from "@/lib/email";
import {
  findOrderForTracking,
  logNotification,
  updateOrderStatus,
  type OrderStatus,
} from "@/lib/orders";
import { statusSteps } from "@/lib/business";

const statusSchema = z.object({
  ticketId: z.string().min(4),
  status: z.enum(statusSteps),
  notes: z.string().max(600).optional(),
});

export async function POST(request: Request) {
  const secret = request.headers.get("x-freshflow-webhook-secret");

  if (!process.env.OSTICKET_WEBHOOK_SECRET || secret !== process.env.OSTICKET_WEBHOOK_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = statusSchema.safeParse(await request.json());

  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const order = await findOrderForTracking({
    ticketId: parsed.data.ticketId,
  });

  if (!order) {
    return Response.json({ error: "Order not found" }, { status: 404 });
  }

  const updated = await updateOrderStatus({
    orderId: order.id,
    newStatus: parsed.data.status as OrderStatus,
    changedBy: "osticket",
    notes: parsed.data.notes,
  });

  if (!updated) {
    return Response.json({ error: "Order not updated" }, { status: 500 });
  }

  const email = await sendStatusEmail(updated);
  await logNotification({
    orderId: updated.id,
    channel: "email",
    recipient: updated.customerEmail,
    status: email.status === "sent" ? "SENT" : "SKIPPED",
    providerMessageId: email.status === "sent" ? email.messageId : undefined,
    errorMessage: email.status === "skipped" ? email.reason : undefined,
  });

  return Response.json({ ok: true, status: updated.status });
}
