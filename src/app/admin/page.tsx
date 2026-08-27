import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Lock,
  LogOut,
  Mail,
  MessageSquareCheck,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { AdminTicketQueue } from "@/components/AdminTicketQueue";
import { FinancialAnalytics } from "@/components/FinancialAnalytics";
import { WalkInOrderModal } from "@/components/WalkInOrderModal";
import {
  adminPasswordHint,
  isAdminAuthenticated,
  isAdminConfigured,
} from "@/lib/admin-auth";
import { businessConfig } from "@/lib/business";
import { listAllFeedback } from "@/lib/feedback";
import { getPublicMetrics, listRecentOrders } from "@/lib/orders";
import {
  approveFeedbackAction,
  deleteFeedbackAction,
  loginAction,
  logoutAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Senior Executive Operations Portal | Fresh Flow Nairobi",
  description: "Senior 20+ year architectural back-office portal for order tickets, financial analytics, POS walk-ins, and review moderation.",
};

type AdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const REVIEWS_PER_PAGE = 5;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });
}

function LoginPanel({ error }: { error?: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#092341] px-4 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="text-center">
          <Image
            src="/images/original-site/logo-1.png"
            alt={`${businessConfig.name} logo`}
            width={204}
            height={56}
            className="mx-auto h-12 w-auto brightness-110"
          />
          <h1 className="mt-4 text-2xl font-black text-white">
            Senior Staff Operations Console
          </h1>
          <p className="mt-1 text-xs text-white/70">
            Sign in with authorized staff credentials to access operations & financial analysis.
          </p>
        </div>

        <form
          action={loginAction}
          className="mt-8 rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md sm:p-8"
        >
          {error ? (
            <div className="mb-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-3 text-xs font-bold text-[#991b1b]">
              Email or password was not accepted. Please check your credentials.
            </div>
          ) : null}

          {adminPasswordHint() ? (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#ffe823]/30 bg-[#ffe823]/10 p-3 text-xs text-[#ffe823]">
              <Sparkles className="size-4 shrink-0" />
              <span>Demo credentials: <strong>ops@freshflowslaundry.com</strong> / <strong>{adminPasswordHint()}</strong></span>
            </div>
          ) : null}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Staff Email Address
              </label>
              <div className="relative mt-1.5">
                <input
                  name="email"
                  type="email"
                  required
                  defaultValue="ops@freshflowslaundry.com"
                  placeholder="name@freshflowslaundry.com"
                  className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#ffe823] focus:bg-white/20"
                />
                <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/50" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80">
                Security Password
              </label>
              <div className="relative mt-1.5">
                <input
                  name="password"
                  type="password"
                  required
                  placeholder="Enter security password..."
                  className="w-full rounded-xl border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/40 outline-none focus:border-[#ffe823] focus:bg-white/20"
                />
                <Lock className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/50" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ffe823] text-sm font-extrabold text-[#092341] shadow-xl transition hover:bg-[#fff17a]"
          >
            <ShieldCheck className="size-4" />
            <span>Sign In To Operations</span>
          </button>
        </form>
      </div>
    </main>
  );
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const activeTab = first(params.tab) || "tickets";
  const reviewPageParam = Math.max(1, Number(first(params.reviewPage) || "1"));

  if (!isAdminConfigured()) {
    return (
      <main className="bg-[#f8fafc] py-14">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-2xl border border-[#fef08a] bg-[#fefce8] p-6 text-sm text-[#854d0e]">
            Set `ADMIN_SHARED_SECRET` in `.env.local` to enable the staff portal.
          </div>
        </div>
      </main>
    );
  }

  if (!(await isAdminAuthenticated())) {
    return <LoginPanel error={first(params.error)} />;
  }

  if (first(params.logout) === "1") {
    redirect("/admin");
  }

  const [rawOrders, metrics, feedbackList] = await Promise.all([
    listRecentOrders(),
    getPublicMetrics(),
    listAllFeedback(),
  ]);

  const pendingFeedbackCount = feedbackList.filter((f) => !f.approved).length;

  // Reviews Pagination
  const totalReviewPages = Math.ceil(feedbackList.length / REVIEWS_PER_PAGE) || 1;
  const currentReviewPage = Math.min(reviewPageParam, totalReviewPages);
  const paginatedReviews = feedbackList.slice(
    (currentReviewPage - 1) * REVIEWS_PER_PAGE,
    currentReviewPage * REVIEWS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] py-8 lg:py-10 text-[#092341]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Senior Executive Command Center Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#cbd5e1] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
              <ShieldCheck className="size-4" />
              <span>Senior Operations Command Console</span>
            </div>
            <h1 className="mt-1 text-3xl font-black text-[#092341] sm:text-4xl">
              Platform Operational Control
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <WalkInOrderModal />
            <form action={logoutAction}>
              <button className="inline-flex items-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2 text-xs font-bold text-[#475569] transition hover:bg-[#f8fafc] hover:border-[#092341]">
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>

        {/* Tab Navigation System */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#cbd5e1] bg-white p-2 shadow-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <a
              href="/admin?tab=tickets"
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition ${
                activeTab === "tickets"
                  ? "bg-[#092341] text-white shadow-md"
                  : "text-[#475569] hover:bg-[#f8fafc] hover:text-[#092341]"
              }`}
            >
              <Package className="size-4" />
              <span>Ticket Operations ({rawOrders.length})</span>
            </a>

            <a
              href="/admin?tab=financials"
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition ${
                activeTab === "financials"
                  ? "bg-[#092341] text-white shadow-md"
                  : "text-[#475569] hover:bg-[#f8fafc] hover:text-[#092341]"
              }`}
            >
              <TrendingUp className="size-4" />
              <span>Financial Intelligence</span>
            </a>

            <a
              href="/admin?tab=reviews"
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold transition ${
                activeTab === "reviews"
                  ? "bg-[#092341] text-white shadow-md"
                  : "text-[#475569] hover:bg-[#f8fafc] hover:text-[#092341]"
              }`}
            >
              <MessageSquareCheck className="size-4" />
              <span>Review Moderation ({feedbackList.length})</span>
              {pendingFeedbackCount > 0 && (
                <span className="rounded-full bg-[#ffe823] px-2 py-0.5 text-[10px] font-black text-[#092341]">
                  {pendingFeedbackCount}
                </span>
              )}
            </a>
          </div>

          <div className="text-xs text-[#64748b] font-medium px-2 hidden sm:block">
            Logged in: <strong>ops@freshflowslaundry.com</strong>
          </div>
        </div>

        {/* TAB 1: INSTANT REAL-TIME SEARCH TICKET OPERATIONS QUEUE */}
        {activeTab === "tickets" && (
          <section className="mt-6">
            <AdminTicketQueue orders={rawOrders} />
          </section>
        )}

        {/* TAB 2: FINANCIAL INTELLIGENCE */}
        {activeTab === "financials" && (
          <section className="mt-6">
            <FinancialAnalytics orders={rawOrders} />
          </section>
        )}

        {/* TAB 3: CUSTOMER REVIEW MODERATION */}
        {activeTab === "reviews" && (
          <section className="mt-6 rounded-3xl border border-[#cbd5e1] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f1f5f9] pb-4">
              <div className="flex items-center gap-2">
                <MessageSquareCheck className="size-5 text-[#1363DF]" />
                <h2 className="text-xl font-extrabold text-[#092341]">
                  Customer Review Moderation ({feedbackList.length})
                </h2>
              </div>
              {pendingFeedbackCount > 0 ? (
                <span className="rounded-full bg-[#ffe823] px-3 py-1 text-xs font-extrabold text-[#092341]">
                  {pendingFeedbackCount} Pending Approval
                </span>
              ) : (
                <span className="rounded-full bg-[#f0fdf4] px-3 py-1 text-xs font-bold text-[#166534]">
                  All Reviews Moderated
                </span>
              )}
            </div>

            <div className="mt-4 space-y-4">
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
                <p className="py-4 text-center text-xs text-[#64748b]">
                  No customer reviews submitted yet.
                </p>
              )}

              {/* Minimal Scroll Review Pagination Controls */}
              {totalReviewPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#cbd5e1] bg-[#f8fafc] p-4 text-xs font-bold text-[#092341]">
                  <span>
                    Showing {((currentReviewPage - 1) * REVIEWS_PER_PAGE) + 1}–
                    {Math.min(currentReviewPage * REVIEWS_PER_PAGE, feedbackList.length)} of {feedbackList.length} reviews
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/admin?tab=reviews&reviewPage=${currentReviewPage - 1}`}
                      aria-disabled={currentReviewPage === 1}
                      className={`inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-1.5 transition ${
                        currentReviewPage === 1 ? "opacity-30 pointer-events-none" : "hover:border-[#1363DF]"
                      }`}
                    >
                      <ChevronLeft className="size-4" />
                      <span>Previous</span>
                    </a>

                    <span className="px-2">Page {currentReviewPage} of {totalReviewPages}</span>

                    <a
                      href={`/admin?tab=reviews&reviewPage=${currentReviewPage + 1}`}
                      aria-disabled={currentReviewPage === totalReviewPages}
                      className={`inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-white px-3.5 py-1.5 transition ${
                        currentReviewPage === totalReviewPages ? "opacity-30 pointer-events-none" : "hover:border-[#1363DF]"
                      }`}
                    >
                      <span>Next</span>
                      <ChevronRight className="size-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
