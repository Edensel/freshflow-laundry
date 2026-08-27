"use client";

import { useState } from "react";
import { CheckCircle2, MapPin, Search, XCircle } from "lucide-react";
import { isSupportedServiceArea, serviceAreas } from "@/lib/business";

export function ServiceAreaChecker() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const matched = query.trim().length > 0 && isSupportedServiceArea(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearched(true);
    }
  };

  const handleTagClick = (area: string) => {
    setQuery(area);
    setSearched(true);
  };

  return (
    <div className="rounded-2xl border border-[#d7ddeb] bg-white p-6 shadow-sm lg:p-8">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#1363DF]/10 text-[#1363DF]">
          <MapPin className="size-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#092341]">
            Check Service Availability
          </h3>
          <p className="text-xs text-[#64748b]">
            Doorstep pickup across 18+ Nairobi neighborhoods
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mt-5 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearched(false);
            }}
            placeholder="Type your area (e.g. Westlands, Kilimani, Karen...)"
            className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] py-3 pl-10 pr-4 text-sm text-[#092341] placeholder:text-[#94a3b8] focus:border-[#1363DF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1363DF]/20"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-[#092341] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1363DF]"
        >
          Check Area
        </button>
      </form>

      {searched && query.trim() && (
        <div
          className={`mt-4 flex items-start gap-3 rounded-xl p-4 text-sm font-medium ${
            matched
              ? "border border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
              : "border border-[#fde8e8] bg-[#fef2f2] text-[#991b1b]"
          }`}
        >
          {matched ? (
            <>
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#16a34a]" />
              <div>
                <p className="font-bold">Doorstep Pickup Available in &quot;{query}&quot;!</p>
                <p className="mt-0.5 text-xs text-[#15803d]">
                  Our Nairobi route drivers operate daily in this zone with morning and afternoon slots.
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="mt-0.5 size-5 shrink-0 text-[#dc2626]" />
              <div>
                <p className="font-bold">Area Not Automatically Recognized</p>
                <p className="mt-0.5 text-xs text-[#b91c1c]">
                  We serve greater Nairobi! Book your order and our dispatch team will confirm your location window immediately.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b]">
          Popular Daily Routes:
        </p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {serviceAreas.slice(0, 10).map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => handleTagClick(area)}
              className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${
                query.toLowerCase() === area.toLowerCase()
                  ? "border-[#1363DF] bg-[#1363DF] text-white"
                  : "border-[#e2e8f0] bg-[#f8fafc] text-[#475569] hover:border-[#1363DF] hover:text-[#1363DF]"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
