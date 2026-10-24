import { randomUUID } from "node:crypto";
import { z } from "zod";
import { phone, text, fail } from "./validation.js";

export function commerceRoutes(app, { db }) {
  app.post(
    "/api/orders",
    { preHandler: app.authenticate },
    async (request, reply) => {
      const data = z
        .object({
          idempotencyKey: z.uuid(),
          address: text(300),
          phone,
          consent: z.literal(true),
          items: z
            .array(
              z.object({
                id: text(100),
                quantity: z.number().int().min(1).max(10000),
              }),
            )
            .min(1)
            .max(50),
        })
        .parse(request.body);
      if (new Set(data.items.map((item) => item.id)).size !== data.items.length)
        fail(400, "DUPLICATE_ITEMS");
      const order = await db.transaction(async (tx) => {
        await tx.query("SELECT id FROM users WHERE id=$1 FOR UPDATE", [
          request.account.id,
        ]);
        const previous = (
          await tx.query(
            "SELECT * FROM orders WHERE buyer_id=$1 AND idempotency_key=$2",
            [request.account.id, data.idempotencyKey],
          )
        ).rows[0];
        if (previous) return previous;
        const lines = [];
        for (const input of [...data.items].sort((a, b) =>
          a.id.localeCompare(b.id),
        )) {
          const product = (
            await tx.query(
              "SELECT * FROM listings WHERE id=$1 AND kind='product' AND published=true AND seller_id IS NOT NULL AND COALESCE(data->>'demo','false')<>'true' FOR UPDATE",
              [input.id],
            )
          ).rows[0];
          if (!product || product.stock < input.quantity)
            fail(409, "OUT_OF_STOCK");
          lines.push({ ...product, quantity: input.quantity });
        }
        const total = lines.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
        const result = (
          await tx.query(
            "INSERT INTO orders(id,buyer_id,idempotency_key,address,phone,total) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
            [
              randomUUID(),
              request.account.id,
              data.idempotencyKey,
              data.address,
              data.phone,
              total,
            ],
          )
        ).rows[0];
        for (const line of lines) {
          await tx.query("UPDATE listings SET stock=stock-$1 WHERE id=$2", [
            line.quantity,
            line.id,
          ]);
          await tx.query(
            "INSERT INTO order_items(id,order_id,listing_id,seller_id,name,price,quantity) VALUES($1,$2,$3,$4,$5,$6,$7)",
            [
              randomUUID(),
              result.id,
              line.id,
              line.seller_id,
              line.data.name,
              line.price,
              line.quantity,
            ],
          );
        }
        return result;
      });
      reply.code(201);
      return { order };
    },
  );
  app.get("/api/orders", { preHandler: app.authenticate }, async (request) => {
    const orders = (
      await db.query(
        "SELECT * FROM orders WHERE buyer_id=$1 ORDER BY created_at DESC LIMIT 100",
        [request.account.id],
      )
    ).rows;
    for (const order of orders)
      order.items = (
        await db.query(
          "SELECT id,listing_id,name,price,quantity,status FROM order_items WHERE order_id=$1",
          [order.id],
        )
      ).rows;
    return { orders };
  });
  app.get(
    "/api/seller/orders",
    { preHandler: app.sellerOnly },
    async (request) => {
      return {
        items: (
          await db.query(
            "SELECT i.*,o.address,o.phone,o.created_at FROM order_items i JOIN orders o ON o.id=i.order_id WHERE i.seller_id=$1 ORDER BY o.created_at DESC LIMIT 100",
            [request.account.id],
          )
        ).rows,
      };
    },
  );
  app.patch(
    "/api/seller/orders/:id",
    { preHandler: app.sellerOnly },
    async (request) => {
      const { status } = z
        .object({
          status: z.enum(["accepted", "shipped", "completed", "cancelled"]),
        })
        .parse(request.body);
      const result = await db.transaction(async (tx) => {
        const item = (
          await tx.query(
            "SELECT * FROM order_items WHERE id=$1 AND seller_id=$2 FOR UPDATE",
            [request.params.id, request.account.id],
          )
        ).rows[0];
        if (!item) fail(404, "NOT_FOUND");
        const transitions = {
          new: ["accepted", "cancelled"],
          accepted: ["shipped", "cancelled"],
          shipped: ["completed"],
          completed: [],
          cancelled: [],
        };
        if (!transitions[item.status].includes(status))
          fail(409, "INVALID_TRANSITION");
        if (status === "cancelled")
          await tx.query("UPDATE listings SET stock=stock+$1 WHERE id=$2", [
            item.quantity,
            item.listing_id,
          ]);
        return (
          await tx.query(
            "UPDATE order_items SET status=$1 WHERE id=$2 RETURNING *",
            [status, item.id],
          )
        ).rows[0];
      });
      return { item: result };
    },
  );
  app.post(
    "/api/services/:id/requests",
    { preHandler: app.authenticate },
    async (request, reply) => {
      const data = z
        .object({
          name: text(100),
          phone,
          address: text(300),
          quantity: z.number().positive().max(100000),
          date: z.iso.date().optional(),
          task: text(2000).min(10),
          consent: z.literal(true),
        })
        .parse(request.body);
      if (
        data.date &&
        (Number.isNaN(Date.parse(data.date)) ||
          data.date < new Date().toISOString().slice(0, 10))
      )
        fail(400, "INVALID_DATE");
      const service = (
        await db.query(
          "SELECT * FROM listings WHERE id=$1 AND kind='service' AND published=true AND seller_id IS NOT NULL AND COALESCE(data->>'demo','false')<>'true'",
          [request.params.id],
        )
      ).rows[0];
      if (!service) fail(404, "NOT_FOUND");
      const saved = {
        ...data,
        estimate: Math.round(data.quantity * service.price),
      };
      const result = (
        await db.query(
          "INSERT INTO service_requests(id,listing_id,buyer_id,seller_id,data) VALUES($1,$2,$3,$4,$5) RETURNING id,status,created_at",
          [
            randomUUID(),
            service.id,
            request.account.id,
            service.seller_id,
            JSON.stringify(saved),
          ],
        )
      ).rows[0];
      reply.code(201);
      return { request: result };
    },
  );
  app.get(
    "/api/requests",
    { preHandler: app.authenticate },
    async (request) => {
      return {
        items: (
          await db.query(
            "SELECT * FROM service_requests WHERE buyer_id=$1 ORDER BY created_at DESC LIMIT 100",
            [request.account.id],
          )
        ).rows,
      };
    },
  );
  app.get(
    "/api/seller/requests",
    { preHandler: app.sellerOnly },
    async (request) => {
      return {
        items: (
          await db.query(
            "SELECT r.*, l.data->>'name' AS name FROM service_requests r JOIN listings l ON l.id=r.listing_id WHERE r.seller_id=$1 ORDER BY r.created_at DESC LIMIT 100",
            [request.account.id],
          )
        ).rows,
      };
    },
  );
  app.patch(
    "/api/seller/requests/:id",
    { preHandler: app.sellerOnly },
    async (request) => {
      const { status } = z
        .object({ status: z.enum(["accepted", "completed", "cancelled"]) })
        .parse(request.body);
      const updated = await db.transaction(async (tx) => {
        const item = (
          await tx.query(
            "SELECT * FROM service_requests WHERE id=$1 AND seller_id=$2 FOR UPDATE",
            [request.params.id, request.account.id],
          )
        ).rows[0];
        if (!item) fail(404, "NOT_FOUND");
        if (
          !{
            new: ["accepted", "cancelled"],
            accepted: ["completed", "cancelled"],
            completed: [],
            cancelled: [],
          }[item.status].includes(status)
        )
          fail(409, "INVALID_TRANSITION");
        if (item.data.kind === "rental" && status === "accepted") {
          // Serialize confirmations for this individual machine.
          await tx.query("SELECT id FROM listings WHERE id=$1 FOR UPDATE", [
            item.listing_id,
          ]);
          const overlap = await tx.query(
            "SELECT id FROM service_requests WHERE listing_id=$1 AND id<>$2 AND status='accepted' AND data->>'startDate'<=$4 AND data->>'endDate'>=$3",
            [item.listing_id, item.id, item.data.startDate, item.data.endDate],
          );
          if (overlap.rows.length) fail(409, "RENTAL_UNAVAILABLE");
        }
        return (
          await tx.query(
            "UPDATE service_requests SET status=$1 WHERE id=$2 RETURNING *",
            [status, item.id],
          )
        ).rows[0];
      });
      return { request: updated };
    },
  );
}
