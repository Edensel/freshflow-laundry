import { z } from "zod";
import {
  normalizeKenyanPhone,
  paymentOptions,
  type PaymentOption,
} from "@/lib/business";
import {
  calculateQuote,
  serviceCatalog,
  type SelectedServiceInput,
  type ServiceId,
} from "@/lib/pricing";

function sanitizeInputString(value: unknown): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .trim();
}

const serviceIds = serviceCatalog.map((service) => service.id) as [
  ServiceId,
  ...ServiceId[],
];

const paymentIds = paymentOptions.map((option) => option.id) as [
  PaymentOption,
  ...PaymentOption[],
];

export const bookingSchema = z
  .object({
    serviceArea: z
      .string()
      .transform(sanitizeInputString)
      .pipe(z.string().min(2).max(120)),
    customerName: z
      .string()
      .transform(sanitizeInputString)
      .pipe(z.string().min(2).max(120)),
    customerPhone: z
      .string()
      .trim()
      .transform(normalizeKenyanPhone)
      .refine((phone) => /^\+254(?:7|1)\d{8}$/.test(phone), {
        message: "Use a valid Kenya phone number, e.g. +254 789 920 270.",
      }),
    customerEmail: z.string().trim().email().max(160),
    address: z
      .string()
      .transform(sanitizeInputString)
      .pipe(z.string().min(5).max(320)),
    specialInstructions: z
      .string()
      .transform(sanitizeInputString)
      .pipe(z.string().max(1000))
      .optional(),
    pickupSlot: z.string().min(5),
    deliverySlot: z.string().min(5),
    paymentOption: z.enum(paymentIds),
    consentUpdates: z.coerce.boolean(),
    services: z
      .array(
        z.object({
          id: z.string(),
          quantity: z.number().min(0),
        }),
      )
      .min(1, "Choose at least one service."),
  })
  .superRefine((data, ctx) => {
    const quote = calculateQuote(data.services);

    if (quote.lines.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["services"],
        message: "Choose at least one service quantity.",
      });
    }
  });

export type BookingInput = z.infer<typeof bookingSchema>;

export function parseBookingForm(formData: FormData) {
  const services: SelectedServiceInput[] = serviceCatalog
    .map((service) => {
      const raw = formData.get(`qty_${service.id}`);
      const quantity = Number(raw || 0);

      return {
        id: service.id,
        quantity: Number.isFinite(quantity) ? quantity : 0,
      };
    })
    .filter((service) => service.quantity > 0);

  const rawPickupSlot = formData.get("pickupSlot") as string;
  const rawDeliverySlot = formData.get("deliverySlot") as string;
  const pickupDate = formData.get("pickupDate") as string;
  const deliveryDate = formData.get("deliveryDate") as string;

  const pickupSlot =
    rawPickupSlot && rawPickupSlot.trim() !== ""
      ? rawPickupSlot
      : pickupDate
      ? `${pickupDate}T10:00:00.000Z`
      : "";

  const deliverySlot =
    rawDeliverySlot && rawDeliverySlot.trim() !== ""
      ? rawDeliverySlot
      : deliveryDate
      ? `${deliveryDate}T15:00:00.000Z`
      : "";

  return bookingSchema.safeParse({
    serviceArea: formData.get("serviceArea"),
    customerName: formData.get("customerName"),
    customerPhone: formData.get("customerPhone"),
    customerEmail: formData.get("customerEmail"),
    address: formData.get("address"),
    specialInstructions: formData.get("specialInstructions"),
    pickupSlot,
    deliverySlot,
    paymentOption: formData.get("paymentOption"),
    consentUpdates: formData.get("consentUpdates") === "on",
    services,
  });
}
