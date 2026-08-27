"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe,
  Printer,
  Receipt,
  Search,
  Sparkles,
  Store,
  TrendingUp,
} from "lucide-react";
import { formatKes, paymentOptions } from "@/lib/business";
import type { Order } from "@/lib/orders";

type ExecutiveReportingModuleProps = {
  orders: Order[];
};

type DateFilter = "today" | "7days" | "30days" | "ytd" | "all";
type ChannelFilter = "all" | "walkin" | "online";
type PaymentFilter = "all" | "paid" | "unpaid";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });
}

function formatDateShort(value: string) {
  return new Date(value).toLocaleDateString("en-KE", {
    dateStyle: "medium",
    timeZone: "Africa/Nairobi",
  });
}

export function ExecutiveReportingModule({ orders }: ExecutiveReportingModuleProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>("30days");
  const [channelFilter, setChannelFilter] = useState<ChannelFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");
  const [areaFilter, setAreaFilter] = useState<string>("all");

  const now = new Date();

  // Extract unique service areas for filtering
  const uniqueAreas = useMemo(() => {
    const set = new Set<string>();
    for (const o of orders) {
      if (o.serviceArea) set.add(o.serviceArea);
    }
    return Array.from(set).sort();
  }, [orders]);

  // Apply Filter Criteria
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const created = new Date(o.createdAt);
      const diffDays = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);

      // Date range filter
      if (dateFilter === "today" && diffDays > 1) return false;
      if (dateFilter === "7days" && diffDays > 7) return false;
      if (dateFilter === "30days" && diffDays > 30) return false;
      if (dateFilter === "ytd" && created.getFullYear() !== now.getFullYear()) return false;

      // Channel filter
      const isWalkIn =
        o.ticketId.toUpperCase().startsWith("WALK-") ||
        o.serviceArea.toLowerCase().includes("walk-in");
      if (channelFilter === "walkin" && !isWalkIn) return false;
      if (channelFilter === "online" && isWalkIn) return false;

      // Payment filter
      const isPaid = o.paymentStatus === "PAID";
      if (paymentFilter === "paid" && !isPaid) return false;
      if (paymentFilter === "unpaid" && isPaid) return false;

      // Neighborhood area filter
      if (areaFilter !== "all" && o.serviceArea !== areaFilter) return false;

      return true;
    });
  }, [orders, dateFilter, channelFilter, paymentFilter, areaFilter]);

  // Report Summary Metrics
  const summary = useMemo(() => {
    let paidTotal = 0;
    let unpaidTotal = 0;
    let paidCount = 0;
    let unpaidCount = 0;

    for (const o of filteredOrders) {
      const val = Number(o.priceTotalKe || 0);
      if (o.paymentStatus === "PAID") {
        paidTotal += val;
        paidCount += 1;
      } else {
        unpaidTotal += val;
        unpaidCount += 1;
      }
    }

    const grossTotal = paidTotal + unpaidTotal;
    const totalCount = filteredOrders.length;
    const avgValue = totalCount > 0 ? grossTotal / totalCount : 0;
    const realizationPct = grossTotal > 0 ? Math.round((paidTotal / grossTotal) * 100) : 0;

    return {
      paidTotal,
      unpaidTotal,
      grossTotal,
      paidCount,
      unpaidCount,
      totalCount,
      avgValue,
      realizationPct,
    };
  }, [filteredOrders]);

  // Download Report as CSV
  const handleExportCSV = () => {
    const headers = [
      "Ticket ID",
      "Created Date",
      "Customer Name",
      "Phone",
      "Email",
      "Service Area",
      "Services Selected",
      "Total KES",
      "Payment Method",
      "Payment Status",
      "Order Status",
    ];

    const rows = filteredOrders.map((o) => {
      const services = o.serviceDetails.lines
        .map((l) => `${l.name} (${l.quantity}${l.unit})`)
        .join("; ");

      return [
        `"${o.ticketId}"`,
        `"${formatDateShort(o.createdAt)}"`,
        `"${o.customerName.replace(/"/g, '""')}"`,
        `"${o.customerPhone}"`,
        `"${o.customerEmail}"`,
        `"${o.serviceArea}"`,
        `"${services.replace(/"/g, '""')}"`,
        o.priceTotalKe,
        `"${o.paymentOption}"`,
        `"${o.paymentStatus}"`,
        `"${o.status}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `FreshFlow_Executive_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Executive Report
  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-[#092341]">
      {/* Report Header Card & Filter Toolbar */}
      <div className="rounded-3xl border border-[#cbd5e1] bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f1f5f9] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
              <FileSpreadsheet className="size-4" />
              <span>Executive Business Intelligence & Audit Reports</span>
            </div>
            <h2 className="mt-1 text-3xl font-black text-[#092341]">
              Operational & Financial Report Studio
            </h2>
            <p className="mt-1 text-xs text-[#64748b]">
              Generate, filter, and export formal accounting reports for executive review and tax audits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#16a34a] px-4 text-xs font-extrabold text-white shadow-md transition hover:bg-[#15803d]"
            >
              <FileSpreadsheet className="size-4" />
              <span>Export CSV Spreadsheet</span>
            </button>

            <button
              type="button"
              onClick={handlePrintReport}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#cbd5e1] bg-white px-4 text-xs font-bold text-[#092341] shadow-xs transition hover:bg-[#f8fafc]"
            >
              <Printer className="size-4" />
              <span>Print / Save PDF Report</span>
            </button>
          </div>
        </div>

        {/* Multi-Dimensional Filter Controls */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
          {/* Date Filter */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase text-[#64748b]">
              Time Period Window
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as DateFilter)}
              className="mt-1.5 min-h-10 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-xs font-bold text-[#092341] outline-none focus:border-[#1363DF]"
            >
              <option value="today">Today Only</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="ytd">Year to Date (YTD)</option>
              <option value="all">All Historical Data</option>
            </select>
          </div>

          {/* Channel Filter */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase text-[#64748b]">
              Sales Channel
            </label>
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value as ChannelFilter)}
              className="mt-1.5 min-h-10 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-xs font-bold text-[#092341] outline-none focus:border-[#1363DF]"
            >
              <option value="all">All Channels (Walk-In + Online)</option>
              <option value="walkin">Store Walk-In Counter POS</option>
              <option value="online">Direct Website Online Bookings</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase text-[#64748b]">
              Payment Realization
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}
              className="mt-1.5 min-h-10 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-xs font-bold text-[#092341] outline-none focus:border-[#1363DF]"
            >
              <option value="all">All (Paid + Unpaid)</option>
              <option value="paid">🟢 Realized Cash Paid Only</option>
              <option value="unpaid">⏳ Outstanding Unpaid Only</option>
            </select>
          </div>

          {/* Service Area Filter */}
          <div>
            <label className="block text-[11px] font-extrabold uppercase text-[#64748b]">
              Service Neighborhood
            </label>
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="mt-1.5 min-h-10 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 text-xs font-bold text-[#092341] outline-none focus:border-[#1363DF]"
            >
              <option value="all">All Service Areas</option>
              {uniqueAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Executive KPI Summary Cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] p-5 shadow-xs">
            <span className="text-[10px] font-black uppercase text-[#16a34a]">
              Realized Cash Revenue
            </span>
            <div className="mt-1.5 text-2xl font-black text-[#15803d]">
              {formatKes(summary.paidTotal)}
            </div>
            <p className="mt-1 text-[11px] text-[#16a34a]">
              {summary.paidCount} verified paid receipts
            </p>
          </div>

          <div className="rounded-2xl border border-[#fde68a] bg-[#fffbeb] p-5 shadow-xs">
            <span className="text-[10px] font-black uppercase text-[#b45309]">
              Outstanding Receivables
            </span>
            <div className="mt-1.5 text-2xl font-black text-[#b45309]">
              {formatKes(summary.unpaidTotal)}
            </div>
            <p className="mt-1 text-[11px] text-[#b45309]">
              {summary.unpaidCount} pending collection
            </p>
          </div>

          <div className="rounded-2xl border border-[#bfdbfe] bg-[#f0f9ff] p-5 shadow-xs">
            <span className="text-[10px] font-black uppercase text-[#0369a1]">
              Total Gross Pipeline
            </span>
            <div className="mt-1.5 text-2xl font-black text-[#092341]">
              {formatKes(summary.grossTotal)}
            </div>
            <p className="mt-1 text-[11px] text-[#0369a1]">
              {summary.totalCount} total ticket records
            </p>
          </div>

          <div className="rounded-2xl border border-[#cbd5e1] bg-[#f8fafc] p-5 shadow-xs">
            <span className="text-[10px] font-black uppercase text-[#64748b]">
              Average Order Value (AOV)
            </span>
            <div className="mt-1.5 text-2xl font-black text-[#092341]">
              {formatKes(summary.avgValue)}
            </div>
            <p className="mt-1 text-[11px] text-[#64748b]">
              Realization rate: {summary.realizationPct}%
            </p>
          </div>
        </div>
      </div>

      {/* Formal Audit Table Presentation */}
      <div className="rounded-3xl border border-[#cbd5e1] bg-white p-6 shadow-sm lg:p-8">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h3 className="text-lg font-black text-[#092341]">
              Filtered Executive Audit Ledger
            </h3>
            <p className="text-xs text-[#64748b]">
              Displaying {filteredOrders.length} ticket records matching the active filter criteria.
            </p>
          </div>
          <span className="rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-bold text-[#475569]">
            {filteredOrders.length} Rows Extracted
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-[#64748b] uppercase tracking-wider font-extrabold">
                <th className="p-3">Ticket ID</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer Details</th>
                <th className="p-3">Neighborhood</th>
                <th className="p-3">Amount (KES)</th>
                <th className="p-3">Payment Method</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#94a3b8]">
                    No report data found matching the selected filter rules.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const isPaid = o.paymentStatus === "PAID";
                  const isWalkIn =
                    o.ticketId.toUpperCase().startsWith("WALK-") ||
                    o.serviceArea.toLowerCase().includes("walk-in");

                  return (
                    <tr key={o.id} className="hover:bg-[#f8fafc]/80 transition">
                      <td className="p-3 font-bold text-[#092341]">
                        {o.ticketId}
                        {isWalkIn && (
                          <span className="ml-1.5 rounded bg-[#fef3c7] px-1.5 py-0.5 text-[9px] font-bold text-[#b45309]">
                            WALK-IN
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-[#64748b]">
                        {formatDateShort(o.createdAt)}
                      </td>

                      <td className="p-3">
                        <span className="font-bold text-[#092341]">{o.customerName}</span>
                        <span className="block text-[10px] text-[#64748b]">{o.customerPhone}</span>
                      </td>

                      <td className="p-3 font-semibold text-[#475569]">
                        {o.serviceArea}
                      </td>

                      <td className="p-3 font-black text-sm text-[#092341]">
                        {formatKes(o.priceTotalKe)}
                      </td>

                      <td className="p-3 text-[#475569]">
                        {o.paymentOption}
                      </td>

                      <td className="p-3">
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#f0fdf4] px-2.5 py-0.5 text-[10px] font-black text-[#16a34a]">
                            <CheckCircle2 className="size-3" />
                            PAID
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#fffbeb] px-2.5 py-0.5 text-[10px] font-black text-[#b45309]">
                            <Clock className="size-3" />
                            UNPAID
                          </span>
                        )}
                      </td>

                      <td className="p-3 font-bold text-[#475569]">
                        {o.status}
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
