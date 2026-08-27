import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  Clock,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | Fresh Flow Laundry Nairobi",
  description:
    "Learn how Fresh Flow makes laundry effortless in Nairobi. From doorstep pickup to eco-washing, ticket tracking, and express 24h delivery.",
};

const customerSteps = [
  {
    step: "01",
    icon: CalendarCheck2,
    title: "Schedule Pickup Online",
    text: "Select your service type, estimated items, and pick a convenient 2-hour collection window at your Nairobi address.",
  },
  {
    step: "02",
    icon: Truck,
    title: "Doorstep Collection",
    text: "Our courteous driver arrives at your door with reusable laundry bags. Items are tagged and weighed on-site with an instant receipt.",
  },
  {
    step: "03",
    icon: Sparkles,
    title: "Eco Gentle Washing & Care",
    text: "Your garments are sorted by fabric and color, treated with eco-safe non-allergenic detergents, and expertly pressed or folded.",
  },
  {
    step: "04",
    icon: SearchCheck,
    title: "Real-Time Ticket Tracking",
    text: "Use your unique Fresh Flow Ticket ID to follow order status online from washing to quality check and dispatch.",
  },
  {
    step: "05",
    icon: ShieldCheck,
    title: "Spotless Delivery & M-Pesa",
    text: "Clothes are returned crisp and fresh to your door. Pay conveniently via M-Pesa Buy Goods/Paybill or cash upon delivery.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1363DF]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
            <Clock className="size-4" />
            <span>Effortless Garment Care</span>
          </div>
          <h1 className="mt-3 text-4xl font-extrabold text-[#092341] sm:text-5xl">
            How Fresh Flow Works
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#64748b]">
            Five simple steps between your dirty laundry basket and fresh, crisp garments hanging in your wardrobe.
          </p>
        </div>

        {/* Vertical Step Timeline */}
        <div className="mt-14 space-y-8 max-w-4xl mx-auto">
          {customerSteps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative flex flex-col md:flex-row items-start gap-6 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-6 lg:p-8 transition-all hover:border-[#1363DF] hover:bg-white hover:shadow-md"
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#092341] text-2xl font-black text-[#ffe823]">
                  {s.step}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Icon className="size-6 text-[#1363DF]" />
                    <h2 className="text-xl font-bold text-[#092341]">
                      {s.title}
                    </h2>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
                    {s.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-3xl bg-[#092341] p-8 text-center text-white sm:p-12">
          <h3 className="text-2xl font-bold sm:text-3xl">
            Ready to experience effortless laundry?
          </h3>
          <p className="mt-2 text-sm text-white/80">
            Book your doorstep pickup now and let our master cleaners handle the rest.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#ffe823] px-8 py-4 text-base font-bold text-[#092341] transition hover:bg-[#fff17a]"
            >
              <span>Book Pickup Now</span>
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
