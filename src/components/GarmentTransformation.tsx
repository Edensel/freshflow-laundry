"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, Wand2 } from "lucide-react";

const transformations = [
  {
    id: "suits",
    label: "Suits & Formalwear",
    tagline: "Italian Steam Press Dry Cleaning",
    beforeText: "Wrinkled wool blend with collar oils and dull lapels",
    afterText: "Neat steam press, clean odor-free finish",
    image: "/images/original-site/hero-02.jpg",
    highlights: ["Fiber-safe dry cleaning", "Hand lapel pressing", "Breathable garment cover"],
  },
  {
    id: "bedding",
    label: "Duvets & Bedding",
    tagline: "Allergen Washing & Down Fluff Restore",
    beforeText: "Flattened duvet with trapped dust and dull fabric",
    afterText: "Plump down fill, sanitized, fresh linen feel",
    image: "/images/original-site/hero-03.jpg",
    highlights: ["Thermal sanitization wash", "Anti-allergen rinse", "Air-fluffed finish"],
  },
  {
    id: "daily",
    label: "Everyday Wash & Fold",
    tagline: "Gentle Wash & Tidy Fold",
    beforeText: "Mixed basket with tough collar stains and dye bleed risk",
    afterText: "Bright colors, soft touch, neatly folded into ready-to-wear stacks",
    image: "/images/original-site/washing.jpg",
    highlights: ["Color-separate cycles", "Zero harsh chemicals", "Neat bundled packaging"],
  },
];

export function GarmentTransformation() {
  const [activeTab, setActiveTab] = useState(0);

  const active = transformations[activeTab];

  return (
    <div className="rounded-3xl border border-[#cbd5e1] bg-white p-6 shadow-xl lg:p-10 text-[#092341]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f1f5f9] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1363DF]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
            <Wand2 className="size-4" />
            <span>Before & After</span>
          </div>
          <h3 className="mt-2 text-2xl font-black text-[#092341] sm:text-3xl">
            See the Difference
          </h3>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2">
          {transformations.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                activeTab === idx
                  ? "bg-[#092341] text-[#ffe823] shadow-md scale-[1.02]"
                  : "bg-[#f8fafc] text-[#475569] hover:bg-[#e2e8f0]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
        {/* Left Col: Transformation Details */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1363DF]">
              {active.tagline}
            </span>
            <h4 className="mt-1 text-2xl font-extrabold text-[#092341]">
              Before & After Refresh
            </h4>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] p-4 text-xs">
              <span className="font-bold text-[#991b1b] uppercase tracking-wider">Before Care:</span>
              <p className="mt-1.5 text-[#7f1d1d] font-medium leading-relaxed">
                {active.beforeText}
              </p>
            </div>

            <div className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-xs">
              <span className="font-bold text-[#166534] uppercase tracking-wider">After Fresh Flow:</span>
              <p className="mt-1.5 text-[#14532d] font-medium leading-relaxed">
                {active.afterText}
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[#94a3b8]">
              Key Care Standards:
            </p>
            {active.highlights.map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm font-semibold text-[#092341]">
                <CheckCircle2 className="size-4 text-[#1363DF]" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              href="/book"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#1363DF] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1363DF]/25 transition hover:bg-[#0F4C81]"
            >
              <span>Book {active.label} Care</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* Right Col: Image Container */}
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-[#cbd5e1] shadow-lg lg:col-span-6">
          <Image
            src={active.image}
            alt={active.label}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#092341]/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md">
              <Sparkles className="size-3.5 text-[#ffe823]" />
              Every Order Checked Before Delivery
            </span>
            <span className="text-xs font-semibold text-white/80">Nairobi Doorstep Service</span>
          </div>
        </div>
      </div>
    </div>
  );
}
