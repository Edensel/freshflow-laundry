"use server";

import { revalidatePath } from "next/cache";
import { submitFeedback } from "@/lib/feedback";
import { z } from "zod";

const feedbackSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  locationArea: z.string().min(2, "Neighborhood/Area is required"),
  rating: z.coerce.number().min(1).max(5),
  serviceType: z.string().min(2, "Service type is required"),
  reviewText: z.string().min(5, "Review text must be at least 5 characters"),
});

export type FeedbackActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string>;
};

export async function submitFeedbackAction(
  _prevState: FeedbackActionState,
  formData: FormData
): Promise<FeedbackActionState> {
  const rawData = {
    customerName: formData.get("customerName"),
    locationArea: formData.get("locationArea"),
    rating: formData.get("rating"),
    serviceType: formData.get("serviceType"),
    reviewText: formData.get("reviewText"),
  };

  const parsed = feedbackSchema.safeParse(rawData);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0]) {
        fieldErrors[issue.path[0].toString()] = issue.message;
      }
    }
    return {
      ok: false,
      message: "Please fix the highlighted errors.",
      fieldErrors,
    };
  }

  await submitFeedback(parsed.data);
  revalidatePath("/");
  revalidatePath("/admin");

  return {
    ok: true,
    message: "Thank you for your feedback! Your review has been submitted for owner verification.",
  };
}
