"use client";

import { useState } from "react";
import { Plus, X, Store, CheckCircle2, Loader2 } from "lucide-react";
import { createWalkInOrderAction } from "@/app/admin/actions";
import { formatKes } from "@/lib/business";
import { serviceCatalog, ServiceCategory, serviceCategories } from "@/lib/pricing";

export function WalkInOrderModal() {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [category, setCategory] = useState<ServiceCategory>("laundry");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");

  const selectedServices = serviceCatalog.filter((s) => (quantities[s.id] || 0) > 0);
  const subtotal = selectedServices.reduce((sum, s) => sum + (quantities[s.id] || 0) * s.priceKe, 0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    formData.append("quantitiesJson", JSON.stringify(quantities));

    const res = await createWalkInOrderAction(formData);
    setPending(false);

    if (res.ok) {
      setMessage("✓ Walk-in order created & receipt generated successfully!");
      setTimeout(() => {
        setOpen(false);
        setQuantities({});
        setMessage("");
      }, 1500);
    } else {
      setMessage(res.message || "Failed to create walk-in order.");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-[#16a34a] px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#15803d]"
      >
        <Plus className="size-4" />
        <span>➕ New Walk-In Order</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#cbd5e1] bg-white p-6 shadow-2xl lg:p-8 text-[#092341]">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
              <div className="flex items-center gap-2">
                <Store className="size-5 text-[#16a34a]" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#16a34a]">
                    Store POS Register
                  </span>
                  <h3 className="text-xl font-black text-[#092341]">
                    Log Walk-In Customer Order
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#092341]"
              >
                <X className="size-5" />
              </button>
            </div>

            {message ? (
              <div className={`my-4 rounded-xl p-3 text-xs font-bold ${message.includes("✓") ? "bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]" : "bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]"}`}>
                {message}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#092341]">
                    Customer Name *
                  </label>
                  <input
                    name="customerName"
                    required
                    placeholder="e.g. John Kamau"
                    className="mt-1 min-h-11 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 text-xs text-[#092341] outline-none focus:border-[#1363DF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#092341]">
                    Phone Number *
                  </label>
                  <input
                    name="customerPhone"
                    required
                    placeholder="+254 789 920 270"
                    className="mt-1 min-h-11 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 text-xs text-[#092341] outline-none focus:border-[#1363DF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-[#092341]">
                    Email Address *
                  </label>
                  <input
                    name="customerEmail"
                    type="email"
                    required
                    placeholder="client@example.com"
                    className="mt-1 min-h-11 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 text-xs text-[#092341] outline-none focus:border-[#1363DF]"
                  />
                </div>
              </div>

              {/* Service Selection Category Tabs */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#092341] mb-2">
                  Select Services & Items
                </label>
                <div className="flex gap-1.5 overflow-x-auto pb-2">
                  {serviceCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                        category === cat.id
                          ? "bg-[#092341] text-white"
                          : "border border-[#cbd5e1] bg-[#f8fafc] text-[#64748b] hover:bg-white"
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>

                <div className="mt-3 max-h-48 overflow-y-auto space-y-2 rounded-2xl border border-[#e2e8f0] p-3 bg-[#f8fafc]">
                  {serviceCatalog
                    .filter((s) => s.category === category)
                    .map((s) => {
                      const qty = quantities[s.id] || 0;
                      return (
                        <div
                          key={s.id}
                          className="flex items-center justify-between gap-3 rounded-xl border border-[#e2e8f0] bg-white p-2.5 text-xs"
                        >
                          <div>
                            <span className="font-bold text-[#092341]">{s.name}</span>
                            <span className="ml-2 font-bold text-[#1363DF]">
                              ({formatKes(s.priceKe)}/{s.unit})
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min="0"
                              value={qty}
                              onChange={(e) =>
                                setQuantities((prev) => ({
                                  ...prev,
                                  [s.id]: Math.max(0, Number(e.target.value)),
                                }))
                              }
                              className="h-8 w-16 rounded-lg border border-[#cbd5e1] px-2 text-center text-xs font-bold"
                            />
                            <span className="w-14 text-right font-bold text-[#092341]">
                              {formatKes(qty * s.priceKe)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Order Payment & Total Summary */}
              <div className="grid gap-3 sm:grid-cols-2 bg-[#F0F7FF] p-4 rounded-2xl border border-[#bfdbfe]">
                <div>
                  <label className="block text-xs font-bold uppercase text-[#092341]">
                    Payment Method
                  </label>
                  <select
                    name="paymentOption"
                    className="mt-1 min-h-10 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-xs font-bold"
                  >
                    <option value="mpesa_till">M-Pesa Buy Goods</option>
                    <option value="mpesa_paybill">M-Pesa Paybill</option>
                    <option value="pay_on_delivery">Cash on Collection/Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-[#092341]">
                    Payment Status
                  </label>
                  <select
                    name="paymentStatus"
                    className="mt-1 min-h-10 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-xs font-bold"
                  >
                    <option value="PAID">PAID ✓</option>
                    <option value="PENDING">PENDING ⏳</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#94a3b8]">Walk-In Order Total</span>
                  <div className="text-2xl font-black text-[#16a34a]">{formatKes(subtotal)}</div>
                </div>

                <button
                  type="submit"
                  disabled={pending || subtotal === 0}
                  className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#16a34a] px-6 text-xs font-extrabold text-white shadow-md transition hover:bg-[#15803d] disabled:opacity-40"
                >
                  {pending ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                  <span>Generate Walk-In Ticket & Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
