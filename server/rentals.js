import { randomUUID } from "node:crypto";
import { z } from "zod";
import { phone, text, fail } from "./validation.js";

export function rentalRoutes(app, { db }) {
  app.post(
    "/api/rentals/:id/requests",
    { preHandler: app.authenticate },
    async (request, reply) => {
      const data = z
        .object({
          idempotencyKey: z.uuid(),
          name: text(100),
          phone,
          address: text(300),
          startDate: z.iso.date(),
          endDate: z.iso.date(),
          task: text(2000).min(10),
          consent: z.literal(true),
        })
        .parse(request.body);
      const days =
        Math.round(
          (Date.parse(data.endDate) - Date.parse(data.startDate)) / 86400000,
        ) + 1;
      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Tashkent",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());
      if (data.startDate < today || days < 1 || days > 365)
        fail(400, "INVALID_DATE");
      const saved = await db.transaction(async (tx) => {
        await tx.query("SELECT id FROM users WHERE id=$1 FOR UPDATE", [
          request.account.id,
        ]);
        const previous = (
          await tx.query(
            "SELECT * FROM service_requests WHERE buyer_id=$1 AND request_key=$2",
            [request.account.id, data.idempotencyKey],
          )
        ).rows[0];
        if (previous) {
          if (previous.listing_id !== request.params.id)
            fail(409, "INVALID_TRANSITION");
          return previous;
        }
        const machine = (
          await tx.query(
            "SELECT * FROM listings WHERE id=$1 AND kind='rental' AND published=true FOR UPDATE",
            [request.params.id],
          )
        ).rows[0];
        if (!machine) fail(404, "NOT_FOUND");
        if (!machine.seller_id || machine.data.demo) fail(409, "DEMO_LISTING");
        if (days < machine.data.minDays) fail(400, "RENTAL_MIN_DAYS");
        const conflict = (
          await tx.query(
            "SELECT id FROM service_requests WHERE listing_id=$1 AND status='accepted' AND data->>'startDate'<=$3 AND data->>'endDate'>=$2",
            [machine.id, data.startDate, data.endDate],
          )
        ).rows.length;
        if (conflict) fail(409, "RENTAL_UNAVAILABLE");
        const { idempotencyKey, ...input } = data;
        const details = {
          ...input,
          kind: "rental",
          name: machine.data.name,
          days,
          rate: machine.price,
          estimate: days * machine.price,
          operatorIncluded: machine.data.operatorIncluded,
          deliveryAvailable: machine.data.deliveryAvailable,
        };
        return (
          await tx.query(
            "INSERT INTO service_requests(id,listing_id,buyer_id,seller_id,data,request_key) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
            [
              randomUUID(),
              machine.id,
              request.account.id,
              machine.seller_id,
              JSON.stringify(details),
              idempotencyKey,
            ],
          )
        ).rows[0];
      });
      reply.code(201);
      return {
        request: { id: saved.id, status: saved.status, data: saved.data },
      };
    },
  );
}
