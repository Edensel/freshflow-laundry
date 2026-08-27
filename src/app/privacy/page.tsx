import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Fresh Flow Laundry Services privacy policy for customer booking and order tracking data in Kenya.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-white py-12">
      <article className="mx-auto max-w-3xl px-4 text-[#575d65] sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#1d65b9]">
          Privacy
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-[#092341]">
          Privacy Policy
        </h1>
        <div className="mt-6 space-y-5 text-base leading-7">
          <p>
            Fresh Flow Laundry Services collects customer information needed to
            receive, collect, clean, deliver, support, and track laundry orders.
            This includes name, phone number, email address, pickup address,
            order history, service preferences, payment option, and support
            notes.
          </p>
          <p>
            Customer data is used for order fulfilment, email notifications,
            staff operations, fraud prevention, service improvement, and legal
            record keeping. Fresh Flow does not sell customer data.
          </p>
          <p>
            Email is the primary notification channel for confirmations, status
            changes, payment instructions, and service issues. SMS may be added
            later only after the customer-facing consent language is updated.
          </p>
          <p>
            The site is designed for Kenya’s Data Protection Act, 2019:
            collection is limited to operational need, access is restricted to
            staff and service providers, and customers may request correction or
            deletion where retention is not legally required.
          </p>
          <p>
            Production launch should use a domain-based sender with SPF, DKIM,
            and DMARC, plus encrypted database backups and access-controlled
            osTicket staff accounts.
          </p>
        </div>
      </article>
    </main>
  );
}
