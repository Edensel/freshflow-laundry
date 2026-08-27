"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Minus,
  Plus,
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

export function InteractiveEstimator() {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("laundry");
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
    <div className="rounded-3xl border border-[#cbd5e1] bg-white p-6 shadow-2xl lg:p-8 text-[#092341]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f5f9] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
            <Calculator className="size-4" />
            <span>Interactive Multi-Service Calculator</span>
          </div>
          <h3 className="mt-1 text-2xl font-black text-[#092341]">
            Instant Price Estimator
          </h3>
        </div>
        <span className="rounded-full bg-[#1363DF]/10 px-3.5 py-1 text-xs font-bold text-[#1363DF]">
          Nairobi Official Rates
        </span>
      </div>

      {/* Free Delivery / Service Meter */}
      <div className="mt-5 rounded-2xl bg-[#F0F7FF] p-4 border border-[#bfdbfe]">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1.5 text-[#092341]">
            <Truck className="size-4 text-[#1363DF]" />
            <span>Free Delivery Meter</span>
          </span>
          <span className="text-[#1363DF]">
            {quote.subtotalKe >= freeDeliveryThreshold ? (
              <span className="text-[#16a34a] font-extrabold flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> UNLOCKED!
              </span>
            ) : (
              `${progressPercent}%`
            )}
          </span>
        </div>

        <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-[#cbd5e1]">
          <div
            className="h-full bg-gradient-to-r from-[#1363DF] to-[#10B981] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="mt-2 text-[11px] font-medium text-[#475569]">
          {quote.subtotalKe >= freeDeliveryThreshold ? (
            <span className="text-[#15803d] font-bold">
              🎉 Order qualifies for 100% FREE Doorstep Pickup & Delivery in Nairobi.
            </span>
          ) : (
            `Add ${formatKes(freeDeliveryThreshold - quote.subtotalKe)} more to unlock FREE Delivery!`
          )}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="mt-6 flex gap-1.5 overflow-x-auto pb-2">
        {serviceCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              activeCategory === cat.id
                ? "bg-[#092341] text-white shadow-md"
                : "border border-[#cbd5e1] bg-[#f8fafc] text-[#475569] hover:bg-white"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {serviceCatalog
          .filter((s) => s.category === activeCategory)
          .map((service) => {
            const currentQty = quantities[service.id] || 0;
            const isSelected = currentQty > 0;

            return (
              <div
                key={service.id}
                className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-3.5 transition-all ${
                  isSelected
                    ? "border-[#1363DF] bg-[#F0F7FF]/60 shadow-xs"
                    : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]"
                }`}
              >
                <div className="min-w-[160px] flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#092341]">
                      {service.name}
                    </span>
                    {service.popular && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#ffe823] px-2 py-0.5 text-[10px] font-bold text-[#092341]">
                        <Sparkles className="size-3" />
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748b]">
                    {formatKes(service.priceKe)} / {service.unit}
                    {service.minimumQty > 1 &&
                      ` (Min: ${service.minimumQty} ${service.unit})`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-xl border border-[#cbd5e1] bg-white p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => updateQuantity(service.id, -1)}
                      disabled={currentQty === 0}
                      className="flex size-7 items-center justify-center rounded-lg text-[#475569] transition hover:bg-[#f1f5f9] disabled:opacity-30"
                      aria-label={`Decrease ${service.name}`}
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-[#092341]">
                      {currentQty} {service.unit === "kg" ? "kg" : ""}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(service.id, 1)}
                      className="flex size-7 items-center justify-center rounded-lg text-[#1363DF] transition hover:bg-[#F0F7FF]"
                      aria-label={`Increase ${service.name}`}
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>

                  <span className="w-20 text-right text-sm font-bold text-[#092341]">
                    {currentQty > 0
                      ? formatKes(
                          Math.max(currentQty, service.minimumQty) *
                            service.priceKe
                        )
                      : "KSh 0"}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      <div className="mt-6 rounded-2xl border border-white/20 bg-[#092341] p-6 text-white shadow-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/80">Subtotal:</span>
          <span className="font-semibold">{formatKes(quote.subtotalKe)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-white/80">
            <Truck className="size-4 text-[#38BDF8]" /> Doorstep Pickup & Delivery:
          </span>
          <span className="font-semibold text-[#38BDF8]">
            {quote.pickupDeliveryKe === 0 ? (
              <span className="inline-flex items-center gap-1 text-[#4ADE80] font-bold">
                <CheckCircle2 className="size-3.5" /> FREE
              </span>
            ) : (
              formatKes(quote.pickupDeliveryKe)
            )}
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-white/20 pt-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">
              Estimated Total
            </span>
            <div className="text-3xl font-black text-[#ffe823]">
              {formatKes(quote.totalKe)}
            </div>
          </div>

          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-xl bg-[#ffe823] px-6 py-3.5 text-sm font-extrabold text-[#092341] transition-all hover:bg-[#fff17a] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ffe823]/20"
          >
            <span>Book These Services</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
