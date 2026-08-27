import Image from "next/image";
import Link from "next/link";
import {
  CalendarCheck2,
  Clock,
  HelpCircle,
  PhoneCall,
  Search,
  Sparkles,
} from "lucide-react";
import { businessConfig, navigation } from "@/lib/business";

export function SiteHeader() {
  return (
    <>
      {/* Top Banner Bar */}
      <div className="bg-[#092341] px-4 py-2 text-xs text-white/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-[#ffe823]">
              <Sparkles className="size-3.5" />
              Nairobi&apos;s Premium Laundry & Dry Cleaning
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden items-center gap-1.5 sm:flex text-white/80">
              <Clock className="size-3.5 text-[#38BDF8]" />
              {businessConfig.serviceWindowLabel}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${businessConfig.phone.replace(/[\s]/g, "")}`}
              className="flex items-center gap-1 font-semibold text-white transition hover:text-[#ffe823]"
            >
              <PhoneCall className="size-3.5 text-[#ffe823]" />
              <span>{businessConfig.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#e2e8f0]/80 bg-white/90 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group inline-flex shrink-0 items-center rounded-xl bg-[#092341] px-3 py-2 shadow-md shadow-[#092341]/15 ring-1 ring-[#0f3664]/10 transition hover:bg-[#0f3664]"
          >
            <Image
              src="/images/original-site/logo-1.png"
              alt={`${businessConfig.name} logo`}
              width={204}
              height={56}
              priority
              className="h-10 w-auto brightness-110 transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Primary navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3.5 py-2 text-sm font-semibold text-[#475569] transition hover:bg-[#F0F7FF] hover:text-[#1363DF]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/track"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-4 text-sm font-semibold text-[#092341] transition hover:border-[#1363DF] hover:bg-[#F0F7FF] hover:text-[#1363DF]"
            >
              <Search className="size-4 text-[#1363DF]" aria-hidden="true" />
              <span>Track Order</span>
            </Link>
            <Link
              href="/book"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#1363DF] px-5 text-sm font-bold text-white shadow-md shadow-[#1363DF]/20 transition hover:bg-[#0F4C81] hover:scale-[1.02]"
            >
              <CalendarCheck2 className="size-4" aria-hidden="true" />
              <span>Book Pickup</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Quick Navigation */}
      <nav
        className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-[#cbd5e1] bg-white/95 px-3 py-2 shadow-2xl backdrop-blur-md sm:hidden"
        aria-label="Mobile quick actions"
      >
        <Link
          href="/book"
          className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-xs font-bold text-[#1363DF]"
        >
          <CalendarCheck2 className="size-5" aria-hidden="true" />
          Book
        </Link>
        <Link
          href="/track"
          className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-xs font-bold text-[#475569]"
        >
          <Search className="size-5" aria-hidden="true" />
          Track Ticket
        </Link>
        <Link
          href="/contact"
          className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-xs font-bold text-[#475569]"
        >
          <HelpCircle className="size-5" aria-hidden="true" />
          Contact
        </Link>
      </nav>
    </>
  );
}
