import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Globe,
  Globe2,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { formatKes } from "@/lib/business";
import { serviceCatalog, serviceCategories } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Official Services & Pricing Catalog | Fresh Flow Nairobi",
  description:
    "Transparent international-standard rates for Laundry, House Cleaning, Carpet Cleaning, and Pest Fumigation in Nairobi, Kenya.",
};

const KES_PER_USD = 130;

function formatUsd(kesAmount: number) {
  const usd = kesAmount / KES_PER_USD;
  return `$${usd.toFixed(2)} USD`;
}

export default function ServicesPage() {
  return (
    <main className="bg-[#f8fafc] py-12 lg:py-20 text-[#092341]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HERO BANNER SECTION */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#cbd5e1] bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#1363DF] shadow-xs">
            <Globe className="size-4 text-[#1363DF]" />
            <span>International Standard • Official Nairobi Rates</span>
          </div>

          <h1 className="mt-4 text-4xl font-black text-[#092341] sm:text-5xl lg:text-6xl tracking-tight">
            Services & Pricing Catalog
          </h1>

          <p className="mt-4 text-base leading-relaxed text-[#64748b] sm:text-lg max-w-2xl mx-auto">
            Transparent pricing with zero hidden fees. Guaranteed 24-hour turnaround for laundry, professional deep house cleaning, shampoo carpet care, and odorless pest fumigation.
          </p>

          {/* Quick Value Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-2 text-[#092341]">
              <Truck className="size-4 text-[#1363DF]" />
              <span>FREE Pickup over KSh 2,500 (~$19.23 USD)</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-2 text-[#092341]">
              <Clock className="size-4 text-[#16a34a]" />
              <span>24-Hour Express Return</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-2 text-[#092341]">
              <ShieldCheck className="size-4 text-[#38BDF8]" />
              <span>100% Satisfaction Guarantee</span>
            </span>
          </div>
        </div>

        {/* SERVICE CATEGORIES SECTIONS */}
        <div className="mt-16 space-y-16">
          {serviceCategories.map((cat) => {
            const catServices = serviceCatalog.filter((s) => s.category === cat.id);

            return (
              <section key={cat.id} id={cat.id} className="scroll-mt-24">
                <div className="flex items-center justify-between border-b border-[#cbd5e1] pb-4 mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{cat.icon}</span>
                    <div>
                      <h2 className="text-2xl font-black text-[#092341] sm:text-3xl">
                        {cat.name}
                      </h2>
                      <p className="text-xs text-[#64748b]">
                        Premium solutions tailored for Nairobi households & commercial clients
                      </p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex rounded-full bg-[#1363DF]/10 px-3.5 py-1 text-xs font-bold text-[#1363DF]">
                    {catServices.length} Services Available
                  </span>
                </div>

                {/* Ultra-Responsive Cards Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {catServices.map((service) => (
                    <div
                      key={service.id}
                      className="group flex flex-col justify-between rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-xs transition-all hover:border-[#1363DF] hover:shadow-xl"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg font-extrabold text-[#092341] group-hover:text-[#1363DF] transition">
                            {service.name}
                          </h3>
                          {service.popular && (
                            <span className="shrink-0 rounded-full bg-[#ffe823] px-2 py-0.5 text-[10px] font-black text-[#092341]">
                              Popular
                            </span>
                          )}
                        </div>

                        <div className="mt-3 rounded-2xl bg-[#F0F7FF] p-3 border border-[#bfdbfe]">
                          <span className="text-xl font-black text-[#1363DF]">
                            {formatKes(service.priceKe)}
                          </span>
                          <span className="text-xs font-bold text-[#475569]"> / {service.unit}</span>
                          <div className="text-[11px] text-[#64748b] font-semibold mt-0.5">
                            Approx. {formatUsd(service.priceKe)}
                          </div>
                        </div>

                        <p className="mt-3 text-xs leading-relaxed text-[#64748b]">
                          {service.description}
                        </p>

                        <div className="mt-5 space-y-2 border-t border-[#f1f5f9] pt-4 text-xs text-[#475569]">
                          <div className="flex items-center gap-2">
                            <Clock className="size-4 text-[#1363DF]" />
                            <span>Quick Turnaround Service</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-4 text-[#16a34a]" />
                            <span>
                              {service.minimumQty > 1
                                ? `Minimum order: ${service.minimumQty} ${service.unit}`
                                : "No minimum quantity limit"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 border-t border-[#f1f5f9] pt-4">
                        <Link
                          href={`/book?service=${service.id}`}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#092341] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#1363DF] shadow-sm"
                        >
                          <span>Book {service.name}</span>
                          <ArrowRight className="size-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* CORPORATE, EMBASSY & B2B CONTRACT RATE CARD SECTION */}
        <section className="mt-20 rounded-3xl bg-[#092341] p-8 text-white shadow-2xl lg:p-12">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#ffe823]">
                <Building2 className="size-4 text-[#38BDF8]" />
                <span>Commercial & Embassy Rate Cards</span>
              </div>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                B2B Corporate & Diplomatic Contracts
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/80 max-w-2xl">
                We handle high-capacity weekly linen contracts, uniform dry cleaning, and facility pest control for Nairobi embassies, hotels, corporate offices, medical clinics, and wellness spas.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-bold text-[#e2e8f0]">
                <span>✓ Monthly Itemized Invoicing</span>
                <span>✓ Dedicated Fleet Dispatch</span>
                <span>✓ SLA Guarantees</span>
              </div>
            </div>

            <div className="lg:col-span-4 text-left lg:text-right">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-[#ffe823] px-7 py-4 text-sm font-extrabold text-[#092341] transition-all hover:bg-[#fff17a] hover:scale-[1.03] active:scale-[0.98] shadow-xl shadow-[#ffe823]/20"
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
