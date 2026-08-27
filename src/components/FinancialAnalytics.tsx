"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
  Globe,
  Store,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatKes } from "@/lib/business";
import type { Order } from "@/lib/orders";

type FinancialAnalyticsProps = {
  orders: Order[];
};

type Timeframe = "weekly" | "monthly" | "quarterly" | "yearly";

export function FinancialAnalytics({ orders }: FinancialAnalyticsProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");

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

  const totalRevenue = useMemo(
    () => filteredOrders.reduce((sum, o) => sum + Number(o.priceTotalKe || 0), 0),
    [filteredOrders]
  );
  const totalOrdersCount = filteredOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // Channel Analysis: Walk-In Counter vs Direct Website Bookings
  const channelMetrics = useMemo(() => {
    let walkInRevenue = 0;
    let walkInCount = 0;
    let onlineRevenue = 0;
    let onlineCount = 0;

    for (const order of filteredOrders) {
      const isWalkIn =
        order.ticketId.toUpperCase().startsWith("WALK-") ||
        order.serviceArea.toLowerCase().includes("walk-in");

      if (isWalkIn) {
        walkInRevenue += Number(order.priceTotalKe || 0);
        walkInCount += 1;
      } else {
        onlineRevenue += Number(order.priceTotalKe || 0);
        onlineCount += 1;
      }
    }

    const walkInPct = totalRevenue > 0 ? Math.round((walkInRevenue / totalRevenue) * 100) : 0;
    const onlinePct = totalRevenue > 0 ? Math.round((onlineRevenue / totalRevenue) * 100) : 0;

    return {
      walkInRevenue,
      walkInCount,
      walkInPct,
      onlineRevenue,
      onlineCount,
      onlinePct,
    };
  }, [filteredOrders, totalRevenue]);

  // Service Category Breakdown
  const categoryRevenue = useMemo(() => {
    const cat = {
      laundry: 0,
      house_cleaning: 0,
      carpet_cleaning: 0,
      fumigation: 0,
    };

    for (const order of filteredOrders) {
      for (const line of order.serviceDetails.lines) {
        const c = line.category || "laundry";
        if (c in cat) {
          cat[c as keyof typeof cat] += line.lineTotalKe;
        } else {
          cat.laundry += line.lineTotalKe;
        }
      }
    }

    return cat;
  }, [filteredOrders]);

  const categoryPercentages = {
    laundry: totalRevenue > 0 ? Math.round((categoryRevenue.laundry / totalRevenue) * 100) : 0,
    house_cleaning: totalRevenue > 0 ? Math.round((categoryRevenue.house_cleaning / totalRevenue) * 100) : 0,
    carpet_cleaning: totalRevenue > 0 ? Math.round((categoryRevenue.carpet_cleaning / totalRevenue) * 100) : 0,
    fumigation: totalRevenue > 0 ? Math.round((categoryRevenue.fumigation / totalRevenue) * 100) : 0,
  };

  return (
    <div className="rounded-3xl border border-[#cbd5e1] bg-white p-6 shadow-sm lg:p-8 text-[#092341]">
      {/* Executive Title Header & Real-Time Timeframe Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f1f5f9] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
            <TrendingUp className="size-4" />
            <span>Senior Financial Intelligence Engine</span>
          </div>
          <h2 className="mt-1 text-2xl font-black text-[#092341]">
            Executive Financial Dashboard
          </h2>
          <p className="mt-0.5 text-xs text-[#64748b]">
            Real-time revenue tracking across store walk-in register and online direct bookings.
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
                  ? "bg-[#092341] text-white shadow-sm"
                  : "text-[#64748b] hover:bg-white hover:text-[#092341]"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Financial KPI Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#bfdbfe] bg-[#F0F7FF] p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1363DF]">
            {timeframe} Total Gross Revenue
          </span>
          <div className="mt-2 text-3xl font-black text-[#092341]">
            {formatKes(totalRevenue)}
          </div>
          <p className="mt-1 text-xs text-[#475569]">
            Gross earnings across all channels ({totalOrdersCount} total tickets)
          </p>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Average Order Value (AOV)
          </span>
          <div className="mt-2 text-3xl font-black text-[#16a34a]">
            {formatKes(avgOrderValue)}
          </div>
          <p className="mt-1 text-xs text-[#64748b]">Average ticket size in selected {timeframe} window</p>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Order Volume Count
          </span>
          <div className="mt-2 text-3xl font-black text-[#092341]">
            {totalOrdersCount} <span className="text-sm font-normal text-[#64748b]">tickets</span>
          </div>
          <p className="mt-1 text-xs text-[#64748b]">Completed & active tickets</p>
        </div>
      </div>

      {/* Channel Breakdown Section: Walk-In Counter vs Direct Website Bookings */}
      <div className="mt-8 border-t border-[#f1f5f9] pt-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-[#092341] uppercase tracking-wider">
              Booking Channel Financial Distribution
            </h3>
            <p className="text-xs text-[#64748b]">
              Comparison between Store Walk-In POS register and Website Direct online bookings
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Store Walk-In POS Register */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-[#fffdf0] p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-extrabold text-[#092341]">
                <Store className="size-4 text-[#d97706]" />
                Store Counter Walk-In POS
              </span>
              <span className="rounded-full bg-[#fef3c7] px-2.5 py-0.5 font-extrabold text-[#b45309]">
                {channelMetrics.walkInPct}% of Revenue
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-black text-[#092341]">
                {formatKes(channelMetrics.walkInRevenue)}
              </p>
              <span className="text-xs font-bold text-[#64748b]">
                {channelMetrics.walkInCount} tickets
              </span>
            </div>

            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#fef3c7]">
              <div
                className="h-full bg-[#d97706] transition-all duration-500"
                style={{ width: `${channelMetrics.walkInPct}%` }}
              />
            </div>
          </div>

          {/* Website Direct Online Bookings */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-[#f0f9ff] p-5 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-extrabold text-[#092341]">
                <Globe className="size-4 text-[#0284c7]" />
                Direct Website Online Bookings
              </span>
              <span className="rounded-full bg-[#e0f2fe] px-2.5 py-0.5 font-extrabold text-[#0369a1]">
                {channelMetrics.onlinePct}% of Revenue
              </span>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-black text-[#092341]">
                {formatKes(channelMetrics.onlineRevenue)}
              </p>
              <span className="text-xs font-bold text-[#64748b]">
                {channelMetrics.onlineCount} tickets
              </span>
            </div>

            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#e0f2fe]">
              <div
                className="h-full bg-[#0284c7] transition-all duration-500"
                style={{ width: `${channelMetrics.onlinePct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Service Category Revenue Breakdown */}
      <div className="mt-8 border-t border-[#f1f5f9] pt-6">
        <h3 className="text-sm font-extrabold text-[#092341] uppercase tracking-wider mb-4">
          Service Category Revenue Breakdown
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Laundry */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#092341]">🧺 Laundry & Dry Cleaning</span>
              <span className="font-bold text-[#1363DF]">{categoryPercentages.laundry}%</span>
            </div>
            <p className="mt-2 text-xl font-black text-[#092341]">
              {formatKes(categoryRevenue.laundry)}
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
              <div
                className="h-full bg-[#1363DF] transition-all duration-500"
                style={{ width: `${categoryPercentages.laundry}%` }}
              />
            </div>
          </div>

          {/* House Cleaning */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#092341]">🧹 House Cleaning</span>
              <span className="font-bold text-[#16a34a]">{categoryPercentages.house_cleaning}%</span>
            </div>
            <p className="mt-2 text-xl font-black text-[#092341]">
              {formatKes(categoryRevenue.house_cleaning)}
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
              <div
                className="h-full bg-[#16a34a] transition-all duration-500"
                style={{ width: `${categoryPercentages.house_cleaning}%` }}
              />
            </div>
          </div>

          {/* Carpet Cleaning */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#092341]">🛋️ Carpet Cleaning</span>
              <span className="font-bold text-[#f59e0b]">{categoryPercentages.carpet_cleaning}%</span>
            </div>
            <p className="mt-2 text-xl font-black text-[#092341]">
              {formatKes(categoryRevenue.carpet_cleaning)}
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
              <div
                className="h-full bg-[#f59e0b] transition-all duration-500"
                style={{ width: `${categoryPercentages.carpet_cleaning}%` }}
              />
            </div>
          </div>

          {/* Fumigation */}
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#092341]">🪲 Pest & Fumigation</span>
              <span className="font-bold text-[#8b5cf6]">{categoryPercentages.fumigation}%</span>
            </div>
            <p className="mt-2 text-xl font-black text-[#092341]">
              {formatKes(categoryRevenue.fumigation)}
            </p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
              <div
                className="h-full bg-[#8b5cf6] transition-all duration-500"
                style={{ width: `${categoryPercentages.fumigation}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
