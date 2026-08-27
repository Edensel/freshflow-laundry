import type { Metadata } from "next";
import Image from "next/image";
import {
  Clock,
  HeartHandshake,
  Leaf,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { businessConfig } from "@/lib/business";

export const metadata: Metadata = {
  title: "About Us & Our Fabric Care Promise | Fresh Flow Nairobi",
  description:
    "Learn about Fresh Flow Laundry Services. Nairobi's dedicated doorstep laundry and dry cleaning service providing 24h pickup & delivery.",
};

export default function AboutPage() {
  return (
    <main className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1363DF]">
              Our Story & Promise
            </span>
            <h1 className="mt-2 text-4xl font-extrabold text-[#092341] sm:text-5xl">
              Nairobi&apos;s Dedicated Doorstep Laundry & House Care Service
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#64748b]">
              At Fresh Flow, we believe clean, fresh clothes and a sanitized home give you peace of mind every day. Founded in Nairobi, we set out to make laundry and cleaning simple by combining modern washing equipment, eco-friendly gentle detergents, doorstep pickup, and complete ticket tracking transparency.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                <Leaf className="size-6 text-[#16a34a]" />
                <h3 className="mt-3 font-bold text-[#092341]">100% Eco-Friendly</h3>
                <p className="mt-1 text-xs text-[#64748b]">
                  We use biodegradable, hypo-allergenic soaps gentle on clothes and skin.
                </p>
              </div>

              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                <HeartHandshake className="size-6 text-[#1363DF]" />
                <h3 className="mt-3 font-bold text-[#092341]">Garment Care Guarantee</h3>
                <p className="mt-1 text-xs text-[#64748b]">
                  Every piece is hand-inspected before wash and before final press.
                </p>
              </div>
            </div>
          </div>

          <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-[#e2e8f0] shadow-xl lg:col-span-5">
            <Image
              src="/images/original-site/laundry-machine.jpg"
              alt="Fresh Flow washing machinery"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Business details section */}
        <section className="mt-16 rounded-3xl border border-[#e2e8f0] bg-[#f8fafc] p-8 lg:p-12">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-6 text-[#1363DF]" />
            <h2 className="text-2xl font-bold text-[#092341]">
              Verified Business Information
            </h2>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 border border-[#e2e8f0]">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#F0F7FF] text-[#1363DF]">
                <MapPin className="size-5" />
              </div>
              <p className="mt-3 text-xs font-bold uppercase text-[#94a3b8]">Central Facility</p>
              <p className="mt-1 text-sm font-semibold text-[#092341]">{businessConfig.address}</p>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-[#e2e8f0]">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#F0F7FF] text-[#1363DF]">
                <Phone className="size-5" />
              </div>
              <p className="mt-3 text-xs font-bold uppercase text-[#94a3b8]">Support Line</p>
              <p className="mt-1 text-sm font-semibold text-[#092341]">{businessConfig.phone}</p>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-[#e2e8f0]">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#F0F7FF] text-[#1363DF]">
                <Mail className="size-5" />
              </div>
              <p className="mt-3 text-xs font-bold uppercase text-[#94a3b8]">Email Support</p>
              <p className="mt-1 text-sm font-semibold text-[#092341]">{businessConfig.email}</p>
            </div>

            <div className="rounded-2xl bg-white p-5 border border-[#e2e8f0]">
              <div className="flex size-9 items-center justify-center rounded-lg bg-[#F0F7FF] text-[#1363DF]">
                <Clock className="size-5" />
              </div>
              <p className="mt-3 text-xs font-bold uppercase text-[#94a3b8]">Operating Hours</p>
              <p className="mt-1 text-sm font-semibold text-[#092341]">{businessConfig.serviceWindowLabel}</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
