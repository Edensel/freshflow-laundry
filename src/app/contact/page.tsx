import type { Metadata } from "next";
import Link from "next/link";
import { CalendarCheck2, Mail, MapPin, Phone } from "lucide-react";
import { businessConfig } from "@/lib/business";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Fresh Flow Laundry Services in Nairobi for laundry pickup, order support, and corporate laundry enquiries.",
};

export default function ContactPage() {
  return (
    <main className="bg-[#f7f9fc] py-12">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <section>
          <p className="text-sm font-semibold uppercase tracking-wide text-[#1d65b9]">
            Contact
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-[#092341]">
            Fresh Flow support
          </h1>
          <p className="mt-4 text-base leading-7 text-[#656b72]">
            For the launch build, email is the primary support and notification
            channel. WhatsApp and SMS can be layered in later.
          </p>
          <Link
            href="/book"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#1d65b9] px-5 text-sm font-semibold text-white transition hover:bg-[#0f3664]"
          >
            <CalendarCheck2 className="size-4" aria-hidden="true" />
            Book a pickup
          </Link>
        </section>
        <section className="grid gap-4">
          {[
            {
              icon: Mail,
              label: "Orders email",
              value: businessConfig.email,
            },
            {
              icon: Phone,
              label: "Phone",
              value: businessConfig.phone,
            },
            {
              icon: MapPin,
              label: "Location",
              value: businessConfig.address,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex gap-4 rounded-lg border border-[#d7ddeb] bg-white p-5"
              >
                <Icon className="size-5 text-[#1d65b9]" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-[#092341]">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm text-[#656b72]">{item.value}</p>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </main>
  );
}
