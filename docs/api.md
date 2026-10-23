# STROY UZ API

Node.js 24 LTS, Fastify, PostgreSQL. Frontend and API share one origin.
Vite proxies /api to 127.0.0.1:3001 in development.

## Local development without installing PostgreSQL

Two terminals:

    npm ci
    npm run db:seed:local
    npm run api:local

Then, in a second terminal:

    npm run dev

Local mode explicitly uses PGlite (PostgreSQL in WASM), with persistent data
in .data/postgres. Stop the API before running seed against the same local
database: only one embedded process may open that directory.
No default login or password is created. Register through /register.
Demo catalog listings have no seller account. Create your own listings to
check the complete seller → customer → order workflow.

Node.js 24 is recommended for the API scripts and --env-file-if-exists.

## PostgreSQL server

Copy .env.example to .env. Set DATABASE_URL to a PostgreSQL connection string.
If using Docker, set a unique POSTGRES_PASSWORD in .env, run docker compose up -d,
and set DATABASE_URL with that password. Then run npm run api.
The initial SQL schema is applied transactionally on startup.

Production requires NODE_ENV=production, DATABASE_URL, and HTTPS APP_ORIGIN.
Embedded mode and demo seeding refuse to run in production. Put a TLS reverse
proxy in front of the API; route /api to Node and serve dist as the SPA,
including the fallback to index.html for React Router paths.
The application intentionally does not enable cross-origin requests.
Use a dedicated database user and persistent storage for .data/uploads
(or MEDIA_DIR), and configure backups before real customer traffic.

## Sessions and errors

Passwords use salted scrypt. Only password hashes are stored.
The random session secret is in a HttpOnly, SameSite=Lax cookie. Production
cookies are Secure. The database stores only the SHA-256 hash of the secret.
Tokens are not returned in JSON or saved in browser localStorage.

GET /api/auth/me returns {user, csrf}. Authenticated write requests require
X-CSRF-Token. Browser write requests must have APP_ORIGIN as their Origin.
JSON endpoints require Content-Type: application/json; uploads use multipart.
Queries use parameters. Seller endpoints enforce role and record ownership.
Validation errors return 400; missing sessions 401; denied access 403;
unknown records 404; conflicting inventory/status 409; rate limits 429.
Response shape on failure: {error, fields?}.

## Endpoints

| Method | Path | Access / behavior |
| --- | --- | --- |
| GET | /api/health | Checks database connectivity |
| POST | /api/auth/register | name, email, password, phone, role, storeName, consent |
| POST | /api/auth/login | email, password, remember; rotates session |
| GET | /api/auth/me | Current account and CSRF token, or null |
| POST | /api/auth/logout | Deletes current session |
| POST | /api/auth/forgot-password | email, consent; generic result |
| POST | /api/auth/reset-password | token, password; consumes token and revokes sessions |
| GET | /api/products, /api/services | Published catalog; q, limit (1–100), offset |
| GET | /api/products/:id, /api/services/:id | Published listing |
| GET, POST | /api/seller/products, /api/seller/services | Own listings / create |
| PUT, DELETE | /api/seller/products/:id, /api/seller/services/:id | Replace / unpublish own listing |
| POST | /api/media | Seller upload: one PNG/JPEG/WebP, max 5 MiB |
| GET | /api/media/:name | Uploaded image |
| POST | /api/orders | Authenticated checkout |
| GET | /api/orders | Current customer's orders and line items |
| GET | /api/seller/orders | Only current seller's order items and delivery details |
| PATCH | /api/seller/orders/:id | Per-item status transition |
| POST | /api/services/:id/requests | Authenticated estimate request |
| GET | /api/requests | Current customer's requests |
| GET | /api/seller/requests | Requests addressed to current seller |
| PATCH | /api/seller/requests/:id | Request status transition |

Listing payload:

    {
      "name": "Drill", "description": "Description", "details": "18V",
      "category": "Tools", "categoryId": "tools",
      "price": 890000, "stock": 10, "unit": "pcs", "city": "Bukhara",
      "image": "/api/media/UPLOAD_ID.jpg", "published": true
    }

Checkout payload: {idempotencyKey: UUID, address, phone, consent: true,
items: [{id, quantity}]}. The API ignores any client-supplied total. Prices
and inventory are read under database locks in a transaction. Repeating
the same idempotencyKey for one customer returns the same order without
deducting inventory again. Cancellation before shipping restores inventory.
Seller status transitions: new → accepted → shipped → completed,
or new/accepted → cancelled. Service requests omit the shipped step.

Service request payload: {name, phone, address, quantity, date?, task,
consent: true}. The server computes the estimate; the final scope/price
still needs agreement with the provider.

The frontend uploads the first selected photograph; additional gallery
photographs, online payments, verification/moderation and notification
delivery for orders are outside this initial API implementation.
User-created listing text is user content; interface labels support RU/UZ/EN.

## Password recovery

Set SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD and SMTP_FROM.
Without SMTP, recovery returns MAIL_NOT_CONFIGURED, and the UI explains this.
Reset links expire in 30 minutes, are stored hashed, are single-use, and
invalidate existing sessions. The public response never confirms account
existence. Mail transport errors do not expose that existence either.
No reset link is printed to the console. SMTP delivery needs a real
provider and sender configuration; it cannot be verified without them.

## Tests

    npm run test:api
    node --test scripts/check-*.mjs
    npm run build
    npm run lint

API tests run against isolated in-memory PostgreSQL (PGlite), using the
actual SQL schema and HTTP handlers. They cover registration, password
hashing/session behavior, CSRF, role/ownership enforcement, stock rollback,
idempotency, status transitions, requests and one-time password resets.
An external PostgreSQL server and real SMTP are separate deployment checks.
