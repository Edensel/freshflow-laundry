import "server-only";

import nodemailer from "nodemailer";
import {
  businessConfig,
  formatKes,
  paymentInstructions,
  paymentOptions,
  statusLabels,
} from "@/lib/business";
import type { Order } from "@/lib/orders";

type EmailResult =
  | { status: "sent"; messageId: string | null }
  | { status: "skipped"; reason: string };

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASSWORD
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
  });
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Nairobi",
  });
}

function generateHtmlReceipt(order: Order): string {
  const paymentLabel =
    paymentOptions.find((option) => option.id === order.paymentOption)?.label ||
    order.paymentOption;

  const linesHtml = order.serviceDetails.lines
    .map(
      (line) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #092341;">${line.name}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #475569;">${line.quantity} ${line.unit}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: #1363DF;">${formatKes(line.lineTotalKe)}</td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Fresh Flow Official Receipt</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #cbd5e1; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
          <!-- Header Banner -->
          <div style="background: linear-gradient(135deg, #092341 0%, #1363DF 100%); padding: 30px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffe823;">Fresh Flow Services</h1>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #e2e8f0; font-weight: 500;">Official Service Receipt & Ticket Confirmation</p>
          </div>

          <!-- Ticket Badge -->
          <div style="background-color: #F0F7FF; padding: 16px 24px; border-bottom: 1px solid #bfdbfe; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 11px; font-weight: bold; color: #1363DF; text-transform: uppercase;">Ticket ID</span>
              <div style="font-size: 20px; font-weight: 900; color: #092341;">${order.ticketId}</div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 11px; font-weight: bold; color: #166534; text-transform: uppercase;">Order Status</span>
              <div style="font-size: 14px; font-weight: bold; color: #16a34a; background: #f0fdf4; padding: 4px 12px; border-radius: 20px; border: 1px solid #bbf7d0; display: inline-block; margin-top: 2px;">
                ✓ ${statusLabels[order.status]}
              </div>
            </div>
          </div>

          <!-- Client Details -->
          <div style="padding: 24px;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-weight: bold; width: 120px;">Customer Name:</td>
                <td style="padding: 4px 0; color: #092341; font-weight: bold;">${order.customerName}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-weight: bold;">Phone Number:</td>
                <td style="padding: 4px 0; color: #092341;">${order.customerPhone}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-weight: bold;">Service Address:</td>
                <td style="padding: 4px 0; color: #092341;">📍 ${order.serviceArea} — ${order.address}</td>
              </tr>
              <tr>
                <td style="padding: 4px 0; color: #64748b; font-weight: bold;">Date & Window:</td>
                <td style="padding: 4px 0; color: #092341;">${formatDate(order.pickupDatetime)}</td>
              </tr>
            </table>

            <!-- Itemized Table -->
            <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: bold; color: #092341; text-transform: uppercase; border-bottom: 2px solid #092341; padding-bottom: 6px;">Itemized Services</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f1f5f9; text-align: left; font-size: 11px; text-transform: uppercase; color: #475569;">
                  <th style="padding: 8px 12px;">Service Description</th>
                  <th style="padding: 8px 12px; text-align: center;">Qty</th>
                  <th style="padding: 8px 12px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${linesHtml}
              </tbody>
            </table>

            <!-- Summary Box -->
            <div style="background-color: #092341; color: #ffffff; padding: 20px; border-radius: 12px; margin-top: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; opacity: 0.9;">
                <span>Subtotal:</span>
                <span>${formatKes(order.serviceDetails.subtotalKe)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; opacity: 0.9;">
                <span>Service/Delivery Fee:</span>
                <span>${order.serviceDetails.pickupDeliveryKe === 0 ? "FREE" : formatKes(order.serviceDetails.pickupDeliveryKe)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: 900; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 12px; color: #ffe823;">
                <span>Grand Total:</span>
                <span>${formatKes(order.priceTotalKe)}</span>
              </div>
            </div>

            <!-- Payment Info -->
            <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; font-size: 12px; color: #475569;">
              <div style="font-weight: bold; color: #092341; margin-bottom: 4px;">Payment Method: ${paymentLabel}</div>
              <div>Official M-Pesa Till: <strong>${businessConfig.mpesa.tillNumber}</strong> | Paybill: <strong>${businessConfig.mpesa.paybillNumber}</strong></div>
              <div style="margin-top: 6px; font-style: italic; color: #64748b;">Thank you for choosing Fresh Flow Services in Nairobi!</div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 11px; color: #64748b; border-t: 1px solid #e2e8f0;">
            © ${new Date().getFullYear()} ${businessConfig.name} • Contact: ${businessConfig.phone} • Email: ${businessConfig.email}
          </div>
        </div>
      </body>
    </html>
  `;
}

function orderText(order: Order, audience: "customer" | "staff") {
  const paymentLabel =
    paymentOptions.find((option) => option.id === order.paymentOption)?.label ||
    order.paymentOption;
  const serviceLines = order.serviceDetails.lines
    .map(
      (line) =>
        `${line.name}: ${line.quantity} ${line.unit} - ${formatKes(line.lineTotalKe)}`
    )
    .join("\n");

  return `
${audience === "customer" ? "Thank you for choosing Fresh Flow Services." : "New Fresh Flow order received."}

Ticket ID: ${order.ticketId}
Status: ${statusLabels[order.status]}

Customer: ${order.customerName}
Phone: ${order.customerPhone}
Email: ${order.customerEmail}
Area: ${order.serviceArea}
Address: ${order.address}

Services:
${serviceLines}

Pickup/Date: ${formatDate(order.pickupDatetime)}
Delivery/Completion: ${formatDate(order.deliveryDatetime)}
Total: ${formatKes(order.priceTotalKe)}
Payment: ${paymentLabel}

Payment instructions:
${paymentInstructions(order.paymentOption).join("\n")}
`.trim();
}

export async function sendOrderEmail(
  order: Order,
  recipient: "customer" | "staff"
): Promise<EmailResult> {
  if (!smtpConfigured()) {
    return {
      status: "skipped",
      reason: "SMTP_HOST and SMTP_FROM are not configured.",
    };
  }

  const to =
    recipient === "customer"
      ? order.customerEmail
      : process.env.STAFF_NOTIFICATION_EMAIL || businessConfig.staffEmail;
  const subject =
    recipient === "customer"
      ? `Fresh Flow Official Receipt & Ticket ${order.ticketId}`
      : `New Fresh Flow order ${order.ticketId}`;

  const info = await transporter().sendMail({
    from: process.env.SMTP_FROM,
    to,
    replyTo: businessConfig.email,
    subject,
    text: orderText(order, recipient),
    html: generateHtmlReceipt(order),
  });

  return {
    status: "sent",
    messageId: typeof info.messageId === "string" ? info.messageId : null,
  };
}

export async function sendStatusEmail(order: Order) {
  if (!smtpConfigured()) {
    return {
      status: "skipped" as const,
      reason: "SMTP_HOST and SMTP_FROM are not configured.",
    };
  }

  const info = await transporter().sendMail({
    from: process.env.SMTP_FROM,
    to: order.customerEmail,
    replyTo: businessConfig.email,
    subject: `Fresh Flow Receipt & Status ${order.ticketId}: ${statusLabels[order.status]}`,
    text: `
Your Fresh Flow order has been updated.

Ticket ID: ${order.ticketId}
Current status: ${statusLabels[order.status]}
Pickup/Date: ${formatDate(order.pickupDatetime)}
Delivery/Completion: ${formatDate(order.deliveryDatetime)}

Track your order at https://${businessConfig.domain}/track
`.trim(),
    html: generateHtmlReceipt(order),
  });

  return {
    status: "sent" as const,
    messageId: typeof info.messageId === "string" ? info.messageId : null,
  };
}
