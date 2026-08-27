import Image from "next/image";
import Link from "next/link";
import { Clock, Lock, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { businessConfig, navigation, serviceAreas } from "@/lib/business";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#092341] pb-24 text-white sm:pb-0">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Col 1: Brand info */}
        <div>
          <Image
            src="/images/original-site/logo-1.png"
            alt={`${businessConfig.name} logo`}
            width={204}
            height={56}
            className="h-12 w-auto brightness-110"
          />
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            Nairobi&apos;s doorstep laundry, cleaning, and pest control service. Professional wash & fold, eco-friendly dry cleaning, and home care.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#ffe823]">
            <ShieldCheck className="size-4" />
            <span>Garment Protection & Satisfaction Guarantee</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#ffe823]">
            Quick Navigation
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/75">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  prefetch={true}
                  className="transition hover:text-[#ffe823]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="transition hover:text-[#ffe823]">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="transition hover:text-[#ffe823]">
                Terms of Service
              </Link>
            </li>
            <li className="pt-2 border-t border-white/10">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#38BDF8] transition hover:text-[#ffe823]"
              >
                <Lock className="size-3.5" />
                <span>Staff & Owner Portal</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Service Areas */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#ffe823]">
            Nairobi Service Areas
          </h4>
          <p className="mt-1 text-xs text-white/60">Daily Doorstep Pickups in:</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {serviceAreas.slice(0, 12).map((area) => (
              <span
                key={area}
                className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-white/80"
              >
                {area}
              </span>
            ))}
          </div>
        </div>

        {/* Col 4: Contact & M-Pesa */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#ffe823]">
            Customer Support
          </h4>
          <div className="mt-4 space-y-3 text-sm text-white/80">
            <div className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-[#38BDF8]" />
              <span>{businessConfig.phone}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-[#38BDF8]" />
              <span>{businessConfig.email}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#38BDF8]" />
              <span>{businessConfig.address}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-[#38BDF8]" />
              <span>{businessConfig.serviceWindowLabel}</span>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-xs font-semibold text-[#ffe823]">
              Official M-Pesa Payment
            </p>
            <p className="mt-1 text-xs text-white/70">
              Till Number: <strong className="text-white">{businessConfig.mpesa.tillNumber}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/50">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} {businessConfig.name}. All rights reserved. Built with precision for Nairobi.</span>
          <Link href="/admin" className="text-white/40 hover:text-white/80 flex items-center gap-1">
            <Lock className="size-3" /> Owner Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
