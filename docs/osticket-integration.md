# Fresh Flow osTicket Integration

Fresh Flow uses Next.js and PostgreSQL as the customer-facing order system. osTicket is the operations queue for staff.

## Recommended Topology

- Next.js App Router app: booking UI, validation, PostgreSQL writes, email sending, tracking, lightweight admin queue.
- PostgreSQL: source of truth for `orders`, `order_status_history`, and `notifications_log`.
- osTicket: PHP application backed by MySQL/MariaDB. Use osTicket’s API for ticket creation.
- Email: domain sender such as `orders@freshflowslaundry.com` with SPF, DKIM, and DMARC.

osTicket traditionally runs on MySQL/MariaDB, so keep it on its own database and sync with PostgreSQL through API/webhook calls.

## osTicket Setup

1. Install osTicket on a PHP-capable host.
2. Create an API key in Admin Panel → Manage → API.
3. Allow the Next.js server IP address for that API key.
4. Create a help topic such as `Website Laundry Order` and put its ID in `OSTICKET_TOPIC_ID`.
5. Configure staff alerts so new tickets email operations staff.
6. Create custom fields or a custom form for:
   - Fresh Flow ticket ID
   - Service details
   - Pickup datetime
   - Delivery datetime
   - Service area
   - Address
   - Payment option
   - Payment status
   - M-Pesa reference
7. Align ticket states with Fresh Flow states:
   - New
   - Picked Up
   - In Progress
   - Ready
   - Out for Delivery
   - Completed

## Ticket Creation

The booking server action:

1. Validates customer details with Zod.
2. Inserts an order into PostgreSQL.
3. Generates a customer ticket ID such as `FFL-KE-2026-00042`.
4. Sends a POST request to `OSTICKET_API_URL`.
5. Stores osTicket identifiers in `orders.osticket_ticket_id` and `orders.osticket_number`.
6. Sends customer and staff emails if SMTP is configured.
7. Logs skipped or failed notifications in `notifications_log`.

Expected osTicket endpoint:

```text
OSTICKET_API_URL=https://support.freshflowslaundry.com/api/tickets.json
```

Request headers:

```text
Content-Type: application/json
X-API-Key: <OSTICKET_API_KEY>
```

## Status Sync

Two supported patterns are included:

- Staff update status in the Next.js `/admin` queue. The app updates PostgreSQL, emails the customer, and can push a note back to osTicket through `OSTICKET_STATUS_SYNC_URL`.
- Staff update status in osTicket. A small osTicket plugin, cron job, or bridge can POST to:

```text
POST /api/osticket/status
X-Freshflow-Webhook-Secret: <OSTICKET_WEBHOOK_SECRET>
```

Payload:

```json
{
  "ticketId": "FFL-KE-2026-00042",
  "status": "PICKED_UP",
  "notes": "Collected at reception."
}
```

The route updates `orders.status`, appends `order_status_history`, and emails the customer.

## Email Templates

Start with the app’s SMTP emails. If osTicket email templates are preferred later, disable app-level order emails and let osTicket autoresponders handle customer confirmations.

Minimum sender setup:

- `SMTP_FROM=Fresh Flow Laundry <orders@freshflowslaundry.com>`
- SPF record allows the email provider.
- DKIM is enabled and verified.
- DMARC has at least a monitoring policy.

## Launch Checklist

- Confirm legal business name, physical address, phone number, and service areas with the owner.
- Confirm KSh pricing, pickup/delivery charge, and minimum quantities.
- Confirm M-Pesa Till or Paybill number.
- Apply `database/schema.sql` to production PostgreSQL.
- Configure osTicket API key and source IP allowlist.
- Test booking, customer email, staff email, ticket creation, status sync, and tracking.
