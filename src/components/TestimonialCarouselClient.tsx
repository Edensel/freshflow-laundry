"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Quote, Star, UserCheck } from "lucide-react";
import { FeedbackModal } from "@/components/FeedbackModal";

export type TestimonialCardData = {
  name: string;
  role: string;
  rating: number;
  text: string;
  service: string;
};

const categoryTabs = [
  { id: "all", label: "🌟 All Reviews" },
  { id: "laundry", label: "🧺 Laundry Care" },
  { id: "house_cleaning", label: "🧹 House Cleaning" },
  { id: "bedding", label: "🛏️ Bedding & Duvets" },
  { id: "ironing", label: "♨️ Express Wash & Iron" },
  { id: "corporate", label: "🏢 Corporate Linen" },
  { id: "premium", label: "⭐ Premium Care" },
];

export function TestimonialCarouselClient({ reviews }: { reviews: TestimonialCardData[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter reviews by selected category tab
  const filteredReviews = reviews.filter((item) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "wash_fold") return item.service.toLowerCase().includes("wash & fold");
    if (activeCategory === "suit") return item.service.toLowerCase().includes("suit");
    if (activeCategory === "bedding") return item.service.toLowerCase().includes("bedding") || item.service.toLowerCase().includes("duvet");
    if (activeCategory === "ironing") return item.service.toLowerCase().includes("iron") || item.service.toLowerCase().includes("press");
    if (activeCategory === "corporate") return item.service.toLowerCase().includes("corporate") || item.service.toLowerCase().includes("linen");
    if (activeCategory === "laundry") return item.service.toLowerCase().includes("laundry") || item.service.toLowerCase().includes("wash");
    return true;
  });

  // Duplicate list if 2+ reviews exist for continuous marquee
  const displayList =
    filteredReviews.length > 1
      ? [...filteredReviews, ...filteredReviews]
      : filteredReviews;

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -380, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 380, behavior: "smooth" });
    }
  };

  return (
    <div className="py-4 text-[#092341]">
      {/* Section Header with Title, Rating, Controls & Leave Review Modal */}
      <div className="mx-auto mb-6 flex flex-wrap items-end justify-between gap-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1363DF]/10 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#1363DF]">
            <Quote className="size-4" />
            <span>Verified Customer Reviews</span>
          </div>
          <h2 className="mt-3 text-3xl font-black text-[#092341] sm:text-4xl">
            Loved By Nairobi Customers
          </h2>
          <div className="mt-2 flex items-center gap-2 text-sm font-extrabold text-[#1363DF]">
            <div className="flex text-[#f59e0b]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-4 fill-current" />
              ))}
            </div>
            <span>4.9 / 5.0 Star Garment Care Rating</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Left & Right Interactive Navigation Controls */}
          <div className="flex items-center gap-2 rounded-2xl border border-[#cbd5e1] bg-white p-1.5 shadow-xs">
            <button
              type="button"
              onClick={scrollLeft}
              className="flex size-10 items-center justify-center rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-[#092341] transition-all hover:bg-[#1363DF] hover:text-white hover:border-[#1363DF] active:scale-95 shadow-xs"
              aria-label="Scroll back to previous review"
              title="Scroll back to previous review"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={scrollRight}
              className="flex size-10 items-center justify-center rounded-xl border border-[#e2e8f0] bg-[#f8fafc] text-[#092341] transition-all hover:bg-[#1363DF] hover:text-white hover:border-[#1363DF] active:scale-95 shadow-xs"
              aria-label="Scroll forward to next review"
              title="Scroll forward to next review"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <FeedbackModal />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="mx-auto mb-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="flex items-center gap-1 text-xs font-bold text-[#64748b] shrink-0 mr-1">
            <Filter className="size-3.5 text-[#1363DF]" /> Filter:
          </span>
          {categoryTabs.map((tab) => {
            const active = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveCategory(tab.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                  active
                    ? "bg-[#1363DF] text-white shadow-md shadow-[#1363DF]/30"
                    : "border border-[#cbd5e1] bg-white text-[#475569] hover:border-[#1363DF] hover:text-[#1363DF]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Right-to-Left Marquee Track with Manual Scroll Container */}
      <div className="relative w-full overflow-hidden">
        {/* Soft edge gradient fades */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[#f8fafc] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#f8fafc] to-transparent" />

        <div
          ref={containerRef}
          className="no-scrollbar flex overflow-x-auto scroll-smooth py-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayList.length > 0 ? (
            <div className={`flex gap-6 ${activeCategory === "all" ? "animate-marquee" : ""}`}>
              {displayList.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="w-[320px] shrink-0 rounded-3xl border border-[#cbd5e1] bg-white p-6 shadow-md transition-all hover:border-[#1363DF] hover:shadow-xl sm:w-[380px]"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-[#f1f5f9] pb-3">
                    <div className="flex items-center gap-1 text-[#f59e0b]">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-current" />
                      ))}
                    </div>
                    <span className="rounded-lg bg-[#F0F7FF] px-2.5 py-1 text-[11px] font-extrabold text-[#1363DF]">
                      {item.service}
                    </span>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm font-medium leading-relaxed text-[#334155] italic">
                    &quot;{item.text}&quot;
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-[#f1f5f9] pt-4">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-[#092341] text-sm">
                          {item.name}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#f0fdf4] px-2 py-0.5 text-[10px] font-bold text-[#166534]">
                          <UserCheck className="size-3" />
                          Verified
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-[#64748b]">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mx-auto my-4 text-center text-xs text-[#64748b]">
              No reviews found for this service category yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
