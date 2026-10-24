ALTER TABLE listings DROP CONSTRAINT IF EXISTS listings_kind_check;
ALTER TABLE listings ADD CONSTRAINT listings_kind_check CHECK (kind IN ('product','service','rental'));
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS request_key uuid;
CREATE UNIQUE INDEX IF NOT EXISTS request_idempotency_idx ON service_requests(buyer_id,request_key);
CREATE INDEX IF NOT EXISTS request_listing_idx ON service_requests(listing_id,status);
