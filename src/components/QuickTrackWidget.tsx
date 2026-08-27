"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShieldCheck, TicketCheck } from "lucide-react";

export function QuickTrackWidget() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/track?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md lg:p-8 text-white">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[#ffe823] text-[#092341]">
          <TicketCheck className="size-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">
            Quick Ticket Lookup
          </h3>
          <p className="text-xs text-white/70">
            Track live pickup, cleaning, and delivery status
          </p>
        </div>
      </div>

      <form onSubmit={handleTrack} className="mt-5 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Ticket ID (e.g. FF-2026-1001) or Phone"
            className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:border-[#ffe823] focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#ffe823]/30"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-xl bg-[#ffe823] px-5 py-3 text-sm font-bold text-[#092341] transition hover:bg-[#fff17a]"
        >
          <span>Track Order</span>
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/75">
        <span className="flex items-center gap-1">
          <ShieldCheck className="size-4 text-[#ffe823]" /> Instant status updates
        </span>
        <span>•</span>
        <span>Email & SMS receipt sync</span>
      </div>
    </div>
  );
}
