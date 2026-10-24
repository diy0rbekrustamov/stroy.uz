CREATE TABLE IF NOT EXISTS users (
 id uuid PRIMARY KEY,
 email text NOT NULL UNIQUE,
 password_hash text NOT NULL,
 name text NOT NULL,
 phone text NOT NULL DEFAULT '',
 role text NOT NULL CHECK (role IN ('buyer','seller')),
 store_name text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash text PRIMARY KEY,
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 csrf text NOT NULL,
 expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
CREATE TABLE IF NOT EXISTS password_resets (
 token_hash text PRIMARY KEY,
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS listings (
 id text PRIMARY KEY,
 seller_id uuid REFERENCES users(id),
 kind text NOT NULL CHECK (kind IN ('product','service')),
 data jsonb NOT NULL,
 price integer NOT NULL CHECK (price >= 0),
 stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
 published boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS listings_seller_idx ON listings(seller_id);
CREATE TABLE IF NOT EXISTS orders (
 id uuid PRIMARY KEY,
 buyer_id uuid NOT NULL REFERENCES users(id),
 idempotency_key uuid NOT NULL,
 address text NOT NULL,
 phone text NOT NULL,
 total bigint NOT NULL CHECK (total >= 0),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(buyer_id,idempotency_key)
);
CREATE TABLE IF NOT EXISTS order_items (
 id uuid PRIMARY KEY,
 order_id uuid NOT NULL REFERENCES orders(id),
 listing_id text NOT NULL REFERENCES listings(id),
 seller_id uuid REFERENCES users(id),
 name text NOT NULL,
 price integer NOT NULL,
 quantity integer NOT NULL CHECK (quantity > 0),
 status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','accepted','shipped','completed','cancelled'))
);
CREATE INDEX IF NOT EXISTS order_items_seller_idx ON order_items(seller_id);
CREATE TABLE IF NOT EXISTS service_requests (
 id uuid PRIMARY KEY,
 listing_id text NOT NULL REFERENCES listings(id),
 buyer_id uuid NOT NULL REFERENCES users(id),
 seller_id uuid REFERENCES users(id),
 data jsonb NOT NULL,
 status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','accepted','completed','cancelled')),
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS requests_seller_idx ON service_requests(seller_id);
