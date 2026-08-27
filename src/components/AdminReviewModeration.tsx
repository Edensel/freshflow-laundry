"use client";

import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
  MessageSquareCheck,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import {
  approveFeedbackAction,
  deleteFeedbackAction,
} from "@/app/admin/actions";
import type { FeedbackItem } from "@/lib/feedback";

type AdminReviewModerationProps = {
  feedbackList: FeedbackItem[];
};

const REVIEWS_PER_PAGE = 5;

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });
}

export function AdminReviewModeration({
  feedbackList,
}: AdminReviewModerationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  const pendingCount = useMemo(
    () => feedbackList.filter((f) => !f.approved).length,
    [feedbackList]
  );

  const filteredReviews = useMemo(() => {
    return feedbackList.filter((item) => {
      // Approval Filter
      if (approvalFilter === "pending" && item.approved) return false;
      if (approvalFilter === "approved" && !item.approved) return false;

      // Text Search
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        item.customerName.toLowerCase().includes(q) ||
        item.locationArea.toLowerCase().includes(q) ||
        item.serviceType.toLowerCase().includes(q) ||
        item.reviewText.toLowerCase().includes(q)
      );
    });
  }, [feedbackList, searchQuery, approvalFilter]);

  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const paginatedReviews = useMemo(() => {
    const start = (safePage - 1) * REVIEWS_PER_PAGE;
    return filteredReviews.slice(start, start + REVIEWS_PER_PAGE);
  }, [filteredReviews, safePage]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setApprovalFilter(value);
    setCurrentPage(1);
  };

  return (
    <section className="rounded-3xl border border-[#cbd5e1] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f5f9] pb-4">
        <div className="flex items-center gap-2">
          <MessageSquareCheck className="size-5 text-[#1363DF]" />
          <h2 className="text-xl font-extrabold text-[#092341]">
            Customer Review Moderation ({feedbackList.length})
          </h2>
        </div>
        {pendingCount > 0 ? (
          <span className="rounded-full bg-[#ffe823] px-3 py-1 text-xs font-extrabold text-[#092341]">
            {pendingCount} Pending Approval
          </span>
        ) : (
          <span className="rounded-full bg-[#f0fdf4] px-3 py-1 text-xs font-bold text-[#166534]">
            All Reviews Moderated
          </span>
        )}
      </div>

      {/* Real-Time Live Search & Filter Bar */}
      <div className="mt-4 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-3.5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Instant Search Reviews: Name, Location, Service, or Review Keyword..."
              className="w-full rounded-xl border border-[#cbd5e1] bg-white py-2 pl-10 pr-10 text-xs font-medium text-[#092341] outline-none transition focus:border-[#1363DF] focus:ring-2 focus:ring-[#1363DF]/20"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[#94a3b8] hover:bg-[#e2e8f0] hover:text-[#092341]"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={approvalFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className="rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-xs font-bold text-[#092341] outline-none focus:border-[#1363DF]"
            >
              <option value="all">All Reviews ({feedbackList.length})</option>
              <option value="pending">Pending Approval ({pendingCount})</option>
              <option value="approved">Approved & Published ({feedbackList.length - pendingCount})</option>
            </select>

            {searchQuery || approvalFilter !== "all" ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setApprovalFilter("all");
                  setCurrentPage(1);
                }}
                className="inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-xs font-bold text-[#475569] transition hover:bg-[#f1f5f9]"
              >
                <X className="size-3.5" />
                <span>Reset</span>
              </button>
            ) : null}
          </div>
        </div>

        {searchQuery || approvalFilter !== "all" ? (
          <p className="mt-2 text-[11px] font-bold text-[#1363DF]">
            ⚡ Instant Search Active: Found {filteredReviews.length} matching review{filteredReviews.length === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>

      {/* Reviews List */}
      <div className="mt-4 space-y-3.5">
        {paginatedReviews.length > 0 ? (
          paginatedReviews.map((f) => (
            <div
              key={f.id}
              className={`flex flex-wrap items-start justify-between gap-4 rounded-2xl border p-4 text-xs ${
                f.approved
                  ? "border-[#e2e8f0] bg-[#f8fafc]"
                  : "border-[#fef08a] bg-[#fefce8]"
              }`}
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-[#092341] text-sm">
                    {f.customerName}
                  </span>
                  <span className="text-[#64748b]">({f.locationArea})</span>
                  <div className="flex text-[#f59e0b]">
                    {Array.from({ length: f.rating }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="rounded-md bg-[#1363DF]/10 px-2 py-0.5 font-bold text-[#1363DF]">
                    {f.serviceType}
                  </span>
                  {f.approved ? (
                    <span className="rounded-full bg-[#f0fdf4] px-2 py-0.5 font-bold text-[#166534]">
                      ✓ Published on Homepage
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#ffe823] px-2 py-0.5 font-extrabold text-[#092341]">
                      ⏳ Pending Approval
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm italic text-[#334155]">
                  &quot;{f.reviewText}&quot;
                </p>
                <p className="text-[10px] text-[#94a3b8]">Submitted: {formatDate(f.createdAt)}</p>
              </div>

              <div className="flex items-center gap-2">
                {!f.approved && (
                  <form action={approveFeedbackAction}>
                    <input type="hidden" name="feedbackId" value={f.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#16a34a] px-3.5 py-2 font-bold text-white transition hover:bg-[#15803d]"
                    >
                      <CheckCircle2 className="size-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  </form>
                )}

                <form action={deleteFeedbackAction}>
                  <input type="hidden" name="feedbackId" value={f.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 font-bold text-[#991b1b] transition hover:bg-[#fef2f2] hover:border-[#fecaca]"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Delete</span>
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <p className="py-6 text-center text-xs text-[#64748b]">
            No reviews matched &quot;{searchQuery}&quot;.
          </p>
        )}

        {/* Minimal Scroll Review Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#cbd5e1] bg-[#f8fafc] p-4 text-xs font-bold text-[#092341]">
            <span>
              Showing {((safePage - 1) * REVIEWS_PER_PAGE) + 1}–
              {Math.min(safePage * REVIEWS_PER_PAGE, filteredReviews.length)} of {filteredReviews.length} reviews
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage === 1}
                className="inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-1.5 transition hover:border-[#1363DF] disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="size-4" />
                <span>Previous</span>
              </button>

              <span className="px-2">Page {safePage} of {totalPages}</span>

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safePage === totalPages}
                className="inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-1.5 transition hover:border-[#1363DF] disabled:opacity-30 disabled:pointer-events-none"
              >
                <span>Next</span>
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
