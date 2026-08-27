"use client";

import { useActionState, useEffect, useMemo, useState, Suspense } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Loader2,
  MailCheck,
  MapPin,
  Shirt,
  UserRound,
  WalletCards,
  Sparkles,
} from "lucide-react";
import {
  createBookingAction,
  type BookingActionState,
} from "@/app/actions";
import {
  formatKes,
  isSupportedServiceArea,
  paymentInstructions,
  paymentOptions,
  serviceAreas,
} from "@/lib/business";
import {
  calculateQuote,
  serviceCatalog,
  serviceCategories,
  type ServiceCategory,
  type Quote,
  type ServiceId,
} from "@/lib/pricing";

type Slot = {
  value: string;
  label: string;
  remaining: number;
  capacity: number;
  available: boolean;
};

const initialState: BookingActionState = {
  ok: false,
  message: "",
};

const steps = [
  { label: "Area", icon: MapPin },
  { label: "Services", icon: Shirt },
  { label: "Schedule", icon: CalendarClock },
  { label: "Details", icon: UserRound },
  { label: "Pay", icon: WalletCards },
];

function dateOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toLocaleDateString("en-CA");
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1363DF] px-5 text-sm font-bold text-white shadow-md shadow-[#1363DF]/20 transition hover:bg-[#0F4C81] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <MailCheck className="size-4" aria-hidden="true" />
      )}
      {pending ? "Creating Booking Ticket..." : "Confirm Doorstep Booking"}
    </button>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-2 flex items-start gap-2 text-xs font-semibold text-[#dc2626]">
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}

function QuotePreview({ quote }: { quote: Quote }) {
  return (
    <section
      aria-live="polite"
      className="mt-4 rounded-xl border border-[#cbd5e1] bg-[#F0F7FF] p-4 text-[#092341]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#1363DF]">
            Live Estimate
          </p>
          <p className="mt-0.5 text-xs text-[#64748b]">
            Fresh Flow Quote Breakdown
          </p>
        </div>
        <p className="text-right text-xl font-extrabold text-[#092341]">
          {formatKes(quote.totalKe)}
        </p>
      </div>

      <div className="mt-3 space-y-1.5 text-xs text-[#475569]">
        {quote.lines.length > 0 ? (
          quote.lines.map((line) => (
            <div key={line.id} className="flex justify-between gap-3">
              <span>
                {line.name} × {line.quantity} {line.unit}
              </span>
              <span className="shrink-0 font-bold text-[#092341]">
                {formatKes(line.lineTotalKe)}
              </span>
            </div>
          ))
        ) : (
          <p>No services selected yet.</p>
        )}

        <div className="flex justify-between gap-3 border-t border-[#cbd5e1] pt-2">
          <span>Doorstep Pickup & Delivery / Service Fee</span>
          <span className="shrink-0 font-bold text-[#1363DF]">
            {quote.pickupDeliveryKe === 0 ? "FREE" : formatKes(quote.pickupDeliveryKe)}
          </span>
        </div>
        <div className="flex justify-between gap-3 text-sm font-bold text-[#092341]">
          <span>Grand Total</span>
          <span>{formatKes(quote.totalKe)}</span>
        </div>
      </div>
    </section>
  );
}

function BookingFormInner({ compact = false }: { compact?: boolean }) {
  const searchParams = useSearchParams();
  const [state, formAction] = useActionState(
    createBookingAction,
    initialState
  );
  const [step, setStep] = useState(0);
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("laundry");
  const [serviceArea, setServiceArea] = useState("");
  const [paymentOption, setPaymentOption] = useState("mpesa_till");
  const [pickupDate, setPickupDate] = useState(dateOffset(1));
  const [deliveryDate, setDeliveryDate] = useState(dateOffset(2));
  const [pickupSlots, setPickupSlots] = useState<Slot[]>([]);
  const [deliverySlots, setDeliverySlots] = useState<Slot[]>([]);
  const [pickupSlot, setPickupSlot] = useState("");
  const [deliverySlot, setDeliverySlot] = useState("");
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      serviceCatalog.map((service) => [
        service.id,
        service.id === "wash_fold" ? service.minimumQty : 0,
      ])
    )
  );

  useEffect(() => {
    const areaParam = searchParams.get("area");
    const serviceParam = searchParams.get("service");

    if (areaParam) {
      setServiceArea(areaParam);
    }
    if (serviceParam && serviceCatalog.some((s) => s.id === serviceParam)) {
      const targetService = serviceCatalog.find((s) => s.id === serviceParam);
      if (targetService) {
        setActiveCategory(targetService.category);
        setQuantities((prev) => ({
          ...prev,
          [serviceParam]: Math.max(1, targetService.minimumQty),
        }));
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (state.fieldErrors) {
      if (state.fieldErrors.serviceArea) {
        setStep(0);
      } else if (state.fieldErrors.services) {
        setStep(1);
      } else if (state.fieldErrors.pickupSlot || state.fieldErrors.deliverySlot) {
        setStep(2);
      } else if (
        state.fieldErrors.customerName ||
        state.fieldErrors.customerPhone ||
        state.fieldErrors.customerEmail ||
        state.fieldErrors.address
      ) {
        setStep(3);
      } else if (state.fieldErrors.consentUpdates || state.fieldErrors.paymentOption) {
        setStep(4);
      }
    }
  }, [state.fieldErrors]);

  const quote = useMemo(
    () =>
      calculateQuote(
        serviceCatalog.map((service) => ({
          id: service.id,
          quantity: quantities[service.id] || 0,
        }))
      ),
    [quantities]
  );
  const areaSupported = isSupportedServiceArea(serviceArea);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSlots() {
      const response = await fetch(`/api/slots?date=${pickupDate}`, {
        signal: controller.signal,
      });
      const data = (await response.json()) as { slots: Slot[] };
      setPickupSlots(data.slots || []);
      const firstAvailable = data.slots?.find((slot) => slot.available);

      if (firstAvailable && !data.slots.some((slot) => slot.value === pickupSlot)) {
        setPickupSlot(firstAvailable.value);
      }
    }

    loadSlots().catch(() => setPickupSlots([]));
    return () => controller.abort();
  }, [pickupDate, pickupSlot]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSlots() {
      const response = await fetch(`/api/slots?date=${deliveryDate}`, {
        signal: controller.signal,
      });
      const data = (await response.json()) as { slots: Slot[] };
      setDeliverySlots(data.slots || []);
      const firstAvailable = data.slots?.find((slot) => slot.available);

      if (
        firstAvailable &&
        !data.slots.some((slot) => slot.value === deliverySlot)
      ) {
        setDeliverySlot(firstAvailable.value);
      }
    }

    loadSlots().catch(() => setDeliverySlots([]));
    return () => controller.abort();
  }, [deliveryDate, deliverySlot]);

  if (state.ok && state.confirmation) {
    const instructions = paymentInstructions(
      state.confirmation.paymentOption as Parameters<
        typeof paymentInstructions
      >[0]
    );

    return (
      <section className="rounded-2xl border border-[#bbf7d0] bg-white p-6 shadow-xl lg:p-8 text-[#092341]">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0fdf4] text-[#16a34a]">
            <CheckCircle2 className="size-7" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#16a34a]">
              Booking Confirmed
            </p>
            <h2 className="mt-1 text-2xl font-black text-[#092341]">
              Ticket ID: {state.confirmation.ticketId}
            </h2>
            <p className="mt-2 text-xs text-[#64748b]">
              Pickup/Date: <strong>{formatDate(state.confirmation.pickupDatetime)}</strong>
            </p>
            <p className="text-xs text-[#64748b]">
              Delivery/Completion: <strong>{formatDate(state.confirmation.deliveryDatetime)}</strong>
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] p-4">
          <p className="text-sm font-bold text-[#092341]">
            Estimated Total: {formatKes(state.confirmation.totalKe)}
          </p>
          <ul className="mt-3 space-y-2 text-xs text-[#475569]">
            {instructions.map((instruction) => (
              <li key={instruction} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#1363DF]" />
                <span>{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-[#cbd5e1] bg-white p-6 shadow-xl lg:p-8 text-[#092341]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#f1f5f9] pb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#1363DF]">
            Book Service Ticket
          </p>
          <h2 className="mt-0.5 text-xl font-bold text-[#092341]">
            Schedule Order Ticket
          </h2>
        </div>
        <div className="rounded-xl bg-[#ffe823]/20 px-3 py-1.5 text-right">
          <p className="text-[10px] font-bold text-[#64748b]">Estimate</p>
          <p className="text-base font-extrabold text-[#092341]">
            {formatKes(quote.totalKe)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-1 rounded-xl bg-[#F0F7FF] p-1.5">
        {steps.map((item, index) => {
          const Icon = item.icon;
          const active = step === index;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setStep(index)}
              className={`flex min-h-11 items-center justify-center gap-1.5 rounded-lg text-xs font-bold transition ${
                active
                  ? "bg-white text-[#1363DF] shadow-xs"
                  : "text-[#64748b] hover:bg-white/60"
              }`}
              aria-current={active ? "step" : undefined}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span className={compact ? "sr-only sm:not-sr-only" : ""}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <QuotePreview quote={quote} />

      {state.message && !state.ok ? (
        <div className="mt-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-3 text-xs font-semibold text-[#991b1b]">
          {state.message}
        </div>
      ) : null}

      {/* Step 0: Neighborhood Area */}
      <div className={step === 0 ? "mt-5 block" : "hidden"}>
        <label
          htmlFor="serviceArea"
          className="text-sm font-bold text-[#092341]"
        >
          Nairobi Area / Neighborhood
        </label>
        <input
          id="serviceArea"
          name="serviceArea"
          value={serviceArea}
          onChange={(event) => setServiceArea(event.target.value)}
          placeholder="e.g. Westlands, Kilimani, Lavington, Karen..."
          className="mt-2 min-h-12 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-4 text-sm text-[#092341] outline-none transition focus:border-[#1363DF] focus:bg-white focus:ring-2 focus:ring-[#1363DF]/20"
        />
        <FieldError message={state.fieldErrors?.serviceArea} />
        <div className="mt-3 rounded-xl bg-[#f8fafc] p-3 text-xs text-[#64748b]">
          {serviceArea ? (
            areaSupported ? (
              <span className="font-bold text-[#16a34a]">
                ✓ Service route available in &quot;{serviceArea}&quot;.
              </span>
            ) : (
              <span>
                Standard Nairobi coverage applies. Dispatch will confirm your location window.
              </span>
            )
          ) : (
            <span>Daily route zones: {serviceAreas.slice(0, 7).join(", ")}.</span>
          )}
        </div>
      </div>

      {/* Step 1: Multi-Category Service Selection */}
      <div className={step === 1 ? "mt-5 block" : "hidden"}>
        <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
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

        <div className="space-y-3">
          {serviceCatalog
            .filter((s) => s.category === activeCategory)
            .map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#e2e8f0] bg-white p-3.5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-[#092341]">
                      {service.name}
                    </h3>
                    {service.popular ? (
                      <span className="rounded-full bg-[#ffe823] px-2 py-0.5 text-[10px] font-bold text-[#092341]">
                        Popular
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 text-xs text-[#64748b]">
                    {service.description}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#1363DF]">
                    {formatKes(service.priceKe)} / {service.unit}
                    {service.minimumQty > 1 ? ` (Min: ${service.minimumQty} ${service.unit})` : ""}
                  </p>
                </div>
                <label className="flex flex-col items-end gap-1 text-[11px] font-bold text-[#64748b]">
                  Qty
                  <input
                    name={`qty_${service.id}`}
                    type="number"
                    min="0"
                    step={service.step}
                    value={quantities[service.id] || 0}
                    onChange={(event) =>
                      setQuantities((current) => ({
                        ...current,
                        [service.id]: Math.max(0, Number(event.target.value)),
                      }))
                    }
                    className="h-10 w-20 rounded-lg border border-[#cbd5e1] px-2 text-right text-sm font-bold text-[#092341] outline-none focus:border-[#1363DF] focus:ring-2 focus:ring-[#1363DF]/20"
                  />
                </label>
              </div>
            ))}
        </div>
        <FieldError message={state.fieldErrors?.services} />
      </div>

      {/* Step 2: Schedule */}
      <div className={step === 2 ? "mt-5 block" : "hidden"}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="pickupDate"
              className="text-xs font-bold uppercase text-[#092341]"
            >
              Service Date / Pickup Date
            </label>
            <input
              id="pickupDate"
              type="date"
              value={pickupDate}
              min={dateOffset(0)}
              onChange={(event) => setPickupDate(event.target.value)}
              className="mt-1.5 min-h-11 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 text-sm text-[#092341] outline-none focus:border-[#1363DF]"
            />
            <div className="mt-2.5 space-y-2">
              {pickupSlots.length > 0 ? (
                pickupSlots.map((slot) => (
                  <label
                    key={slot.value}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-medium ${
                      slot.available
                        ? "border-[#cbd5e1] bg-white text-[#092341]"
                        : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
                    }`}
                  >
                    <span>{slot.label}</span>
                    <input
                      type="radio"
                      name="pickupSlot"
                      value={slot.value}
                      checked={pickupSlot === slot.value}
                      disabled={!slot.available}
                      onChange={() => setPickupSlot(slot.value)}
                      className="size-4 accent-[#1363DF]"
                    />
                  </label>
                ))
              ) : (
                <p className="rounded-xl bg-[#fff8e8] p-3 text-xs text-[#715319]">
                  No windows available on this date.
                </p>
              )}
            </div>
            <FieldError message={state.fieldErrors?.pickupSlot} />
          </div>

          <div>
            <label
              htmlFor="deliveryDate"
              className="text-xs font-bold uppercase text-[#092341]"
            >
              Completion / Delivery Date
            </label>
            <input
              id="deliveryDate"
              type="date"
              value={deliveryDate}
              min={pickupDate}
              onChange={(event) => setDeliveryDate(event.target.value)}
              className="mt-1.5 min-h-11 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 text-sm text-[#092341] outline-none focus:border-[#1363DF]"
            />
            <div className="mt-2.5 space-y-2">
              {deliverySlots.length > 0 ? (
                deliverySlots.map((slot) => (
                  <label
                    key={slot.value}
                    className={`flex items-center justify-between rounded-xl border px-3 py-2 text-xs font-medium ${
                      slot.available
                        ? "border-[#cbd5e1] bg-white text-[#092341]"
                        : "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]"
                    }`}
                  >
                    <span>{slot.label}</span>
                    <input
                      type="radio"
                      name="deliverySlot"
                      value={slot.value}
                      checked={deliverySlot === slot.value}
                      disabled={!slot.available}
                      onChange={() => setDeliverySlot(slot.value)}
                      className="size-4 accent-[#1363DF]"
                    />
                  </label>
                ))
              ) : (
                <p className="rounded-xl bg-[#fff8e8] p-3 text-xs text-[#715319]">
                  No delivery windows on this date.
                </p>
              )}
            </div>
            <FieldError message={state.fieldErrors?.deliverySlot} />
          </div>
        </div>
      </div>

      {/* Step 3: Contact Details */}
      <div className={step === 3 ? "mt-5 block" : "hidden"}>
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase text-[#092341]">
            Full Name
            <input
              name="customerName"
              placeholder="e.g. Jane Wanjiku"
              className="mt-1.5 min-h-11 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 text-sm text-[#092341] outline-none focus:border-[#1363DF]"
            />
            <FieldError message={state.fieldErrors?.customerName} />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-bold uppercase text-[#092341]">
              Phone Number
              <input
                name="customerPhone"
                inputMode="tel"
                placeholder="+254 789 920 270"
                className="mt-1.5 min-h-11 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 text-sm text-[#092341] outline-none focus:border-[#1363DF]"
              />
              <FieldError message={state.fieldErrors?.customerPhone} />
            </label>
            <label className="block text-xs font-bold uppercase text-[#092341]">
              Email Address
              <input
                name="customerEmail"
                inputMode="email"
                placeholder="jane@example.com"
                className="mt-1.5 min-h-11 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 text-sm text-[#092341] outline-none focus:border-[#1363DF]"
              />
              <FieldError message={state.fieldErrors?.customerEmail} />
            </label>
          </div>
          <label className="block text-xs font-bold uppercase text-[#092341]">
            Address & Location Details
            <textarea
              name="address"
              rows={2}
              placeholder="Building name, apartment number, street name, landmark..."
              className="mt-1.5 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] p-3 text-sm text-[#092341] outline-none focus:border-[#1363DF]"
            />
            <FieldError message={state.fieldErrors?.address} />
          </label>
          <label className="block text-xs font-bold uppercase text-[#092341]">
            Special Instructions / Gate Code (Optional)
            <textarea
              name="specialInstructions"
              rows={2}
              placeholder="Specific cleaning instructions, gate security notes..."
              className="mt-1.5 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] p-3 text-sm text-[#092341] outline-none focus:border-[#1363DF]"
            />
          </label>
        </div>
      </div>

      {/* Step 4: Payment */}
      <div className={step === 4 ? "mt-5 block" : "hidden"}>
        <div className="space-y-2.5">
          {paymentOptions.map((option) => (
            <label
              key={option.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#cbd5e1] bg-white p-3.5 cursor-pointer"
            >
              <div>
                <span className="block text-sm font-bold text-[#092341]">
                  {option.label}
                </span>
                <span className="text-xs text-[#64748b]">{option.detail}</span>
              </div>
              <input
                type="radio"
                name="paymentOption"
                value={option.id}
                checked={paymentOption === option.id}
                onChange={() => setPaymentOption(option.id)}
                className="size-4 accent-[#1363DF]"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 rounded-xl bg-[#F0F7FF] p-4 text-[#092341]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1363DF]">
            Order Final Summary
          </h3>
          <div className="mt-2 space-y-1 text-xs text-[#475569]">
            {quote.lines.map((line) => (
              <div key={line.id} className="flex justify-between gap-4">
                <span>
                  {line.name} × {line.quantity} {line.unit}
                </span>
                <span className="font-bold text-[#092341]">
                  {formatKes(line.lineTotalKe)}
                </span>
              </div>
            ))}
            <div className="flex justify-between border-t border-[#cbd5e1] pt-1.5">
              <span>Service / Delivery Fee</span>
              <span className="font-bold text-[#1363DF]">
                {quote.pickupDeliveryKe === 0 ? "FREE" : formatKes(quote.pickupDeliveryKe)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-[#092341]">
              <span>Total Amount</span>
              <span>{formatKes(quote.totalKe)}</span>
            </div>
          </div>
        </div>

        <label className="mt-4 flex items-start gap-3 rounded-xl border border-[#cbd5e1] bg-white p-3 text-xs text-[#64748b] cursor-pointer">
          <input
            type="checkbox"
            name="consentUpdates"
            className="mt-0.5 size-4 accent-[#1363DF]"
          />
          <span>
            I agree to receive order status ticket updates & digital receipts by email and SMS.
          </span>
        </label>
        <FieldError message={state.fieldErrors?.consentUpdates} />

        <div className="mt-4">
          <SubmitButton />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#f1f5f9] pt-4">
        <button
          type="button"
          onClick={() => setStep((current) => Math.max(current - 1, 0))}
          disabled={step === 0}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#cbd5e1] px-4 text-xs font-bold text-[#475569] transition hover:border-[#1363DF] hover:text-[#1363DF] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          <span>Back</span>
        </button>
        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep((current) => Math.min(current + 1, 4))}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#092341] px-5 text-xs font-bold text-white transition hover:bg-[#1363DF]"
          >
            <span>Next Step</span>
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </form>
  );
}

export function BookingForm({ compact = false }: { compact?: boolean }) {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-[#64748b]">Loading booking form...</div>}>
      <BookingFormInner compact={compact} />
    </Suspense>
  );
}
