import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Calculator,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { InteractiveEstimator } from "@/components/InteractiveEstimator";

export const metadata: Metadata = {
  title: "Official Rate Calculator & Live Quote Builder | Fresh Flow Nairobi",
  description:
    "Interactive pricing calculator for Laundry, House Cleaning, Carpet Cleaning, and Pest Fumigation in Nairobi. Dual KSh and USD rates.",
};

export default function CalculatorPage() {
  return (
    <main className="bg-[#f8fafc] py-12 lg:py-20 text-[#092341]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* EXECUTIVE HERO BANNER */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd5e1] bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#1363DF] shadow-xs">
            <Calculator className="size-4 text-[#1363DF]" />
            <span>Interactive Price Engine</span>
          </div>

          <h1 className="mt-4 text-4xl font-black text-[#092341] sm:text-5xl lg:text-6xl tracking-tight">
            Instant Rate Calculator
          </h1>

          <p className="mt-4 text-base leading-relaxed text-[#64748b] sm:text-lg max-w-2xl mx-auto">
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

        {/* 3-STEP GUIDE CARDS */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#1363DF] font-black text-sm">
              <span className="flex size-6 items-center justify-center rounded-lg bg-[#F0F7FF]">1</span>
              <span>Select Items</span>
            </div>
            <p className="mt-1 text-xs text-[#64748b]">
              Tap categories and adjust quantities for your order.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#1363DF] font-black text-sm">
              <span className="flex size-6 items-center justify-center rounded-lg bg-[#F0F7FF]">2</span>
              <span>Live Quote Breakdown</span>
            </div>
            <p className="mt-1 text-xs text-[#64748b]">
              View itemized totals, delivery fees, and USD conversions.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
            <div className="flex items-center gap-2 text-[#16a34a] font-black text-sm">
              <span className="flex size-6 items-center justify-center rounded-lg bg-[#f0fdf4]">3</span>
              <span>Doorstep Booking</span>
            </div>
            <p className="mt-1 text-xs text-[#64748b]">
              Confirm pickup window in 60 seconds with digital M-Pesa receipt.
            </p>
          </div>
        </div>

        {/* MAIN CALCULATOR ENGINE STAGE */}
        <div className="mt-10 mx-auto max-w-4xl">
          <InteractiveEstimator />
        </div>

        {/* CORPORATE B2B RATE CARD CALLOUT */}
        <section className="mt-16 rounded-3xl bg-[#092341] p-8 text-white shadow-2xl lg:p-12">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#ffe823]">
                <Building2 className="size-4 text-[#38BDF8]" />
                <span>Commercial & Diplomatic Rate Cards</span>
              </div>
              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Need Commercial B2B Rate Contracts?
              </h2>
              <p className="mt-2 text-sm text-white/80 max-w-xl">
                We handle weekly linen contracts, staff uniform dry cleaning, and facility pest control for Nairobi embassies, hotels, offices, and medical clinics.
              </p>
            </div>

            <div className="lg:col-span-4 text-left lg:text-right flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-[#ffe823] px-7 py-4 text-sm font-extrabold text-[#092341] transition hover:bg-[#fff17a] shadow-xl"
              >
                <span>Request B2B Rate Card</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
