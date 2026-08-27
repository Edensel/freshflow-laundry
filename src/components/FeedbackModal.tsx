"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2, MessageSquarePlus, Star, X } from "lucide-react";
import { submitFeedbackAction, type FeedbackActionState } from "@/app/feedback-actions";
import { serviceAreas } from "@/lib/business";
import { serviceCatalog } from "@/lib/pricing";

const initialState: FeedbackActionState = {
  ok: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1363DF] text-xs font-bold text-white shadow-md transition hover:bg-[#0F4C81] disabled:opacity-50"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <MessageSquarePlus className="size-4" />}
      <span>{pending ? "Submitting Review..." : "Submit Review For Verification"}</span>
    </button>
  );
}

export function FeedbackModal() {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(submitFeedbackAction, initialState);
  const [rating, setRating] = useState(5);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2.5 text-xs font-bold text-[#092341] shadow-xs transition hover:border-[#1363DF] hover:bg-[#F0F7FF] hover:text-[#1363DF]"
      >
        <MessageSquarePlus className="size-4 text-[#1363DF]" />
        <span>Leave Your Review</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-[#cbd5e1] bg-white p-6 shadow-2xl lg:p-8 text-[#092341]">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#1363DF]">
                  Client Feedback
                </span>
                <h3 className="text-xl font-bold text-[#092341]">
                  Share Your Experience
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#092341]"
              >
                <X className="size-5" />
              </button>
            </div>

            {state.ok ? (
              <div className="my-6 rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-6 text-center text-[#166534]">
                <CheckCircle2 className="mx-auto size-10 text-[#16a34a]" />
                <h4 className="mt-3 text-lg font-bold">Review Received!</h4>
                <p className="mt-1 text-xs text-[#15803d]">{state.message}</p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-5 rounded-xl bg-[#16a34a] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#15803d]"
                >
                  Close
                </button>
              </div>
            ) : (
              <form action={formAction} className="mt-5 space-y-4">
                {state.message && !state.ok ? (
                  <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-3 text-xs font-bold text-[#991b1b]">
                    {state.message}
                  </div>
                ) : null}

                <div>
                  <label className="block text-xs font-bold uppercase text-[#092341]">
                    Your Name
                  </label>
                  <input
                    name="customerName"
                    required
                    placeholder="e.g. Ann Kimotho"
                    className="mt-1.5 min-h-11 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3.5 text-xs text-[#092341] outline-none focus:border-[#1363DF] focus:bg-white"
                  />
                  {state.fieldErrors?.customerName && (
                    <p className="mt-1 text-[11px] font-semibold text-[#dc2626]">{state.fieldErrors.customerName}</p>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase text-[#092341]">
                      Neighborhood
                    </label>
                    <select
                      name="locationArea"
                      required
                      className="mt-1.5 min-h-11 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 text-xs font-semibold text-[#092341] outline-none focus:border-[#1363DF]"
                    >
                      {serviceAreas.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-[#092341]">
                      Service Used
                    </label>
                    <select
                      name="serviceType"
                      required
                      className="mt-1.5 min-h-11 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 text-xs font-semibold text-[#092341] outline-none focus:border-[#1363DF]"
                    >
                      {serviceCatalog.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#092341]">
                    Your Rating (1 to 5 Stars)
                  </label>
                  <input type="hidden" name="rating" value={rating} />
                  <div className="mt-1.5 flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-[#f59e0b] transition hover:scale-110"
                      >
                        <Star className={`size-6 ${rating >= star ? "fill-current" : "text-[#cbd5e1]"}`} />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-[#1363DF] ml-2">{rating} / 5 Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#092341]">
                    Review / Feedback Comment
                  </label>
                  <textarea
                    name="reviewText"
                    required
                    rows={3}
                    placeholder="Tell us about the laundry quality, driver punctuality, or customer service..."
                    className="mt-1.5 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] p-3 text-xs text-[#092341] outline-none focus:border-[#1363DF] focus:bg-white"
                  />
                  {state.fieldErrors?.reviewText && (
                    <p className="mt-1 text-[11px] font-semibold text-[#dc2626]">{state.fieldErrors.reviewText}</p>
                  )}
                </div>

                <div className="pt-2">
                  <SubmitButton />
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
