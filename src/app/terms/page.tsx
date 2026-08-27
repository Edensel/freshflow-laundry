import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Fresh Flow Laundry Services booking, pickup, delivery, payment, and order-ticketing terms.",
};

export default function TermsPage() {
  return (
    <main className="bg-white py-12">
      <article className="mx-auto max-w-3xl px-4 text-[#575d65] sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#1d65b9]">
          Terms
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-[#092341]">
          Terms & Conditions
        </h1>
        <div className="mt-6 space-y-5 text-base leading-7">
          <p>
            A booking request creates a Fresh Flow order ticket. Pickup is
            confirmed when Fresh Flow accepts the scheduled slot and contacts
            the customer by email or phone where needed.
          </p>
          <p>
            Prices shown during booking are estimates based on selected service,
            weight, items, and pickup/delivery charge. Final price can change
            after weighing, inspection, stain treatment, delicate care, or
            corporate quotation.
          </p>
          <p>
            M-Pesa Buy Goods, Paybill, and pay on collection/delivery are the
            supported payment paths in this build. Staff record M-Pesa
            transaction codes against the order ticket.
          </p>
          <p>
            Customers should remove valuables from garments before pickup.
            Fresh Flow may decline items that are unsafe, heavily contaminated,
            incorrectly labelled, or outside service capability.
          </p>
          <p>
            Order status updates are sent by email and shown on the Track My
            Order page. Support issues should reference the Fresh Flow ticket ID.
          </p>
        </div>
      </article>
    </main>
  );
}
