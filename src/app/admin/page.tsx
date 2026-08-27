import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import {
  Building2,
  CheckCircle2,
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
  title: "Owner & Staff Operations Portal | Fresh Flow Nairobi",
  description: "Professional admin portal for order queue, client communications, financial analytics, walk-in POS, and review moderation.",
};

type AdminPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

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
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-[#092341] px-4 py-12 text-white">
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
            Staff & Owner Portal
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
  const searchQuery = first(params.search) || "";
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

  const orders = searchQuery.trim()
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

  return (
    <main className="bg-[#f8fafc] py-10 lg:py-14 text-[#092341]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Bar with Walk-In POS & Sign Out */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e2e8f0] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
              <ShieldCheck className="size-4" />
              <span>Owner & Operations Control Center</span>
            </div>
            <h1 className="mt-1 text-3xl font-black text-[#092341] sm:text-4xl">
              Platform Manager & Financial Analytics
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <WalkInOrderModal />
            <form action={logoutAction}>
              <button className="inline-flex items-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-4 py-2.5 text-xs font-bold text-[#475569] transition hover:bg-[#f8fafc] hover:border-[#092341]">
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>

        {/* FINANCIAL ANALYTICS & REVENUE REPORTING MODULE */}
        <section className="mt-8">
          <FinancialAnalytics orders={rawOrders} />
        </section>

        {/* CUSTOMER REVIEW MODERATION SECTION */}
        <section className="mt-10 rounded-3xl border border-[#cbd5e1] bg-white p-6 shadow-sm">
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
            {feedbackList.length > 0 ? (
              feedbackList.map((f) => (
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
          </div>
        </section>

        {/* Filter & Search Bar */}
        <div className="mt-10 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
          <form className="flex flex-wrap items-center gap-3">
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

        {/* Orders Queue List */}
        <div className="mt-6 space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <article
                key={order.id}
                className="rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-sm transition hover:border-[#cbd5e1]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#f1f5f9] pb-4">
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

                    <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#475569]">
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
                      Total Price
                    </span>
                    <p className="text-xl font-black text-[#1363DF]">
                      {formatKes(order.priceTotalKe)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid gap-6 lg:grid-cols-12">
                  {/* Client & Address Info */}
                  <div className="space-y-3 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-xs lg:col-span-6">
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
                    className="space-y-3 rounded-2xl border border-[#bfdbfe] bg-[#F0F7FF] p-4 lg:col-span-6"
                  >
                    <input type="hidden" name="orderId" value={order.id} />
                    <div>
                      <label className="block text-xs font-bold uppercase text-[#092341]">
                        Update Order Status
                      </label>
                      <select
                        name="status"
                        defaultValue={order.status}
                        className="mt-1.5 min-h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-xs font-bold text-[#092341] outline-none focus:border-[#1363DF]"
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
                        Customer Update / Progress Note
                      </label>
                      <textarea
                        name="notes"
                        rows={3}
                        placeholder="e.g. House cleaning completed. Team finalized inspection..."
                        className="mt-1.5 w-full rounded-xl border border-[#cbd5e1] bg-white p-3 text-xs text-[#092341] outline-none focus:border-[#1363DF]"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1363DF] px-4 text-xs font-extrabold text-white shadow-md transition hover:bg-[#0F4C81]"
                    >
                      <Send className="size-4" />
                      <span>Update Status & Send Receipt Email</span>
                    </button>
                  </form>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-[#e2e8f0] bg-white p-12 text-center text-[#64748b]">
              <Package className="mx-auto size-10 text-[#cbd5e1]" />
              <p className="mt-3 text-base font-bold text-[#092341]">No orders matched those filters.</p>
              <p className="mt-1 text-xs">Try clearing your search query or status filter.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
