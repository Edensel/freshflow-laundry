import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Lock,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  MessageSquareCheck,
  Package,
  Phone,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Truck,
  User,
  Store,
  TrendingUp,
} from "lucide-react";
import { FinancialAnalytics } from "@/components/FinancialAnalytics";
import { StatusBadge } from "@/components/StatusBadge";
import { WalkInOrderModal } from "@/components/WalkInOrderModal";
import {
  adminPasswordHint,
  isAdminAuthenticated,
  isAdminConfigured,
} from "@/lib/admin-auth";
import {
  businessConfig,
  formatKes,
  statusLabels,
  statusSteps,
} from "@/lib/business";
import { listAllFeedback } from "@/lib/feedback";
import {
  getPublicMetrics,
  listRecentOrders,
  type OrderStatus,
} from "@/lib/orders";
import {
  approveFeedbackAction,
  deleteFeedbackAction,
  loginAction,
  logoutAction,
  updateStatusAction,
} from "./actions";

export const metadata: Metadata = {
  title: "Senior Executive Operations Portal | Fresh Flow Nairobi",
  description: "Senior 20+ year architectural back-office portal for order tickets, financial analytics, POS walk-ins, and review moderation.",
};

type AdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const TICKETS_PER_PAGE = 5;
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
  const statusParam = first(params.status);
  const activeTab = first(params.tab) || "tickets";
  const searchQuery = first(params.search) || "";
  const pageParam = Math.max(1, Number(first(params.page) || "1"));
  const reviewPageParam = Math.max(1, Number(first(params.reviewPage) || "1"));
  const status = statusSteps.includes(statusParam as OrderStatus)
    ? (statusParam as OrderStatus)
    : undefined;

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
    listRecentOrders(status),
    getPublicMetrics(),
    listAllFeedback(),
  ]);

  const pendingFeedbackCount = feedbackList.filter((f) => !f.approved).length;

  const filteredOrders = searchQuery.trim()
    ? rawOrders.filter((o) => {
        const queryLower = searchQuery.toLowerCase();
        return (
          o.ticketId.toLowerCase().includes(queryLower) ||
          o.customerName.toLowerCase().includes(queryLower) ||
          o.customerPhone.includes(queryLower) ||
          o.customerEmail.toLowerCase().includes(queryLower) ||
          o.serviceArea.toLowerCase().includes(queryLower)
        );
      })
    : rawOrders;

  // Ticket Queue Pagination
  const totalTicketPages = Math.ceil(filteredOrders.length / TICKETS_PER_PAGE) || 1;
  const currentTicketPage = Math.min(pageParam, totalTicketPages);
  const paginatedOrders = filteredOrders.slice(
    (currentTicketPage - 1) * TICKETS_PER_PAGE,
    currentTicketPage * TICKETS_PER_PAGE
  );

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

        {/* TAB 1: TICKET OPERATIONS QUEUE */}
        {activeTab === "tickets" && (
          <section className="mt-6">
            {/* Filter & Search Bar */}
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
              <form className="flex flex-wrap items-center gap-3">
                <input type="hidden" name="tab" value="tickets" />
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
                  <input
                    name="search"
                    defaultValue={searchQuery}
                    placeholder="Search Ticket ID, Customer Name, Phone, or Area..."
                    className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] py-2.5 pl-10 pr-4 text-xs font-medium text-[#092341] outline-none focus:border-[#1363DF] focus:bg-white"
                  />
                </div>

                <select
                  name="status"
                  defaultValue={status || ""}
                  className="rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3.5 py-2.5 text-xs font-bold text-[#092341] outline-none focus:border-[#1363DF]"
                >
                  <option value="">All Statuses</option>
                  {statusSteps.map((item) => (
                    <option key={item} value={item}>
                      {statusLabels[item]}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#092341] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#1363DF]"
                >
                  <Filter className="size-3.5" />
                  <span>Apply Filter</span>
                </button>
              </form>
            </div>

            {/* Paginated Orders List */}
            <div className="mt-5 space-y-4">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <article
                    key={order.id}
                    className="rounded-3xl border border-[#e2e8f0] bg-white p-5 shadow-xs transition hover:border-[#cbd5e1]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#f1f5f9] pb-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-black text-[#092341]">
                            {order.ticketId}
                          </h2>
                          <StatusBadge status={order.status} />
                          <span className="text-xs font-medium text-[#94a3b8]">
                            Created: {formatDate(order.createdAt)}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-[#475569]">
                          <span className="flex items-center gap-1.5 font-bold text-[#092341]">
                            <User className="size-3.5 text-[#1363DF]" />
                            {order.customerName}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone className="size-3.5 text-[#1363DF]" />
                            {order.customerPhone}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Mail className="size-3.5 text-[#1363DF]" />
                            {order.customerEmail}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase text-[#94a3b8]">
                          Total Amount
                        </span>
                        <p className="text-xl font-black text-[#1363DF]">
                          {formatKes(order.priceTotalKe)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-12">
                      {/* Client & Address Info */}
                      <div className="space-y-2 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-3.5 text-xs lg:col-span-6">
                        <div>
                          <span className="font-bold text-[#94a3b8] uppercase text-[10px]">
                            Service Location / Channel
                          </span>
                          <p className="mt-0.5 font-bold text-[#092341]">
                            📍 {order.serviceArea} — {order.address}
                          </p>
                        </div>

                        <div className="grid gap-2 sm:grid-cols-2 pt-2 border-t border-[#e2e8f0]">
                          <div>
                            <span className="text-[#94a3b8] text-[10px] font-bold uppercase">Service / Pickup Date</span>
                            <p className="font-medium text-[#092341]">{formatDate(order.pickupDatetime)}</p>
                          </div>
                          <div>
                            <span className="text-[#94a3b8] text-[10px] font-bold uppercase">Delivery / Completion</span>
                            <p className="font-medium text-[#092341]">{formatDate(order.deliveryDatetime)}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#e2e8f0]">
                          <span className="text-[#94a3b8] text-[10px] font-bold uppercase">Itemized Booked Services</span>
                          <ul className="mt-1 space-y-1 font-semibold text-[#092341]">
                            {order.serviceDetails.lines.map((line) => (
                              <li key={line.id}>
                                • {line.name} × {line.quantity} {line.unit} ({formatKes(line.lineTotalKe)})
                              </li>
                            ))}
                          </ul>
                        </div>

                        {order.specialInstructions ? (
                          <div className="pt-2 border-t border-[#e2e8f0]">
                            <span className="text-[#94a3b8] text-[10px] font-bold uppercase">Special Instructions</span>
                            <p className="mt-0.5 text-[#334155] italic">{order.specialInstructions}</p>
                          </div>
                        ) : null}
                      </div>

                      {/* Owner Status Response Form */}
                      <form
                        action={updateStatusAction}
                        className="space-y-3 rounded-2xl border border-[#bfdbfe] bg-[#F0F7FF] p-3.5 lg:col-span-6"
                      >
                        <input type="hidden" name="orderId" value={order.id} />
                        <div>
                          <label className="block text-xs font-bold uppercase text-[#092341]">
                            Update Order Status
                          </label>
                          <select
                            name="status"
                            defaultValue={order.status}
                            className="mt-1 min-h-10 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-xs font-bold text-[#092341] outline-none focus:border-[#1363DF]"
                          >
                            {statusSteps.map((item) => (
                              <option key={item} value={item}>
                                {statusLabels[item]}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase text-[#092341]">
                            Customer Progress Note
                          </label>
                          <textarea
                            name="notes"
                            rows={2}
                            placeholder="e.g. Cleaning completed. Team finalized inspection..."
                            className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white p-2.5 text-xs text-[#092341] outline-none focus:border-[#1363DF]"
                          />
                        </div>

                        <button
                          type="submit"
                          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#1363DF] px-4 text-xs font-extrabold text-white shadow-xs transition hover:bg-[#0F4C81]"
                        >
                          <Send className="size-4" />
                          <span>Update Status & Send Receipt Email</span>
                        </button>
                      </form>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-3xl border border-[#e2e8f0] bg-white p-10 text-center text-[#64748b]">
                  <Package className="mx-auto size-10 text-[#cbd5e1]" />
                  <p className="mt-3 text-base font-bold text-[#092341]">No orders matched those filters.</p>
                </div>
              )}

              {/* Minimal Scroll Ticket Pagination Controls */}
              {totalTicketPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#cbd5e1] bg-white p-4 shadow-xs text-xs font-bold text-[#092341]">
                  <span>
                    Showing {((currentTicketPage - 1) * TICKETS_PER_PAGE) + 1}–
                    {Math.min(currentTicketPage * TICKETS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} tickets
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/admin?tab=tickets&page=${currentTicketPage - 1}${searchQuery ? `&search=${searchQuery}` : ""}${status ? `&status=${status}` : ""}`}
                      aria-disabled={currentTicketPage === 1}
                      className={`inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3.5 py-1.5 transition ${
                        currentTicketPage === 1 ? "opacity-30 pointer-events-none" : "hover:bg-white hover:border-[#1363DF]"
                      }`}
                    >
                      <ChevronLeft className="size-4" />
                      <span>Previous</span>
                    </a>

                    <span className="px-2">Page {currentTicketPage} of {totalTicketPages}</span>

                    <a
                      href={`/admin?tab=tickets&page=${currentTicketPage + 1}${searchQuery ? `&search=${searchQuery}` : ""}${status ? `&status=${status}` : ""}`}
                      aria-disabled={currentTicketPage === totalTicketPages}
                      className={`inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3.5 py-1.5 transition ${
                        currentTicketPage === totalTicketPages ? "opacity-30 pointer-events-none" : "hover:bg-white hover:border-[#1363DF]"
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
