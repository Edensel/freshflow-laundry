"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  clearAdminSession,
  isAdminAuthenticated,
  isAdminCredentials,
  setAdminSession,
} from "@/lib/admin-auth";
import { sendOrderEmail, sendStatusEmail } from "@/lib/email";
import { createOrder, logNotification, updateOrderStatus, type OrderStatus } from "@/lib/orders";
import { pushStatusToOsTicket } from "@/lib/osticket";
import { statusSteps } from "@/lib/business";
import { approveFeedback, deleteFeedback } from "@/lib/feedback";
import { calculateQuote } from "@/lib/pricing";
import type { BookingInput } from "@/lib/validation";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (!isAdminCredentials(email, password)) {
    redirect("/admin?error=1");
  }

  await setAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin");
}

export async function updateStatusAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const orderId = Number(formData.get("orderId"));
  const status = String(formData.get("status"));
  const notes = String(formData.get("notes") || "");

  if (!Number.isFinite(orderId) || !statusSteps.includes(status as OrderStatus)) {
    redirect("/admin?error=invalid-status");
  }

  const order = await updateOrderStatus({
    orderId,
    newStatus: status as OrderStatus,
    changedBy: "admin",
    notes,
  });

  if (order) {
    try {
      const email = await sendStatusEmail(order);
      await logNotification({
        orderId: order.id,
        channel: "email",
        recipient: order.customerEmail,
        status: email.status === "sent" ? "SENT" : "SKIPPED",
        providerMessageId:
          email.status === "sent" ? email.messageId : undefined,
        errorMessage: email.status === "skipped" ? email.reason : undefined,
      });
    } catch (error) {
      await logNotification({
        orderId: order.id,
        channel: "email",
        recipient: order.customerEmail,
        status: "FAILED",
        errorMessage:
          error instanceof Error ? error.message : "Status email failed.",
      });
    }

    try {
      await pushStatusToOsTicket(order, notes);
    } catch (error) {
      await logNotification({
        orderId: order.id,
        channel: "osticket",
        recipient: "operations",
        status: "FAILED",
        errorMessage:
          error instanceof Error ? error.message : "osTicket sync failed.",
      });
    }
  }

  revalidatePath("/admin");
  revalidatePath("/track");
  redirect("/admin");
}

export async function createWalkInOrderAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Unauthorized staff access." };
  }

  const customerName = String(formData.get("customerName") || "").trim();
  const customerPhone = String(formData.get("customerPhone") || "").trim();
  const customerEmail = String(formData.get("customerEmail") || "").trim();
  const paymentOption = String(formData.get("paymentOption") || "mpesa_till") as "mpesa_till" | "mpesa_paybill" | "pay_on_delivery";
  const quantitiesJson = String(formData.get("quantitiesJson") || "{}");

  if (!customerName || !customerPhone || !customerEmail) {
    return { ok: false, message: "Name, phone, and email are required." };
  }

  let quantities: Record<string, number> = {};
  try {
    quantities = JSON.parse(quantitiesJson);
  } catch {
    return { ok: false, message: "Invalid service quantities." };
  }

  const selectedList = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([id, quantity]) => ({ id, quantity }));

  if (selectedList.length === 0) {
    return { ok: false, message: "Please select at least one service." };
  }

  const quote = calculateQuote(selectedList);

  const now = new Date();
  const todayIso = now.toISOString();

  const bookingInput: BookingInput = {
    serviceArea: "Store Walk-in",
    customerName,
    customerPhone,
    customerEmail,
    address: "Store Walk-in Dropoff",
    specialInstructions: "Logged as Walk-in Customer Order",
    pickupSlot: todayIso,
    deliverySlot: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
    paymentOption,
    consentUpdates: true,
    services: selectedList,
  };

  const order = await createOrder(bookingInput, quote);

  // Automatically trigger colorful HTML receipt email
  try {
    await sendOrderEmail(order, "customer");
  } catch {
    // Non-blocking email attempt
  }

  revalidatePath("/admin");
  return { ok: true, message: "Walk-in order created and receipt sent!", order };
}

export async function approveFeedbackAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const feedbackId = Number(formData.get("feedbackId"));
  if (Number.isFinite(feedbackId)) {
    await approveFeedback(feedbackId);
    revalidatePath("/");
    revalidatePath("/admin");
  }

  redirect("/admin");
}

export async function deleteFeedbackAction(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const feedbackId = Number(formData.get("feedbackId"));
  if (Number.isFinite(feedbackId)) {
    await deleteFeedback(feedbackId);
    revalidatePath("/");
    revalidatePath("/admin");
  }

  redirect("/admin");
}
