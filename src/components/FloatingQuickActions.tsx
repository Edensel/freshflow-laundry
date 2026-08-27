"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  Calculator,
  MessageCircle,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { businessConfig } from "@/lib/business";

export function FloatingQuickActions() {
  const [open, setOpen] = useState(false);
  const cleanPhone = businessConfig.phone.replace(/[\s+]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    "Hello Fresh Flow! I would like to inquire about doorstep laundry pickup & garment care."
  )}`;

  return (
    <div className="fixed bottom-20 right-4 z-40 hidden sm:block lg:bottom-6 lg:right-6">
      {open && (
        <div className="mb-3 w-72 rounded-2xl border border-white/20 bg-[#092341]/95 p-4 shadow-2xl backdrop-blur-md text-white animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#ffe823]">
              <Sparkles className="size-3.5" />
              Fresh Flow Direct
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white"
              aria-label="Close action menu"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl bg-[#25D366]/20 p-2.5 text-xs font-bold text-[#4ADE80] transition hover:bg-[#25D366]/30"
            >
              <MessageCircle className="size-4 text-[#25D366]" />
              <span>WhatsApp Direct Chat ({businessConfig.phone})</span>
            </a>

            <Link
              href="/book"
              className="flex items-center gap-3 rounded-xl bg-[#1363DF] p-2.5 text-xs font-bold text-white transition hover:bg-[#0F4C81]"
            >
              <CalendarCheck2 className="size-4" />
              <span>Book Doorstep Pickup</span>
            </Link>

            <a
              href="#estimator"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl bg-white/10 p-2.5 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <Calculator className="size-4 text-[#ffe823]" />
              <span>Instant Price Estimator</span>
            </a>

            <Link
              href="/track"
              className="flex items-center gap-3 rounded-xl bg-white/10 p-2.5 text-xs font-bold text-white transition hover:bg-white/20"
            >
              <Search className="size-4 text-[#38BDF8]" />
              <span>Track Order Ticket</span>
            </Link>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full bg-[#1363DF] px-4 py-3 text-xs font-extrabold text-white shadow-xl shadow-[#1363DF]/40 transition-all hover:bg-[#0F4C81] hover:scale-105 active:scale-95"
      >
        {open ? (
          <X className="size-5" />
        ) : (
          <>
            <Sparkles className="size-4 text-[#ffe823]" />
            <span>Quick Connect</span>
          </>
        )}
      </button>
    </div>
  );
}
