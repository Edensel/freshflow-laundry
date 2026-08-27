import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Sparkles, ShieldCheck } from "lucide-react";
import { formatKes } from "@/lib/business";
import { serviceCatalog, serviceCategories } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Services & Pricing Catalog in Nairobi | Fresh Flow",
  description:
    "Transparent KSh pricing for Laundry, House Cleaning, Carpet Cleaning, and Fumigation services in Nairobi.",
};

export default function ServicesPage() {
  return (
    <main className="bg-[#f8fafc] py-14 lg:py-20 text-[#092341]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1363DF]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
            <Sparkles className="size-4" />
            <span>Official Nairobi Rates</span>
          </div>
          <h1 className="mt-3 text-4xl font-extrabold text-[#092341] sm:text-5xl">
            Services & Pricing Catalog
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[#64748b]">
            Transparent pricing with zero hidden fees. Professional Laundry, House Cleaning, Carpet Cleaning, and Fumigation across Nairobi.
          </p>
        </div>

        {/* Category Sections */}
        <div className="mt-14 space-y-16">
          {serviceCategories.map((cat) => {
            const catServices = serviceCatalog.filter((s) => s.category === cat.id);

            return (
              <section key={cat.id}>
                <div className="flex items-center gap-3 border-b border-[#cbd5e1] pb-3 mb-8">
                  <span className="text-2xl">{cat.icon}</span>
                  <h2 className="text-2xl font-black text-[#092341]">{cat.name}</h2>
                  <span className="rounded-full bg-[#1363DF]/10 px-3 py-0.5 text-xs font-bold text-[#1363DF]">
                    {catServices.length} Services
                  </span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {catServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex flex-col justify-between rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs transition-all hover:border-[#1363DF] hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-bold text-[#092341]">
                            {service.name}
                          </h3>
                          <span className="rounded-xl bg-[#F0F7FF] px-3 py-1.5 text-xs font-black text-[#1363DF]">
                            {formatKes(service.priceKe)} / {service.unit}
                          </span>
                        </div>
                        <p className="mt-3 text-xs leading-relaxed text-[#64748b]">
                          {service.description}
                        </p>

                        <div className="mt-6 space-y-2 border-t border-[#f1f5f9] pt-4 text-xs text-[#475569]">
                          <div className="flex items-center gap-2">
                            <Clock className="size-4 text-[#1363DF]" />
                            <span>Standard Service Window</span>
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
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#092341] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#1363DF]"
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

        {/* Value Highlights */}
        <section className="mt-20 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Free Delivery Over KSh 2,500",
              desc: "Doorstep pickup and delivery is 100% free for orders totaling KSh 2,500 or more.",
            },
            {
              title: "Professional Trained Crew",
              desc: "Background-checked cleaners and pest control technicians equipped with industrial gear.",
            },
            {
              title: "Instant Digital Receipts",
              desc: "Track every step of your order using your digital Ticket ID with PDF email receipts.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-6 shadow-xs"
            >
              <ShieldCheck className="size-6 shrink-0 text-[#1363DF]" />
              <div>
                <h3 className="font-bold text-[#092341]">{item.title}</h3>
                <p className="mt-1 text-xs text-[#64748b]">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
