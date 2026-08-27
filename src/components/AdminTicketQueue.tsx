"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Mail,
  Package,
  Phone,
  Search,
  Send,
  User,
  X,
} from "lucide-react";
import { updateStatusAction } from "@/app/admin/actions";
import { StatusBadge } from "@/components/StatusBadge";
import { formatKes, statusLabels, statusSteps } from "@/lib/business";
import type { OrderStatus } from "@/lib/orders";

type ServiceLine = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lineTotalKe: number;
};

type AdminOrder = {
  id: number;
  ticketId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceArea: string;
  address: string;
  specialInstructions?: string;
  status: OrderStatus;
  priceTotalKe: number;
  createdAt: string;
  pickupDatetime: string;
  deliveryDatetime: string;
  serviceDetails: {
    lines: ServiceLine[];
  };
};

type AdminTicketQueueProps = {
  orders: AdminOrder[];
};

const TICKETS_PER_PAGE = 5;

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });
}

export function AdminTicketQueue({ orders }: AdminTicketQueueProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      if (!matchesStatus) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const qDigits = q.replace(/\D/g, "");

      // Smart Kenyan Phone Search Normalization
      let phoneMatch = false;
      if (qDigits.length >= 3) {
        const queryKenyaDigits = (qDigits.startsWith("07") || qDigits.startsWith("01"))
          ? "254" + qDigits.slice(1)
          : qDigits;

        const orderPhoneDigits = order.customerPhone.replace(/\D/g, "");
        phoneMatch =
          orderPhoneDigits.includes(queryKenyaDigits) ||
          order.customerPhone.toLowerCase().includes(q);
      } else {
        phoneMatch = order.customerPhone.toLowerCase().includes(q);
      }

      return (
        order.ticketId.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        phoneMatch ||
        order.customerEmail.toLowerCase().includes(q) ||
        order.serviceArea.toLowerCase().includes(q) ||
        order.address.toLowerCase().includes(q)
      );
    });
  }, [orders, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / TICKETS_PER_PAGE) || 1;
  const safePage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const start = (safePage - 1) * TICKETS_PER_PAGE;
    return filteredOrders.slice(start, start + TICKETS_PER_PAGE);
  }, [filteredOrders, safePage]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Real-Time Live Search & Filter Bar */}
      <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Instant Search: Type Ticket ID, Name, Phone, Email, or Neighborhood..."
              className="w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] py-2.5 pl-10 pr-10 text-xs font-medium text-[#092341] outline-none transition focus:border-[#1363DF] focus:bg-white focus:ring-2 focus:ring-[#1363DF]/20"
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
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3.5 py-2.5 text-xs font-bold text-[#092341] outline-none focus:border-[#1363DF]"
            >
              <option value="">All Statuses ({orders.length})</option>
              {statusSteps.map((item) => (
                <option key={item} value={item}>
                  {statusLabels[item]}
                </option>
              ))}
            </select>

            {searchQuery || statusFilter ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("");
                  setCurrentPage(1);
                }}
                className="inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 py-2.5 text-xs font-bold text-[#475569] transition hover:bg-white"
              >
                <X className="size-3.5" />
                <span>Reset</span>
              </button>
            ) : null}
          </div>
        </div>

        {searchQuery || statusFilter ? (
          <p className="mt-2.5 text-[11px] font-bold text-[#1363DF]">
            ⚡ Instant Search Active: Found {filteredOrders.length} matching ticket{filteredOrders.length === 1 ? "" : "s"}
          </p>
        ) : null}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
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

                {/* Status Response Form */}
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
            <p className="mt-3 text-base font-bold text-[#092341]">No tickets matched &quot;{searchQuery}&quot;.</p>
            <p className="mt-1 text-xs">Try clearing or changing your search terms.</p>
          </div>
        )}

        {/* Minimal Scroll Ticket Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#cbd5e1] bg-white p-4 shadow-xs text-xs font-bold text-[#092341]">
            <span>
              Showing {((safePage - 1) * TICKETS_PER_PAGE) + 1}–
              {Math.min(safePage * TICKETS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length} tickets
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage === 1}
                className="inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3.5 py-1.5 transition hover:bg-white hover:border-[#1363DF] disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="size-4" />
                <span>Previous</span>
              </button>

              <span className="px-2">Page {safePage} of {totalPages}</span>

              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safePage === totalPages}
                className="inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3.5 py-1.5 transition hover:bg-white hover:border-[#1363DF] disabled:opacity-30 disabled:pointer-events-none"
              >
                <span>Next</span>
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
