# Fresh Flow Laundry Services

Next.js App Router rebuild for Fresh Flow Laundry Services in Kenya, with PostgreSQL orders, osTicket ticket creation, email notifications, customer tracking, and a lightweight admin queue.

## What Is Included

- Mobile-first booking flow with service area check, live KSh quote, pickup/delivery slots, customer details, payment choice, consent, and ticket confirmation.
- PostgreSQL schema for `orders`, `order_status_history`, and `notifications_log`.
- osTicket API bridge for creating staff tickets from web bookings.
- Email confirmation and status notifications through SMTP.
- `/track` customer self-service page.
- `/admin` protected operations queue for order review and status updates.
- Kenya-focused content, M-Pesa instructions, privacy policy, terms, and structured SEO data.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Start the local PostgreSQL database:

```bash
npm run db:start
```

4. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

The local database runs on port `55432` using:

```bash
postgres://freshflow:freshflow@localhost:55432/freshflow
```

To stop it:

```bash
npm run db:stop
```

Docker Compose is still available for teams that prefer containerized
PostgreSQL and Mailpit.

## Demo Mode

The site now works for a no-credentials demo. If `DATABASE_URL` is not set,
new bookings are saved locally to `.data/demo-orders.json`, so booking,
tracking, and admin status updates still work.

For the local admin queue, use password `freshflow-demo` unless
`ADMIN_SHARED_SECRET` is set.

## Production Setup

Apply the schema to production PostgreSQL:

```bash
psql "$DATABASE_URL" -f database/schema.sql
```

Set production environment variables for:

- PostgreSQL: `DATABASE_URL`
- SMTP sender: `SMTP_HOST`, `SMTP_FROM`, and provider credentials
- osTicket: `OSTICKET_API_URL`, `OSTICKET_API_KEY`, `OSTICKET_TOPIC_ID`
- Admin queue: `ADMIN_SHARED_SECRET`
- Owner-confirmed public details: phone, address, M-Pesa Till/Paybill

See [docs/osticket-integration.md](docs/osticket-integration.md) for the osTicket setup and status sync contract.

## Owner Details To Confirm

- Physical address and phone number
- Exact service areas and route limits
- Final KSh rate card and minimum quantities
- M-Pesa Till or Paybill number
- Whether pay on collection/delivery is offered
- Any real customer testimonials or partner references

No fake testimonials, dead social links, placeholder counters, South Africa address details, Stripe-only payment, or WordPress booking plugin assumptions are carried into this rebuild.
