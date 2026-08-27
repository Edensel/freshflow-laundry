import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Globe,
  Leaf,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Wand2,
} from "lucide-react";
import { FaqSection } from "@/components/FaqSection";
import { FloatingQuickActions } from "@/components/FloatingQuickActions";
import { GarmentTransformation } from "@/components/GarmentTransformation";
import { HeroExpressBar } from "@/components/HeroExpressBar";
import { InteractiveEstimator } from "@/components/InteractiveEstimator";
import { QuickTrackWidget } from "@/components/QuickTrackWidget";
import { ServiceAreaChecker } from "@/components/ServiceAreaChecker";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { formatKes, serviceAreas } from "@/lib/business";
import { getPublicMetrics } from "@/lib/orders";
import { serviceCatalog } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export default async function Home() {
  const metrics = await getPublicMetrics();

  return (
    <main className="overflow-hidden bg-[#f8fafc]">
      {/* FLOATING ACTION BAR */}
      <FloatingQuickActions />

      {/* HERO SECTION - SENIOR ARCHITECT SIGNATURE STAGE */}
      <section className="relative isolate overflow-hidden bg-[#092341] text-white">
        <Image
          src="/images/original-site/hero-01.jpg"
          alt="Fresh Flow Masterpiece Garment Care Studio"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 object-cover object-center opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#092341]/95 via-[#092341]/85 to-[#092341]" />

        {/* Ambient Glow Orbs */}
        <div className="absolute left-1/2 top-1/4 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-[#1363DF]/30 blur-3xl" />
        <div className="absolute right-10 top-10 -z-10 h-64 w-64 rounded-full bg-[#38BDF8]/20 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            {/* Live International Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ffe823] backdrop-blur-md shadow-lg">
              <Globe className="size-4 text-[#38BDF8]" aria-hidden="true" />
              <span>World-Class Garment Care Standard • Nairobi, Kenya</span>
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl leading-tight">
              Flawless Garment Care <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#ffe823] via-[#38BDF8] to-[#93C5FD] bg-clip-text text-transparent">
                Doorstep Pickup & Delivery
              </span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-white/85 sm:text-xl max-w-3xl mx-auto font-normal">
              Experience fast, eco-friendly wash & fold, Italian suit dry cleaning, plush duvet care, and steam pressing — collected from your door in Nairobi and delivered back fresh within 24 hours.
            </p>

            {/* HERO EXPRESS QUICK SELECTOR BAR */}
            <HeroExpressBar />

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/book"
                className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-[#1363DF] px-8 text-base font-extrabold text-white shadow-xl shadow-[#1363DF]/40 transition-all hover:bg-[#0F4C81] hover:scale-[1.03] active:scale-[0.98]"
              >
                <CalendarCheck2 className="size-5" aria-hidden="true" />
                <span>Full Booking Form</span>
              </Link>
              <a
                href="#estimator"
                className="inline-flex min-h-14 items-center gap-3 rounded-2xl border border-white/30 bg-white/10 px-7 text-base font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-[1.03]"
              >
                <Sparkles className="size-5 text-[#ffe823]" aria-hidden="true" />
                <span>Estimate Price</span>
              </a>
              <Link
                href="/track"
                className="inline-flex min-h-14 items-center gap-2 rounded-2xl border border-white/20 bg-black/20 px-6 text-base font-semibold text-white/90 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
              >
                <Search className="size-5 text-[#38BDF8]" aria-hidden="true" />
                <span>Track Ticket</span>
              </Link>
            </div>

            {/* Animated Social Proof Ticker */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/15 pt-8 text-left sm:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
                <div className="flex items-center gap-1 text-[#ffe823]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="mt-1 text-2xl font-black text-white">4.9 / 5.0</p>
                <p className="text-xs text-white/70">Nairobi Customer Rating</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-[#38BDF8]">
                  <Clock3 className="size-4" />
                  <span className="text-xs font-bold uppercase">Speed</span>
                </div>
                <p className="mt-1 text-2xl font-black text-white">24 Hours</p>
                <p className="text-xs text-white/70">Express Delivery</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-[#4ADE80]">
                  <Leaf className="size-4" />
                  <span className="text-xs font-bold uppercase">Eco Wash</span>
                </div>
                <p className="mt-1 text-2xl font-black text-white">100% Safe</p>
                <p className="text-xs text-white/70">Fiber Detergents</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-[#F472B6]">
                  <Truck className="size-4" />
                  <span className="text-xs font-bold uppercase">Free Route</span>
                </div>
                <p className="mt-1 text-2xl font-black text-white">KSh 0</p>
                <p className="text-xs text-white/70">Pickup over KSh 2,500</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GARMENT BEFORE & AFTER TRANSFORMATION SHOWCASE */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GarmentTransformation />
        </div>
      </section>

      {/* WHY NAIROBI LOVES US / BRAND HIGHLIGHTS */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1363DF]">
              The International Garment Standard
            </span>
            <h2 className="mt-2 text-3xl font-black text-[#092341] sm:text-4xl">
              Why Nairobi Chooses Fresh Flow
            </h2>
            <p className="mt-3 text-base text-[#64748b]">
              Combining high-capacity modern washing tech, eco-friendly gentle detergents, doorstep convenience, and full ticket tracking transparency.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-[#e2e8f0] bg-[#F0F7FF]/50 p-6 transition-all hover:border-[#1363DF] hover:shadow-xl">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#1363DF] text-white shadow-md shadow-[#1363DF]/30">
                <Truck className="size-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#092341]">
                Doorstep Pickup & Delivery
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
                No navigating traffic or carrying heavy laundry bags. We collect from your door in Nairobi and return fresh garments within 24h.
              </p>
            </div>

            <div className="rounded-3xl border border-[#e2e8f0] bg-[#F0F7FF]/50 p-6 transition-all hover:border-[#1363DF] hover:shadow-xl">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#1363DF] text-white shadow-md shadow-[#1363DF]/30">
                <Sparkles className="size-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#092341]">
                Master Stain & Fiber Care
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
                Specialized treatments for suits, silks, whites, and woolens using non-allergenic, fiber-safe washing agents.
              </p>
            </div>

            <div className="rounded-3xl border border-[#e2e8f0] bg-[#F0F7FF]/50 p-6 transition-all hover:border-[#1363DF] hover:shadow-xl">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#1363DF] text-white shadow-md shadow-[#1363DF]/30">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#092341]">
                Order Ticket Transparency
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
                Every order gets an instant Ticket ID. Follow exact status online from collection to washing, pressing, and dispatch.
              </p>
            </div>

            <div className="rounded-3xl border border-[#e2e8f0] bg-[#F0F7FF]/50 p-6 transition-all hover:border-[#1363DF] hover:shadow-xl">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#1363DF] text-white shadow-md shadow-[#1363DF]/30">
                <CalendarCheck2 className="size-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-[#092341]">
                Instant M-Pesa Receipts
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#64748b]">
                Clear KSh prices with zero hidden fees. Pay seamlessly via M-Pesa Buy Goods/Paybill or cash upon delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE LIVE PRICE CALCULATOR & ESTIMATOR */}
      <section id="estimator" className="bg-[#f8fafc] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            {/* Left Col: Services List */}
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1363DF]">
                Transparent Rates
              </span>
              <h2 className="mt-2 text-3xl font-black text-[#092341] sm:text-4xl">
                Custom Care For Every Item
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#64748b]">
                Calculate your exact laundry cost in real-time. No hidden surcharges or surprise weight fees.
              </p>

              <div className="mt-8 space-y-4">
                {serviceCatalog.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-start gap-4 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F7FF] text-[#1363DF]">
                      <CheckCircle2 className="size-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[#092341]">{service.name}</h4>
                        <span className="rounded-lg bg-[#1363DF]/10 px-2.5 py-0.5 text-xs font-bold text-[#1363DF]">
                          {service.id === "corporate"
                            ? "Custom Quote"
                            : `${formatKes(service.priceKe)}/${service.unit}`}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#64748b]">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-3xl bg-[#092341] p-6 text-white shadow-xl">
                <div className="flex items-center gap-3">
                  <Building2 className="size-6 text-[#38BDF8]" />
                  <h4 className="font-bold text-lg">Commercial & B2B Contracts</h4>
                </div>
                <p className="mt-2 text-xs text-white/80 leading-relaxed">
                  We handle weekly linen, towel, and uniform contracts for Nairobi hotels, gyms, spas, clinics, and offices.
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#ffe823] hover:underline"
                >
                  <span>Request Commercial Rate Card</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Col: Interactive Calculator */}
            <div className="lg:col-span-7">
              <InteractiveEstimator />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICE AREA NEIGHBORHOOD CHECKER */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#1363DF]">
                Nairobi Route Coverage
              </span>
              <h2 className="mt-2 text-3xl font-black text-[#092341] sm:text-4xl">
                Daily Pickup Routes Across Nairobi
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[#64748b]">
                Our mobile courier vans operate morning and afternoon collection routes across all major Nairobi neighborhoods and commercial centers.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#cbd5e1] bg-[#f8fafc] px-3.5 py-1 text-xs font-bold text-[#475569]"
                  >
                    <MapPin className="size-3 text-[#1363DF]" />
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <ServiceAreaChecker />
            </div>
          </div>
        </div>
      </section>

      {/* THE OPERATIONS & TICKET MANAGEMENT MODULE */}
      <section id="operations-module" className="relative isolate overflow-hidden bg-[#092341] py-16 lg:py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#ffe823]">
                <ShieldCheck className="size-4" />
                <span>Real-Time Ticket Management System</span>
              </div>
              <h2 className="mt-4 text-3xl font-black sm:text-4xl">
                End-to-End Order Tracking & Transparency
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/80">
                Every Fresh Flow booking generates a digital Ticket ID. Receive automated status alerts from collection to washing, drying, quality inspection, and doorstep delivery.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "1. Ticket Issued",
                    desc: "Instant booking confirmation & email ticket receipt.",
                  },
                  {
                    title: "2. Driver Collects",
                    desc: "Item tags assigned & weighed at your doorstep.",
                  },
                  {
                    title: "3. Master Wash & Press",
                    desc: "Garments processed with real-time status log.",
                  },
                  {
                    title: "4. Doorstep Delivery",
                    desc: "Delivered fresh with final ticket receipt & M-Pesa sync.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-xs"
                  >
                    <p className="font-bold text-[#ffe823]">{item.title}</p>
                    <p className="mt-1 text-xs text-white/70">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <QuickTrackWidget />
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER SOCIAL PROOF & TESTIMONIAL SLIDER */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TestimonialSlider />
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FaqSection />
        </div>
      </section>
    </main>
  );
}
