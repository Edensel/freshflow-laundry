"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Globe,
  Minus,
  Plus,
  RefreshCw,
  Sparkles,
  Truck,
} from "lucide-react";
import { formatKes } from "@/lib/business";
import {
  calculateQuote,
  serviceCatalog,
  serviceCategories,
  type ServiceCategory,
} from "@/lib/pricing";

// Approximate conversion for international expat reference (1 USD ~ 130 KSh)
const KES_PER_USD = 130;

function formatUsd(kesAmount: number) {
  const usd = kesAmount / KES_PER_USD;
  return `$${usd.toFixed(2)} USD`;
}

export function InteractiveEstimator() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("laundry");
  const [showUsd, setShowUsd] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({
    wash_fold: 5,
    house_1bd: 0,
    carpet_medium: 0,
    fumigation_1bd: 0,
  });

  const selectedList = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([id, quantity]) => ({ id, quantity }));

  const quote = calculateQuote(selectedList);

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const service = serviceCatalog.find((s) => s.id === id);
      const step = service?.step || 1;
      const next = Math.max(0, current + delta * step);
      return { ...prev, [id]: next };
    });
  };

  const freeDeliveryThreshold = 2500;
  const progressPercent = Math.min(100, Math.round((quote.subtotalKe / freeDeliveryThreshold) * 100));

  return (
    <div className="rounded-3xl border border-[#cbd5e1] bg-white p-5 shadow-2xl sm:p-7 lg:p-8 text-[#092341] transition-all">
      {/* Header Bar with International Currency Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f5f9] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
            <Calculator className="size-4" />
            <span>International Service Pricing Engine</span>
          </div>
          <h3 className="mt-1 text-2xl font-black text-[#092341] sm:text-3xl">
            Instant Rate Calculator
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Currency Toggle */}
          <button
            type="button"
            onClick={() => setShowUsd((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#cbd5e1] bg-[#f8fafc] px-3.5 py-1.5 text-xs font-extrabold text-[#092341] transition hover:bg-white hover:border-[#1363DF]"
          >
            <Globe className="size-3.5 text-[#1363DF]" />
            <span>{showUsd ? "USD ($) View" : "KSh Rate View"}</span>
          </button>
        </div>
      </div>

      {/* Free Delivery Meter */}
      <div className="mt-5 rounded-2xl bg-[#F0F7FF] p-4 border border-[#bfdbfe]">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1.5 text-[#092341]">
            <Truck className="size-4 text-[#1363DF]" />
            <span>Nairobi Doorstep Pickup & Delivery Meter</span>
          </span>
          <span className="text-[#1363DF]">
            {quote.subtotalKe >= freeDeliveryThreshold ? (
              <span className="text-[#16a34a] font-extrabold flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> 100% FREE!
              </span>
            ) : (
              `${progressPercent}%`
            )}
          </span>
        </div>

        <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[#cbd5e1]">
          <div
            className="h-full bg-gradient-to-r from-[#1363DF] via-[#38BDF8] to-[#10B981] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="mt-2 text-[11px] font-medium text-[#475569]">
          {quote.subtotalKe >= freeDeliveryThreshold ? (
            <span className="text-[#15803d] font-bold">
              🎉 Order qualifies for 100% FREE Doorstep Pickup & Delivery across Nairobi.
            </span>
          ) : (
            `Add ${formatKes(freeDeliveryThreshold - quote.subtotalKe)} (${formatUsd(freeDeliveryThreshold - quote.subtotalKe)}) more to unlock FREE Delivery!`
          )}
        </p>
      </div>

      {/* Category Tabs Bar */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {serviceCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeCategory === cat.id
                ? "bg-[#092341] text-white shadow-md scale-[1.02]"
                : "border border-[#cbd5e1] bg-[#f8fafc] text-[#475569] hover:bg-white hover:text-[#092341]"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Service Items Selection Grid */}
      <div className="mt-4 space-y-3">
        {serviceCatalog
          .filter((s) => s.category === activeCategory)
          .map((service) => {
            const currentQty = quantities[service.id] || 0;
            const isSelected = currentQty > 0;
            const itemPriceKes = service.priceKe;
            const lineTotalKes = Math.max(currentQty, service.minimumQty) * itemPriceKes;

            return (
              <div
                key={service.id}
                className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 transition-all ${
                  isSelected
                    ? "border-[#1363DF] bg-[#F0F7FF]/70 shadow-sm"
                    : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]"
                }`}
              >
                <div className="min-w-[180px] flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#092341] text-sm">
                      {service.name}
                    </span>
                    {service.popular && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ffe823] px-2.5 py-0.5 text-[10px] font-extrabold text-[#092341]">
                        <Sparkles className="size-3" />
                        Popular Choice
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[#64748b] leading-relaxed">
                    {service.description}
                  </p>
                  <p className="mt-1.5 text-xs font-bold text-[#1363DF]">
                    {formatKes(itemPriceKes)} / {service.unit}
                    {showUsd ? ` (~${formatUsd(itemPriceKes)})` : ""}
                    {service.minimumQty > 1 &&
                      ` • Min: ${service.minimumQty} ${service.unit}`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-[#cbd5e1] bg-white p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => updateQuantity(service.id, -1)}
                      disabled={currentQty === 0}
                      className="flex size-8 items-center justify-center rounded-lg text-[#475569] transition hover:bg-[#f1f5f9] disabled:opacity-30"
                      aria-label={`Decrease ${service.name}`}
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-12 text-center text-sm font-black text-[#092341]">
                      {currentQty} {service.unit === "kg" ? "kg" : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(service.id, 1)}
                      className="flex size-8 items-center justify-center rounded-lg text-[#1363DF] transition hover:bg-[#F0F7FF]"
                      aria-label={`Increase ${service.name}`}
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>

                  <div className="w-24 text-right">
                    <span className="block text-sm font-black text-[#092341]">
                      {currentQty > 0 ? formatKes(lineTotalKes) : "KSh 0"}
                    </span>
                    {showUsd && currentQty > 0 && (
                      <span className="block text-[10px] font-bold text-[#64748b]">
                        ~{formatUsd(lineTotalKes)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Returning Client Shortcut Banner */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-xs">
        <div className="flex items-center gap-2 text-[#092341]">
          <RefreshCw className="size-4 text-[#1363DF]" />
          <span className="font-bold">Returning Client? Quick Re-order Ticket</span>
        </div>
        <Link
          href="/track"
          className="font-extrabold text-[#1363DF] hover:underline"
        >
          Look Up Existing Ticket →
        </Link>
      </div>

      {/* Summary Box & Instant Book CTA */}
      <div className="mt-6 rounded-3xl bg-[#092341] p-6 text-white shadow-xl">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/80">Services Subtotal:</span>
          <span className="font-bold">
            {formatKes(quote.subtotalKe)} {showUsd ? `(~${formatUsd(quote.subtotalKe)})` : ""}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-white/80">
            <Truck className="size-4 text-[#38BDF8]" /> Doorstep Collection & Delivery:
          </span>
          <span className="font-bold text-[#38BDF8]">
            {quote.pickupDeliveryKe === 0 ? (
              <span className="inline-flex items-center gap-1 text-[#4ADE80] font-bold">
                <CheckCircle2 className="size-3.5" /> FREE
              </span>
            ) : (
              `${formatKes(quote.pickupDeliveryKe)} ${showUsd ? `(~${formatUsd(quote.pickupDeliveryKe)})` : ""}`
            )}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-white/20 pt-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
              Estimated Total Amount
            </span>
            <div className="text-3xl font-black text-[#ffe823]">
              {formatKes(quote.totalKe)}
            </div>
            {showUsd && (
              <div className="text-xs text-white/70 font-semibold mt-0.5">
                Approx. {formatUsd(quote.totalKe)}
              </div>
            )}
          </div>

          <Link
            href="/book"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-[#ffe823] px-7 py-4 text-sm font-extrabold text-[#092341] transition-all hover:bg-[#fff17a] hover:scale-[1.03] active:scale-[0.98] shadow-xl shadow-[#ffe823]/20"
          >
            <span>Book These Services</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
