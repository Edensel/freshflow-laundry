import type { Metadata } from "next";
import { Search, TicketCheck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import {
  formatKes,
  normalizeKenyanPhone,
  paymentInstructions,
  paymentOptions,
  statusLabels,
  statusSteps,
} from "@/lib/business";
import {
  findOrderForTracking,
  getOrderStatusHistory,
  type Order,
} from "@/lib/orders";

export const metadata: Metadata = {
  title: "Track Order Status | Fresh Flow Laundry Nairobi",
  description:
    "Track your Fresh Flow order status live using your Ticket ID or phone number.",
};

type TrackPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });
}

function PaymentPanel({ order }: { order: Order }) {
  const option =
    paymentOptions.find((payment) => payment.id === order.paymentOption) ||
    paymentOptions[0];

  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs">
      <p className="text-sm font-bold text-[#092341]">{option.label}</p>
      <ul className="mt-3 space-y-2 text-xs text-[#64748b]">
        {paymentInstructions(order.paymentOption).map((instruction) => (
          <li key={instruction} className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#1363DF]" />
            <span>{instruction}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function TrackPage({ searchParams }: TrackPageProps) {
  const params = await searchParams;
  const rawQuery = first(params.query);
  let ticketId = first(params.ticketId);
  let email = first(params.email);
  let rawPhone = first(params.phone);

  if (rawQuery && !ticketId && !rawPhone && !email) {
    if (rawQuery.toUpperCase().startsWith("FF")) {
      ticketId = rawQuery;
    } else if (rawQuery.includes("@")) {
      email = rawQuery;
    } else {
      rawPhone = rawQuery;
    }
  }

  const phone = rawPhone ? normalizeKenyanPhone(rawPhone) : undefined;
  const searched = Boolean(ticketId || (email && phone) || phone);
  const order = searched
    ? await findOrderForTracking({ ticketId, email, phone })
    : null;
  const history = order ? await getOrderStatusHistory(order.id) : [];

  return (
    <main className="bg-[#f8fafc] py-14 lg:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1363DF]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
            <TicketCheck className="size-4" />
            <span>Live Order Tracking</span>
          </div>

          <h1 className="mt-3 text-4xl font-extrabold text-[#092341]">
            Track Order Status
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[#64748b]">
            Enter your Fresh Flow Ticket ID or the phone number attached to your booking.
          </p>

          <form className="mt-8 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm">
            <label className="block text-sm font-bold text-[#092341]">
              Ticket ID
              <input
                name="ticketId"
                defaultValue={ticketId || ""}
                placeholder="e.g. FFL-KE-2026-00042"
                className="mt-2 min-h-12 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 font-normal text-[#092341] placeholder:text-[#94a3b8] outline-none focus:border-[#1363DF] focus:bg-white focus:ring-2 focus:ring-[#1363DF]/20"
              />
            </label>

            <div className="my-4 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
              <span className="h-px flex-1 bg-[#e2e8f0]" />
              or lookup by contact
              <span className="h-px flex-1 bg-[#e2e8f0]" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block text-sm font-bold text-[#092341]">
                Phone
                <input
                  name="phone"
                  defaultValue={rawPhone || ""}
                  placeholder="+254 715 904 516"
                  className="mt-2 min-h-12 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 font-normal text-[#092341] placeholder:text-[#94a3b8] outline-none focus:border-[#1363DF] focus:bg-white focus:ring-2 focus:ring-[#1363DF]/20"
                />
              </label>
              <label className="block text-sm font-bold text-[#092341]">
                Email (Optional)
                <input
                  name="email"
                  defaultValue={email || ""}
                  placeholder="name@example.com"
                  className="mt-2 min-h-12 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 font-normal text-[#092341] placeholder:text-[#94a3b8] outline-none focus:border-[#1363DF] focus:bg-white focus:ring-2 focus:ring-[#1363DF]/20"
                />
              </label>
            </div>

            <button className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1363DF] px-5 text-sm font-bold text-white transition hover:bg-[#0F4C81]">
              <Search className="size-4" aria-hidden="true" />
              <span>Search Status</span>
            </button>
          </form>
        </section>

        <section>
          {!searched ? (
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center text-[#64748b]">
              <TicketCheck className="mx-auto size-10 text-[#cbd5e1]" />
              <p className="mt-3 text-sm font-medium">
                Enter your Ticket ID or Phone number on the left to track progress.
              </p>
            </div>
          ) : order ? (
            <div className="space-y-6">
              <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#f1f5f9] pb-6">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#94a3b8]">
                      Ticket Reference
                    </span>
                    <h2 className="mt-1 text-3xl font-extrabold text-[#092341]">
                      {order.ticketId}
                    </h2>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs text-[#94a3b8]">Doorstep Pickup Window</dt>
                    <dd className="mt-1 font-semibold text-[#092341]">
                      {formatDate(order.pickupDatetime)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#94a3b8]">Target Delivery Window</dt>
                    <dd className="mt-1 font-semibold text-[#092341]">
                      {formatDate(order.deliveryDatetime)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#94a3b8]">Estimated Total</dt>
                    <dd className="mt-1 font-extrabold text-[#1363DF]">
                      {order.serviceDetails.requiresQuote
                        ? "Custom quote pending"
                        : formatKes(order.priceTotalKe)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#94a3b8]">Last Status Sync</dt>
                    <dd className="mt-1 font-semibold text-[#092341]">
                      {formatDate(order.updatedAt)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-sm sm:p-8">
                <h3 className="text-lg font-bold text-[#092341]">
                  Garment Processing Timeline
                </h3>
                <div className="mt-6 space-y-5">
                  {statusSteps.map((status) => {
                    const event = history.find(
                      (item) => item.newStatus === status
                    );
                    const reached =
                      statusSteps.indexOf(order.status) >=
                      statusSteps.indexOf(status);

                    return (
                      <div key={status} className="flex items-start gap-4">
                        <div
                          className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            reached
                              ? "bg-[#1363DF] text-white"
                              : "bg-[#e2e8f0] text-[#94a3b8]"
                          }`}
                        >
                          {reached ? "✓" : ""}
                        </div>
                        <div>
                          <p className="font-bold text-[#092341]">
                            {statusLabels[status]}
                          </p>
                          <p className="text-xs text-[#64748b]">
                            {event
                              ? `${formatDate(event.changedAt)}${
                                  event.notes ? ` — ${event.notes}` : ""
                                }`
                              : "Pending execution"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <PaymentPanel order={order} />
            </div>
          ) : (
            <div className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-6 text-sm font-semibold text-[#991b1b]">
              No active ticket matched those details. Please double-check your Ticket ID or phone number.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
