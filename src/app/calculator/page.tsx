import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle2, Globe, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { InteractiveEstimator } from "@/components/InteractiveEstimator";

export const metadata: Metadata = {
  title: "Instant Rate Calculator | Fresh Flow Nairobi",
  description:
    "Calculate your exact service cost in real-time for Laundry, House Cleaning, Carpet Cleaning, and Fumigation in Nairobi.",
};

export default function CalculatorPage() {
  return (
    <main className="bg-[#f8fafc] py-12 lg:py-20 text-[#092341]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd5e1] bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#1363DF] shadow-xs">
            <Calculator className="size-4 text-[#1363DF]" />
            <span>Interactive Price Engine</span>
          </div>

          <h1 className="mt-4 text-4xl font-black text-[#092341] sm:text-5xl lg:text-6xl tracking-tight">
            Instant Rate Calculator
          </h1>

          <p className="mt-4 text-base leading-relaxed text-[#64748b] sm:text-lg">
            Select items across Laundry, House Cleaning, Carpet Care, or Fumigation to calculate your exact doorstep order total with zero hidden surcharges.
          </p>

          {/* Quick Value Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-2 text-[#092341]">
              <Truck className="size-4 text-[#1363DF]" />
              <span>FREE Pickup over KSh 2,500 (~$19.23 USD)</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-2 text-[#092341]">
              <Globe className="size-4 text-[#16a34a]" />
              <span>KSh & USD Reference Toggle</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-2 text-[#092341]">
              <ShieldCheck className="size-4 text-[#38BDF8]" />
              <span>No Hidden Fees Guarantee</span>
            </span>
          </div>
        </div>

        {/* Main Calculator Engine Stage */}
        <div className="mt-12 mx-auto max-w-4xl">
          <InteractiveEstimator />
        </div>

        {/* Bottom Contact & Booking CTA Banner */}
        <section className="mt-16 rounded-3xl bg-[#092341] p-8 text-white shadow-2xl lg:p-12">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                Ready to Schedule?
              </span>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Book Your Doorstep Pickup Now
              </h2>
              <p className="mt-2 text-sm text-white/80">
                Confirm your pickup address, date, and preferred payment method in 60 seconds.
              </p>
            </div>

            <div className="lg:col-span-4 text-left lg:text-right flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/book"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-[#ffe823] px-7 py-4 text-sm font-extrabold text-[#092341] transition hover:bg-[#fff17a]"
              >
                <span>Proceed To Booking</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
