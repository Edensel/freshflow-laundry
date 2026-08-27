"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Filter,
  Globe,
  PieChart,
  Receipt,
  Store,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { updatePaymentStatusAction } from "@/app/admin/actions";
import { formatKes, paymentOptions } from "@/lib/business";
import type { Order } from "@/lib/orders";

type FinancialAnalyticsProps = {
  orders: Order[];
};

type Timeframe = "weekly" | "monthly" | "quarterly" | "yearly";
type LedgerFilter = "all" | "paid" | "unpaid";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });
}

export function FinancialAnalytics({ orders }: FinancialAnalyticsProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const [ledgerFilter, setLedgerFilter] = useState<LedgerFilter>("all");

  const now = new Date();

  // Filter orders by selected timeframe
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const created = new Date(o.createdAt);
      const diffDays = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);

      if (timeframe === "weekly") return diffDays <= 7;
      if (timeframe === "monthly") return diffDays <= 30;
      if (timeframe === "quarterly") return diffDays <= 90;
      if (timeframe === "yearly") return diffDays <= 365;
      return true;
    });
  }, [orders, timeframe]);

  // Strict Realized vs Unpaid Financial Calculations
  const metrics = useMemo(() => {
    let paidRevenue = 0;
    let paidCount = 0;
    let unpaidReceivables = 0;
    let unpaidCount = 0;

    let walkInPaid = 0;
    let walkInUnpaid = 0;
    let onlinePaid = 0;
    let onlineUnpaid = 0;

    for (const order of filteredOrders) {
      const amount = Number(order.priceTotalKe || 0);
      const isPaid = order.paymentStatus === "PAID";
      const isWalkIn =
        order.ticketId.toUpperCase().startsWith("WALK-") ||
        order.serviceArea.toLowerCase().includes("walk-in");

      if (isPaid) {
        paidRevenue += amount;
        paidCount += 1;
        if (isWalkIn) walkInPaid += amount;
        else onlinePaid += amount;
      } else {
        unpaidReceivables += amount;
        unpaidCount += 1;
        if (isWalkIn) walkInUnpaid += amount;
        else onlineUnpaid += amount;
      }
    }

    const grossPipeline = paidRevenue + unpaidReceivables;
    const realizationRate =
      grossPipeline > 0 ? Math.round((paidRevenue / grossPipeline) * 100) : 0;
    const avgPaidOrderValue = paidCount > 0 ? paidRevenue / paidCount : 0;

    return {
      paidRevenue,
      paidCount,
      unpaidReceivables,
      unpaidCount,
      grossPipeline,
      realizationRate,
      avgPaidOrderValue,
      walkInPaid,
      walkInUnpaid,
      onlinePaid,
      onlineUnpaid,
    };
  }, [filteredOrders]);

  // Filtered Ledger List for Table Display
  const ledgerOrders = useMemo(() => {
    if (ledgerFilter === "paid") {
      return filteredOrders.filter((o) => o.paymentStatus === "PAID");
    }
    if (ledgerFilter === "unpaid") {
      return filteredOrders.filter((o) => o.paymentStatus !== "PAID");
    }
    return filteredOrders;
  }, [filteredOrders, ledgerFilter]);

  return (
    <div className="space-y-8 text-[#092341]">
      {/* Executive Title Header & Real-Time Timeframe Filter */}
      <div className="rounded-3xl border border-[#cbd5e1] bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f1f5f9] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
              <TrendingUp className="size-4" />
              <span>Real-Time Cash Accounting & Intelligence Engine</span>
            </div>
            <h2 className="mt-1 text-2xl font-black text-[#092341]">
              Executive Financial Realization Dashboard
            </h2>
            <p className="mt-0.5 text-xs text-[#64748b]">
              Strict segregation of realized paid cash revenue vs pending accounts receivable.
            </p>
          </div>

          {/* Timeframe Filter Tabs */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-[#cbd5e1] bg-[#f8fafc] p-1.5">
            {(["weekly", "monthly", "quarterly", "yearly"] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition ${
                  timeframe === tf
                    ? "bg-[#092341] text-[#ffe823] shadow-sm"
                    : "text-[#64748b] hover:bg-white hover:text-[#092341]"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Realized vs Unpaid Financial KPI Grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 🟢 Realized Cash Revenue (PAID) */}
          <div className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#16a34a]">
                🟢 Confirmed Cash Realized
              </span>
              <CheckCircle2 className="size-5 text-[#16a34a]" />
            </div>
            <div className="mt-2 text-3xl font-black text-[#15803d]">
              {formatKes(metrics.paidRevenue)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-[#16a34a]">
              <span>{metrics.paidCount} Paid Tickets</span>
              <span className="font-bold">Realized Revenue</span>
            </div>
          </div>

          {/* ⏳ Pending Receivables (UNPAID) */}
          <div className="rounded-2xl border border-[#fde68a] bg-[#fffbeb] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#b45309]">
                ⏳ Unpaid Receivables
              </span>
              <Clock className="size-5 text-[#d97706]" />
            </div>
            <div className="mt-2 text-3xl font-black text-[#b45309]">
              {formatKes(metrics.unpaidReceivables)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-[#b45309]">
              <span>{metrics.unpaidCount} Pending Payments</span>
              <span className="font-bold">Outstanding</span>
            </div>
          </div>

          {/* 📊 Total Gross Pipeline Value */}
          <div className="rounded-2xl border border-[#bfdbfe] bg-[#f0f9ff] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#0369a1]">
                📊 Gross Pipeline Value
              </span>
              <Wallet className="size-5 text-[#0284c7]" />
            </div>
            <div className="mt-2 text-3xl font-black text-[#092341]">
              {formatKes(metrics.grossPipeline)}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-[#0369a1]">
              <span>{filteredOrders.length} Total Tickets</span>
              <span className="font-bold">Paid + Unpaid</span>
            </div>
          </div>

          {/* 📈 Collection Realization Rate */}
          <div className="rounded-2xl border border-[#cbd5e1] bg-[#f8fafc] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#64748b]">
                📈 Realization Rate
              </span>
              <Receipt className="size-5 text-[#64748b]" />
            </div>
            <div className="mt-2 text-3xl font-black text-[#092341]">
              {metrics.realizationRate}%
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#e2e8f0]">
              <div
                className="h-full bg-[#16a34a] transition-all duration-500"
                style={{ width: `${metrics.realizationRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* Channel Breakdown: Walk-In Counter vs Website Direct Realization */}
        <div className="mt-8 border-t border-[#f1f5f9] pt-6">
          <h3 className="text-sm font-extrabold text-[#092341] uppercase tracking-wider mb-4">
            Booking Channel Cash Realization Analysis
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Store Walk-In POS Register */}
            <div className="rounded-2xl border border-[#e2e8f0] bg-[#fffdf0] p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-extrabold text-[#092341]">
                  <Store className="size-4 text-[#d97706]" />
                  Store Walk-in Counter POS
                </span>
                <span className="rounded-full bg-[#fef3c7] px-2.5 py-0.5 font-bold text-[#b45309]">
                  Walk-In Receipts
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-[#f0fdf4] p-3 border border-[#bbf7d0]">
                  <span className="text-[10px] font-bold text-[#16a34a] uppercase">Realized Paid</span>
                  <p className="mt-1 text-lg font-black text-[#15803d]">
                    {formatKes(metrics.walkInPaid)}
                  </p>
                </div>

                <div className="rounded-xl bg-[#fffbeb] p-3 border border-[#fde68a]">
                  <span className="text-[10px] font-bold text-[#b45309] uppercase">Pending Unpaid</span>
                  <p className="mt-1 text-lg font-black text-[#b45309]">
                    {formatKes(metrics.walkInUnpaid)}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Website Online Bookings */}
            <div className="rounded-2xl border border-[#e2e8f0] bg-[#f0f9ff] p-5 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 font-extrabold text-[#092341]">
                  <Globe className="size-4 text-[#0284c7]" />
                  Direct Website Online Bookings
                </span>
                <span className="rounded-full bg-[#e0f2fe] px-2.5 py-0.5 font-bold text-[#0369a1]">
                  Online Portal
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-[#f0fdf4] p-3 border border-[#bbf7d0]">
                  <span className="text-[10px] font-bold text-[#16a34a] uppercase">Realized Paid</span>
                  <p className="mt-1 text-lg font-black text-[#15803d]">
                    {formatKes(metrics.onlinePaid)}
                  </p>
                </div>

                <div className="rounded-xl bg-[#fffbeb] p-3 border border-[#fde68a]">
                  <span className="text-[10px] font-bold text-[#b45309] uppercase">Pending Unpaid</span>
                  <p className="mt-1 text-lg font-black text-[#b45309]">
                    {formatKes(metrics.onlineUnpaid)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Financial Ledger Table (Paid vs Unpaid Direct Action) */}
      <div className="rounded-3xl border border-[#cbd5e1] bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f1f5f9] pb-4">
          <div>
            <h3 className="text-lg font-black text-[#092341]">
              Financial Transaction Ledger
            </h3>
            <p className="text-xs text-[#64748b]">
              Inspect transaction details, verify M-Pesa receipts, and mark tickets as paid in real time.
            </p>
          </div>

          {/* Paid vs Unpaid Filter Buttons */}
          <div className="flex items-center gap-1 rounded-xl bg-[#f8fafc] p-1 border border-[#cbd5e1]">
            <button
              type="button"
              onClick={() => setLedgerFilter("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${
                ledgerFilter === "all"
                  ? "bg-[#092341] text-white shadow-xs"
                  : "text-[#64748b] hover:bg-white"
              }`}
            >
              All Transactions ({filteredOrders.length})
            </button>

            <button
              type="button"
              onClick={() => setLedgerFilter("paid")}
              className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${
                ledgerFilter === "paid"
                  ? "bg-[#16a34a] text-white shadow-xs"
                  : "text-[#64748b] hover:bg-white"
              }`}
            >
              🟢 Realized Paid ({metrics.paidCount})
            </button>

            <button
              type="button"
              onClick={() => setLedgerFilter("unpaid")}
              className={`rounded-lg px-3 py-1.5 text-xs font-extrabold transition ${
                ledgerFilter === "unpaid"
                  ? "bg-[#d97706] text-white shadow-xs"
                  : "text-[#64748b] hover:bg-white"
              }`}
            >
              ⏳ Unpaid Pending ({metrics.unpaidCount})
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] uppercase tracking-wider font-extrabold">
                <th className="p-3">Ticket ID / Ref</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Channel / Location</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Accounting Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {ledgerOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-[#94a3b8]">
                    No financial records match the selected filter.
                  </td>
                </tr>
              ) : (
                ledgerOrders.map((order) => {
                  const isPaid = order.paymentStatus === "PAID";
                  const paymentOptionLabel =
                    paymentOptions.find((p) => p.id === order.paymentOption)?.label ||
                    order.paymentOption;

                  return (
                    <tr key={order.id} className="hover:bg-[#f8fafc]/80 transition">
                      <td className="p-3 font-bold text-[#092341]">
                        {order.ticketId}
                        <span className="block text-[10px] text-[#94a3b8]">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-[#092341]">{order.customerName}</span>
                        <span className="block text-[10px] text-[#64748b]">
                          {order.customerPhone}
                        </span>
                      </td>

                      <td className="p-3 font-semibold text-[#475569]">
                        {order.serviceArea}
                      </td>

                      <td className="p-3 font-black text-sm text-[#092341]">
                        {formatKes(order.priceTotalKe)}
                      </td>

                      <td className="p-3 text-[#475569]">
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-bold">
                          <CreditCard className="size-3 text-[#1363DF]" />
                          {paymentOptionLabel}
                        </span>
                      </td>

                      <td className="p-3">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#f0fdf4] px-2.5 py-1 text-[10px] font-black uppercase text-[#16a34a]">
                            <CheckCircle2 className="size-3" />
                            PAID
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#fffbeb] px-2.5 py-1 text-[10px] font-black uppercase text-[#b45309]">
                            <Clock className="size-3" />
                            UNPAID
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <form action={updatePaymentStatusAction} className="inline-block">
                          <input type="hidden" name="orderId" value={order.id} />
                          <input
                            type="hidden"
                            name="paymentStatus"
                            value={isPaid ? "PENDING" : "PAID"}
                          />
                          <button
                            type="submit"
                            className={`rounded-xl px-3 py-1.5 text-[11px] font-extrabold transition shadow-2xs ${
                              isPaid
                                ? "border border-[#cbd5e1] bg-white text-[#64748b] hover:bg-[#f8fafc]"
                                : "bg-[#16a34a] text-white hover:bg-[#15803d]"
                            }`}
                          >
                            {isPaid ? "Mark Unpaid" : "Mark as Paid ✓"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
