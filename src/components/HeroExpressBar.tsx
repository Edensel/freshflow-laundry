"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Sparkles } from "lucide-react";
import { formatKes, serviceAreas } from "@/lib/business";
import { serviceCatalog, ServiceId } from "@/lib/pricing";

export function HeroExpressBar() {
  const [area, setArea] = useState<string>(serviceAreas[0]);
  const [serviceId, setServiceId] = useState<ServiceId>(serviceCatalog[0].id);

  const selectedService = serviceCatalog.find((s) => s.id === serviceId) || serviceCatalog[0];
  const isCorporate = (selectedService.id as string) === "corporate";
  const estimatePrice = isCorporate ? 0 : selectedService.priceKe * selectedService.minimumQty;

  return (
    <div className="mx-auto mt-8 max-w-4xl rounded-3xl border border-white/25 bg-white/10 p-4 shadow-2xl backdrop-blur-xl lg:p-6 text-white text-left">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3">
        <div className="flex items-center gap-2 text-xs font-extrabold text-[#ffe823]">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ADE80] opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-[#4ADE80]" />
          </span>
          <span>Nairobi Express Route Drivers Active</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium">
          <Clock className="size-3.5 text-[#38BDF8]" />
          <span>Next Pickup Window: Today 2:00 PM - 4:00 PM</span>
        </div>
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mt-4 grid gap-3 sm:grid-cols-12 items-center"
      >
        {/* Neighborhood Select */}
        <div className="sm:col-span-4">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70">
            1. Neighborhood
          </label>
          <div className="relative mt-1">
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full appearance-none rounded-xl border border-white/20 bg-white/10 px-3.5 py-3 pr-8 text-xs font-bold text-white outline-none focus:border-[#ffe823] focus:bg-white/20"
            >
              {serviceAreas.map((a) => (
                <option key={a} value={a} className="bg-[#092341] text-white">
                  📍 {a}
                </option>
              ))}
            </select>
            <MapPin className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
          </div>
        </div>

        {/* Service Select */}
        <div className="sm:col-span-4">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-white/70">
            2. Service Type
          </label>
          <div className="relative mt-1">
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value as ServiceId)}
              className="w-full appearance-none rounded-xl border border-white/20 bg-white/10 px-3.5 py-3 pr-8 text-xs font-bold text-white outline-none focus:border-[#ffe823] focus:bg-white/20"
            >
              {serviceCatalog.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#092341] text-white">
                  🧺 {s.name} ({(s.id as string) === "corporate" ? "Quote" : `${formatKes(s.priceKe)}/${s.unit}`})
                </option>
              ))}
            </select>
            <Sparkles className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-white/50" />
          </div>
        </div>

        {/* Quote & CTA */}
        <div className="sm:col-span-4 flex items-center gap-3">
          <div className="flex-1 rounded-xl border border-white/15 bg-black/20 p-2.5 text-center">
            <span className="block text-[9px] font-bold uppercase tracking-wider text-white/60">
              Est. Rate
            </span>
            <span className="text-base font-black text-[#ffe823]">
              {isCorporate ? "Custom Quote" : formatKes(estimatePrice)}
            </span>
          </div>

          <Link
            href={`/book?area=${encodeURIComponent(area)}&service=${serviceId}`}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#ffe823] px-5 text-xs font-black text-[#092341] shadow-xl transition hover:bg-[#fff17a] hover:scale-105 active:scale-95"
          >
            <span>Book Pickup</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </form>
    </div>
  );
}
