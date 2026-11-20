import { z } from "zod";
import { digest, token } from "./security.js";
import { fail } from "./validation.js";

const coordinates = z.object({ lat: z.number().min(-85).max(85), lng: z.number().min(-180).max(180) });
export const deliveryAddress = z.object({
  point: coordinates.nullable().default(null),
  note: z.string().trim().max(500).default(""),
});
const position = coordinates.extend({ accuracy: z.number().min(0).max(100000), capturedAt: z.iso.datetime() });

export function deliveryRoutes(app, { db }) {
  app.get("/api/orders/:id/delivery", { preHandler: app.authenticate }, async (request) => {
    const id = z.uuid().parse(request.params.id);
    const order = (await db.query("SELECT id,address,delivery,created_at FROM orders WHERE id=$1 AND buyer_id=$2", [id, request.account.id])).rows[0];
    if (!order) fail(404, "NOT_FOUND");
    const items = (await db.query(`SELECT i.id,i.name,i.status,u.store_name AS seller_name,
      CASE WHEN i.status='shipped' THEN d.position ELSE NULL END AS position,
      d.updated_at, COALESCE(d.sharing,false) AND i.status='shipped' AND d.expires_at>now() AS sharing
      FROM order_items i LEFT JOIN users u ON u.id=i.seller_id
      LEFT JOIN delivery_tracking d ON d.item_id=i.id WHERE i.order_id=$1`, [id])).rows;
    return { order, items };
  });
  // A short-lived, revocable capability grants only location publishing for one item.
  app.post("/api/seller/orders/:id/driver", { preHandler: app.sellerOnly }, async (request) => {
    const id = z.uuid().parse(request.params.id);
    const raw = token();
    await db.transaction(async tx => {
      const item = (await tx.query("SELECT status FROM order_items WHERE id=$1 AND seller_id=$2 FOR UPDATE", [id, request.account.id])).rows[0];
      if (!item) fail(404, "NOT_FOUND");
      if (!["accepted", "shipped"].includes(item.status)) fail(409, "INVALID_TRANSITION");
      await tx.query(`INSERT INTO delivery_tracking(item_id,token_hash,expires_at) VALUES($1,$2,now()+interval '24 hours')
        ON CONFLICT(item_id) DO UPDATE SET token_hash=$2,expires_at=now()+interval '24 hours',sharing=false,position=NULL,updated_at=NULL`, [id, digest(raw)]);
    });
    return { token: raw };
  });
  app.delete("/api/seller/orders/:id/driver", { preHandler: app.sellerOnly }, async request => {
    const id = z.uuid().parse(request.params.id);
    const item = (await db.query("SELECT id FROM order_items WHERE id=$1 AND seller_id=$2", [id, request.account.id])).rows[0];
    if (!item) fail(404, "NOT_FOUND");
    await db.query("UPDATE delivery_tracking SET token_hash=NULL,sharing=false,position=NULL WHERE item_id=$1", [id]);
    return { ok: true };
  });
  const driver = async (request, work) => {
    const raw = request.headers["x-delivery-token"];
    if (typeof raw !== "string" || !/^[a-f0-9]{64}$/.test(raw)) fail(401, "AUTH_REQUIRED");
    return db.transaction(async tx => {
      const item = (await tx.query(`SELECT i.id,i.status,o.address,o.delivery,d.updated_at FROM delivery_tracking d
        JOIN order_items i ON i.id=d.item_id JOIN orders o ON o.id=i.order_id
        WHERE d.token_hash=$1 AND d.expires_at>now() FOR UPDATE OF i,d`, [digest(raw)])).rows[0];
      if (!item) fail(401, "AUTH_REQUIRED");
      if (!["accepted", "shipped"].includes(item.status)) fail(409, "INVALID_TRANSITION");
      return work(tx, item);
    });
  };
  app.get("/api/delivery/driver", { config: { rateLimit: { max: 60, timeWindow: "1 minute" } } }, request =>
    driver(request, async (_tx, item) => ({ address: item.address, delivery: item.delivery, status: item.status })));
  app.post("/api/delivery/driver/location", { config: { rateLimit: { max: 20, timeWindow: "1 minute" } } }, request =>
    driver(request, async (tx, item) => {
      if (item.status !== "shipped") fail(409, "INVALID_TRANSITION");
      const data = position.parse(request.body);
      const captured = Date.parse(data.capturedAt);
      if (captured < Date.now() - 120000 || captured > Date.now() + 30000) fail(400, "VALIDATION_FAILED");
      await tx.query(`UPDATE delivery_tracking SET position=$1,updated_at=now(),sharing=true WHERE item_id=$2
        AND (position IS NULL OR (position->>'capturedAt')::timestamptz < $3::timestamptz)`, [JSON.stringify(data), item.id, data.capturedAt]);
      return { ok: true };
    }));
  app.post("/api/delivery/driver/stop", request => driver(request, async (tx, item) => {
    await tx.query("UPDATE delivery_tracking SET sharing=false WHERE item_id=$1", [item.id]);
    return { ok: true };
  }));
}
