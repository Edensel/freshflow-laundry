"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "How does doorstep pickup and delivery work in Nairobi?",
    a: "You select your preferred pickup date and 2-hour window online. Our professional driver collects your clothes in reusable Fresh Flow laundry bags, weighs/inspects your items on site, and returns them clean, pressed, and folded to your doorstep.",
  },
  {
    q: "What is your turnaround time for orders?",
    a: "Standard Wash & Fold and Ironing services are delivered back within 24 hours. Specialty dry cleaning, suit care, and heavy bedding (duvets) take 24 to 48 hours to ensure deep cleaning and proper drying.",
  },
  {
    q: "How do I pay with M-Pesa?",
    a: "You can pay via M-Pesa Buy Goods (Till Number) or Paybill after booking or upon pickup/delivery. Every order receives a unique Fresh Flow Ticket ID to use as your payment reference for automated receipt reconciliation.",
  },
  {
    q: "How do you calculate prices for mixed laundry?",
    a: "Everyday clothes (t-shirts, shorts, pajamas, underwear) are priced by weight (KSh 180 per KG). Specialty items like suits, formal dresses, duvets, and heavy coats are handled individually with dry cleaning or hand-care pricing.",
  },
  {
    q: "Do you serve commercial clients, hotels, and salons?",
    a: "Yes! We offer customized corporate contracts for boutique hotels, beauty salons, fitness gyms, spas, and office teams across Nairobi with scheduled recurring pickup routes and dedicated invoicing.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#1363DF]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
          <HelpCircle className="size-4" />
          <span>Got Questions?</span>
        </div>
        <h2 className="mt-3 text-3xl font-bold text-[#092341] sm:text-4xl">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-base text-[#64748b]">
          Everything you need to know about our Nairobi garment care & pickup service.
        </p>
      </div>

      <div className="mt-10 space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.q}
              className={`rounded-2xl border transition-all ${
                isOpen
                  ? "border-[#1363DF] bg-white shadow-md"
                  : "border-[#e2e8f0] bg-white/70 hover:border-[#cbd5e1]"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-[#092341] sm:p-6"
                aria-expanded={isOpen}
              >
                <span className="text-base sm:text-lg">{faq.q}</span>
                <div
                  className={`flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F0F7FF] text-[#1363DF] transition-transform duration-200 ${
                    isOpen ? "rotate-180 bg-[#1363DF] text-white" : ""
                  }`}
                >
                  <ChevronDown className="size-4" />
                </div>
              </button>
              {isOpen && (
                <div className="border-t border-[#f1f5f9] px-5 pb-6 pt-3 text-sm leading-relaxed text-[#475569] sm:px-6">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
