ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery jsonb NOT NULL DEFAULT '{}';
CREATE TABLE IF NOT EXISTS delivery_tracking (
 item_id uuid PRIMARY KEY REFERENCES order_items(id) ON DELETE CASCADE,
 token_hash text,
 expires_at timestamptz,
 position jsonb,
 updated_at timestamptz,
 sharing boolean NOT NULL DEFAULT false
);
