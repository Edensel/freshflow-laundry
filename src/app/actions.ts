"use server";

import { revalidatePath } from "next/cache";
import { isDatabaseConfigured } from "@/lib/db";
import { sendOrderEmail } from "@/lib/email";
import {
  createOrder,
  logNotification,
  updateOrderExternalTicket,
} from "@/lib/orders";
import { createOsTicketForOrder } from "@/lib/osticket";
import { calculateQuote } from "@/lib/pricing";
import { getAvailableSlots, isSlotInsideOperatingHours } from "@/lib/slots";
import { parseBookingForm } from "@/lib/validation";

export type BookingActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
  confirmation?: {
    ticketId: string;
    totalKe: number;
    requiresQuote: boolean;
    pickupDatetime: string;
    deliveryDatetime: string;
    paymentOption: string;
    warnings: string[];
    demoMode: boolean;
  };
};

const initialErrorState: BookingActionState = {
  ok: false,
  message: "",
};

function kenyaDate(value: string) {
  return new Date(value).toLocaleDateString("en-CA", {
    timeZone: "Africa/Nairobi",
  });
}

async function logEmailResult(
  orderId: number,
  recipient: string,
  result: Awaited<ReturnType<typeof sendOrderEmail>>,
) {
  await logNotification({
    orderId,
    channel: "email",
    recipient,
    status: result.status === "sent" ? "SENT" : "SKIPPED",
    providerMessageId:
      result.status === "sent" ? result.messageId : undefined,
    errorMessage: result.status === "skipped" ? result.reason : undefined,
  });
}

export async function createBookingAction(
  previousState: BookingActionState = initialErrorState,
  formData: FormData,
): Promise<BookingActionState> {
  void previousState;

  const parsed = parseBookingForm(formData);

  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(
      Object.entries(parsed.error.flatten().fieldErrors).map(
        ([field, messages]) => [field, messages?.[0] || "Check this field."],
      ),
    );

    const issuesList = Object.entries(fieldErrors)
      .map(([field, msg]) => `${field.toUpperCase()}: ${msg}`)
      .join(" | ");

    return {
      ok: false,
      message: `Please review your booking input: ${issuesList}`,
      fieldErrors,
    };
  }

  const input = parsed.data;
  const quote = calculateQuote(input.services);
  const demoMode = !isDatabaseConfigured();

  if (
    !isSlotInsideOperatingHours(input.pickupSlot) ||
    !isSlotInsideOperatingHours(input.deliverySlot)
  ) {
    return {
      ok: false,
      message: "Choose pickup and delivery times inside Fresh Flow hours.",
      fieldErrors: {
        pickupSlot: "Choose an available pickup slot.",
        deliverySlot: "Choose an available delivery slot.",
      },
    };
  }

  const pickupSlots = await getAvailableSlots(kenyaDate(input.pickupSlot));
  const selectedPickupSlot = pickupSlots.find(
    (slot) => slot.value === input.pickupSlot,
  );

  if (!selectedPickupSlot?.available) {
    return {
      ok: false,
      message: "That pickup slot has just filled up. Choose another time.",
      fieldErrors: {
        pickupSlot: "This slot is no longer available.",
      },
    };
  }

  try {
    const order = await createOrder(input, quote);
    const warnings: string[] = [];

    try {
      const ticket = await createOsTicketForOrder(order);

      if (ticket.status === "created") {
        await updateOrderExternalTicket(
          order.id,
          ticket.externalId,
          ticket.number,
        );
      } else {
        await logNotification({
          orderId: order.id,
          channel: "osticket",
          recipient: "operations",
          status: "SKIPPED",
          errorMessage: ticket.reason,
        });
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "osTicket ticket failed.";
      warnings.push("Operations ticket sync is delayed.");
      await logNotification({
        orderId: order.id,
        channel: "osticket",
        recipient: "operations",
        status: "FAILED",
        errorMessage: message,
      });
    }

    for (const recipient of ["customer", "staff"] as const) {
      try {
        const result = await sendOrderEmail(order, recipient);
        await logEmailResult(
          order.id,
          recipient === "customer" ? order.customerEmail : "operations",
          result,
        );
        if (result.status === "skipped") {
          continue;
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Email notification failed.";
        warnings.push("Email notification is delayed.");
        await logNotification({
          orderId: order.id,
          channel: "email",
          recipient:
            recipient === "customer" ? order.customerEmail : "operations",
          status: "FAILED",
          errorMessage: message,
        });
      }
    }

    revalidatePath("/");
    revalidatePath("/book");
    revalidatePath("/track");
    revalidatePath("/admin");

    return {
      ok: true,
      message: "Your pickup is booked successfully.",
      confirmation: {
        ticketId: order.ticketId,
        totalKe: order.priceTotalKe,
        requiresQuote: order.serviceDetails.requiresQuote,
        pickupDatetime: order.pickupDatetime,
        deliveryDatetime: order.deliveryDatetime,
        paymentOption: order.paymentOption,
        warnings,
        demoMode,
      },
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "The booking could not be saved.",
    };
  }
}
