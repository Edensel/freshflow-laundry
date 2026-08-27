"use client";

import { useState } from "react";
import {
  BarChart3,
  Building2,
  Calendar,
  CheckCircle2,
  DollarSign,
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
  const filteredOrders = orders.filter((o) => {
    const created = new Date(o.createdAt);
    const diffDays = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);

    if (timeframe === "weekly") return diffDays <= 7;
    if (timeframe === "monthly") return diffDays <= 30;
    if (timeframe === "quarterly") return diffDays <= 90;
    if (timeframe === "yearly") return diffDays <= 365;
    return true;
  });

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + Number(o.priceTotalKe || 0), 0);
  const totalOrdersCount = filteredOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // Breakdown by Service Category
  const categoryRevenue = {
    laundry: 0,
    house_cleaning: 0,
    carpet_cleaning: 0,
    fumigation: 0,
  };

  for (const order of filteredOrders) {
    for (const line of order.serviceDetails.lines) {
      const cat = line.category || "laundry";
      if (cat in categoryRevenue) {
        categoryRevenue[cat as keyof typeof categoryRevenue] += line.lineTotalKe;
      } else {
        categoryRevenue.laundry += line.lineTotalKe;
      }
    }
  }

  const categoryPercentages = {
    laundry: totalRevenue > 0 ? Math.round((categoryRevenue.laundry / totalRevenue) * 100) : 0,
    house_cleaning: totalRevenue > 0 ? Math.round((categoryRevenue.house_cleaning / totalRevenue) * 100) : 0,
    carpet_cleaning: totalRevenue > 0 ? Math.round((categoryRevenue.carpet_cleaning / totalRevenue) * 100) : 0,
    fumigation: totalRevenue > 0 ? Math.round((categoryRevenue.fumigation / totalRevenue) * 100) : 0,
  };

  return (
    <div className="rounded-3xl border border-[#cbd5e1] bg-white p-6 shadow-sm lg:p-8 text-[#092341]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f1f5f9] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
            <TrendingUp className="size-4" />
            <span>Executive Financial Intelligence</span>
          </div>
          <h2 className="mt-1 text-2xl font-black text-[#092341]">
            Revenue & Financial Analysis
          </h2>
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

      {/* Main KPI Revenue Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-[#bfdbfe] bg-[#F0F7FF] p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1363DF]">
            {timeframe} Total Revenue
          </span>
          <div className="mt-2 text-3xl font-black text-[#092341]">
            {formatKes(totalRevenue)}
          </div>
          <p className="mt-1 text-xs text-[#475569]">Gross earnings from all services</p>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Total Bookings & Orders
          </span>
          <div className="mt-2 text-3xl font-black text-[#092341]">
            {totalOrdersCount} <span className="text-sm font-normal text-[#64748b]">orders</span>
          </div>
          <p className="mt-1 text-xs text-[#64748b]">In selected {timeframe} period</p>
        </div>

        <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
            Average Order Value (AOV)
          </span>
          <div className="mt-2 text-3xl font-black text-[#16a34a]">
            {formatKes(avgOrderValue)}
          </div>
          <p className="mt-1 text-xs text-[#64748b]">Per customer booking ticket</p>
        </div>
      </div>

      {/* Service Category Revenue Breakdown */}
      <div className="mt-8">
        <h3 className="text-sm font-extrabold text-[#092341] uppercase tracking-wider mb-4">
          Service Category Revenue Generations
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
                className="h-full bg-[#1363DF]"
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
                className="h-full bg-[#16a34a]"
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
                className="h-full bg-[#f59e0b]"
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
                className="h-full bg-[#8b5cf6]"
                style={{ width: `${categoryPercentages.fumigation}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
