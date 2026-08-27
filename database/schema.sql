CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  ticket_id TEXT UNIQUE,
  osticket_ticket_id TEXT,
  osticket_number TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  service_area TEXT NOT NULL,
  service_details_json JSONB NOT NULL,
  pickup_datetime TIMESTAMPTZ NOT NULL,
  delivery_datetime TIMESTAMPTZ NOT NULL,
  address TEXT NOT NULL,
  special_instructions TEXT,
  price_total_ke NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payment_option TEXT NOT NULL CHECK (
    payment_option IN ('mpesa_till', 'mpesa_paybill', 'pay_on_delivery')
  ),
  payment_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (
    payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')
  ),
  mpesa_reference TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (
    status IN (
      'NEW',
      'PICKED_UP',
      'IN_PROGRESS',
      'READY',
      'OUT_FOR_DELIVERY',
      'COMPLETED'
    )
  ),
  consent_email_updates BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS orders_pickup_datetime_idx ON orders (pickup_datetime);
CREATE INDEX IF NOT EXISTS orders_customer_lookup_idx
  ON orders (lower(customer_email), customer_phone);
CREATE INDEX IF NOT EXISTS orders_ticket_lookup_idx ON orders (upper(ticket_id));

CREATE TABLE IF NOT EXISTS order_status_history (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by TEXT NOT NULL,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS order_status_history_order_idx
  ON order_status_history (order_id, changed_at);

CREATE TABLE IF NOT EXISTS notifications_log (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
  channel TEXT NOT NULL,
  recipient TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('SENT', 'FAILED', 'SKIPPED')),
  provider_message_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_log_order_idx
  ON notifications_log (order_id, created_at);

CREATE TABLE IF NOT EXISTS customer_feedback (
  id BIGSERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  location_area TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  service_type TEXT NOT NULL,
  review_text TEXT NOT NULL,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customer_feedback_approved_idx
  ON customer_feedback (approved, created_at);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_set_updated_at ON orders;
CREATE TRIGGER orders_set_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- SEED TEST DEMO DATA
INSERT INTO customer_feedback (customer_name, location_area, rating, service_type, review_text, approved)
VALUES
  ('Jane Wanjiku', 'Kilimani', 5, 'Ironing', 'My silk blouses came back perfectly steam pressed and on wooden hangers. Exceptional express service!', true),
  ('Peter Omondi', 'Westlands', 5, 'House Cleaning', 'The house cleaning crew was punctual, polite, and left my 2-bedroom home spotless. Highly recommended!', true),
  ('Mercy Mutua', 'Lavington', 5, 'Carpet Cleaning', 'Extremely thorough deep foam shampooing for my living room carpets. Removed stubborn coffee stains completely.', true),
  ('David Kiprop', 'Karen', 5, 'Fumigation', 'Pest control team arrived on time with professional gear. Odorless fumigation and zero pests remaining!', true)
ON CONFLICT DO NOTHING;
