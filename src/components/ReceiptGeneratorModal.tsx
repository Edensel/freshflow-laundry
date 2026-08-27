"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Phone,
  Printer,
  Receipt,
  Search,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { businessConfig, formatKes, paymentOptions } from "@/lib/business";
import type { Order } from "@/lib/orders";

type ReceiptGeneratorModalProps = {
  orders: Order[];
};

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });
}

export function ReceiptGeneratorModal({ orders }: ReceiptGeneratorModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string>(
    orders[0]?.ticketId || ""
  );

  const activeOrder = orders.find((o) => o.ticketId === selectedTicketId) || orders[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl bg-[#092341] px-4 py-2 text-xs font-extrabold text-[#ffe823] shadow-md transition hover:bg-[#0b2d54]"
      >
        <Receipt className="size-4" />
        <span>Generate Customer Receipt</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl lg:p-8 max-h-[90vh] overflow-y-auto text-[#092341]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1363DF]">
                <Receipt className="size-4" />
                <span>Instant Official Receipt Generator</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#092341]"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Select Ticket Dropdown */}
            <div className="mt-4 rounded-2xl bg-[#f8fafc] p-4 border border-[#e2e8f0]">
              <label className="block text-xs font-extrabold uppercase text-[#092341]">
                Select Customer Ticket to Generate Receipt:
              </label>
              <select
                value={selectedTicketId}
                onChange={(e) => setSelectedTicketId(e.target.value)}
                className="mt-1.5 min-h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 text-xs font-bold text-[#092341] outline-none focus:border-[#1363DF]"
              >
                {orders.map((o) => (
                  <option key={o.id} value={o.ticketId}>
                    {o.ticketId} — {o.customerName} ({o.serviceArea}) — {formatKes(o.priceTotalKe)} — [{o.paymentStatus}]
                  </option>
                ))}
              </select>
            </div>

            {activeOrder && (
              <div className="mt-6 rounded-3xl border-2 border-[#cbd5e1] bg-white p-6 shadow-lg lg:p-8 printable-receipt">
                {/* Official Letterhead Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-[#092341] pb-6">
                  <div>
                    <Image
                      src="/images/original-site/logo-1.png"
                      alt={businessConfig.name}
                      width={180}
                      height={50}
                      className="h-10 w-auto"
                    />
                    <p className="mt-2 text-xs font-extrabold text-[#092341]">
                      {businessConfig.name}
                    </p>
                    <p className="text-[11px] text-[#64748b]">
                      Store Location: {businessConfig.address}
                    </p>
                    <p className="text-[11px] text-[#64748b]">
                      Phone: {businessConfig.phone} | Email: {businessConfig.email}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="rounded-lg bg-[#092341] px-3 py-1 text-xs font-black uppercase text-[#ffe823]">
                      Official Tax Receipt
                    </span>
                    <h3 className="mt-2 text-xl font-black text-[#092341]">
                      #{activeOrder.ticketId}
                    </h3>
                    <p className="text-xs text-[#64748b]">
                      Date: <strong>{formatDate(activeOrder.createdAt)}</strong>
                    </p>

                    <div className="mt-2">
                      {activeOrder.paymentStatus === "PAID" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#f0fdf4] px-3 py-1 text-xs font-black uppercase text-[#16a34a] ring-1 ring-[#bbf7d0]">
                          <CheckCircle2 className="size-3.5" />
                          PAID IN FULL
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#fffbeb] px-3 py-1 text-xs font-black uppercase text-[#b45309] ring-1 ring-[#fde68a]">
                          <Clock className="size-3.5" />
                          PAYMENT PENDING
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Details Grid */}
                <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-[#f8fafc] p-4 text-xs border border-[#e2e8f0]">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#94a3b8]">Billed To</span>
                    <p className="font-extrabold text-[#092341] text-sm">{activeOrder.customerName}</p>
                    <p className="text-[#64748b]">{activeOrder.customerPhone}</p>
                    <p className="text-[#64748b]">{activeOrder.customerEmail}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#94a3b8]">Service & Delivery</span>
                    <p className="font-bold text-[#092341]">{activeOrder.serviceArea}</p>
                    <p className="text-[#64748b]">{activeOrder.address}</p>
                    <p className="text-[#64748b]">Pickup: {formatDate(activeOrder.pickupDatetime)}</p>
                  </div>
                </div>

                {/* Service Line Items Table */}
                <div className="mt-6">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#cbd5e1] bg-[#f1f5f9] text-[#092341] font-extrabold uppercase">
                        <th className="p-3">Service Description</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit Rate</th>
                        <th className="p-3 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0]">
                      {activeOrder.serviceDetails.lines.map((line) => (
                        <tr key={line.id}>
                          <td className="p-3 font-bold text-[#092341]">{line.name}</td>
                          <td className="p-3 text-center font-semibold text-[#475569]">
                            {line.quantity} {line.unit}
                          </td>
                          <td className="p-3 text-right text-[#475569]">
                            {formatKes(line.priceKe)}
                          </td>
                          <td className="p-3 text-right font-bold text-[#092341]">
                            {formatKes(line.lineTotalKe)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Payment Breakdown & Total */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#cbd5e1] pt-4">
                  <div className="text-xs text-[#64748b] space-y-1">
                    <p>Payment Method: <strong>{activeOrder.paymentOption}</strong></p>
                    <p>M-Pesa Till: <strong>{businessConfig.mpesa.tillNumber}</strong> | Paybill: <strong>{businessConfig.mpesa.paybillNumber}</strong></p>
                    <p className="text-[10px] text-[#94a3b8]">Thank you for choosing Fresh Flow Laundry Nairobi!</p>
                  </div>

                  <div className="rounded-2xl bg-[#092341] p-4 text-right text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                      Total Amount Due
                    </span>
                    <p className="text-2xl font-black text-[#ffe823]">
                      {formatKes(activeOrder.priceTotalKe)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Print & Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-[#f1f5f9] pt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border border-[#cbd5e1] px-5 py-2.5 text-xs font-bold text-[#64748b] hover:bg-[#f8fafc]"
              >
                Close
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1363DF] px-6 py-2.5 text-xs font-extrabold text-white shadow-md transition hover:bg-[#0F4C81]"
              >
                <Printer className="size-4" />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
