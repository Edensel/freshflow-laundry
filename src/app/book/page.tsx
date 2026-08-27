import type { Metadata } from "next";
import { CalendarCheck2, Clock, ShieldCheck, Truck } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { businessConfig } from "@/lib/business";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Book Doorstep Laundry Pickup in Nairobi | Fresh Flow",
  description:
    "Schedule a Fresh Flow laundry pickup in Nairobi. Choose your services, pickup window, delivery slot, and M-Pesa payment option with instant ticket confirmation.",
};

export default function BookPage() {
  return (
    <main className="bg-[#f8fafc] py-12 lg:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <section className="pt-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1363DF]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
            <CalendarCheck2 className="size-4" />
            <span>Fast Online Booking</span>
          </div>

          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[#092341] sm:text-5xl">
            Schedule Pickup In 60 Seconds
          </h1>

          <p className="mt-4 text-base leading-relaxed text-[#64748b]">
            Select your laundry services, choose your preferred doorstep collection window, and specify delivery instructions. Receive instant ticket confirmation by email & SMS.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs">
              <Truck className="size-5 shrink-0 text-[#1363DF]" />
              <div>
                <h4 className="font-bold text-[#092341]">Doorstep Collection</h4>
                <p className="mt-1 text-xs text-[#64748b]">
                  Drivers arrive with Fresh Flow garment bags during your chosen 2-hour window.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs">
              <Clock className="size-5 shrink-0 text-[#1363DF]" />
              <div>
                <h4 className="font-bold text-[#092341]">Operating Hours</h4>
                <p className="mt-1 text-xs text-[#64748b]">
                  {businessConfig.serviceWindowLabel}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-xs">
              <ShieldCheck className="size-5 shrink-0 text-[#16a34a]" />
              <div>
                <h4 className="font-bold text-[#092341]">M-Pesa & Cash Friendly</h4>
                <p className="mt-1 text-xs text-[#64748b]">
                  Till: <strong>{businessConfig.mpesa.tillNumber}</strong> | Paybill: <strong>{businessConfig.mpesa.paybillNumber}</strong> or pay on delivery.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div>
          <BookingForm />
        </div>
      </div>
    </main>
  );
}
