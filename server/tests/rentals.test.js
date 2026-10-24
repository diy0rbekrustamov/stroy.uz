import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { connectDatabase, migrate } from "../db.js";
import { buildApp } from "../app.js";

test("Rental inquiries validate dates, retain ownership, prevent duplicates and conflicting confirmations", async () => {
  const db = await connectDatabase({
    API_EMBEDDED_DB: "1",
    API_DATA_DIR: "memory://",
  });
  await migrate(db);
  await migrate(db); // Existing databases can safely apply startup migrations again.
  const app = await buildApp({ db });
  const call = async (method, url, body, auth = {}) => {
    const result = await app.inject({
      method,
      url,
      payload: body,
      headers: {
        ...(body ? { "content-type": "application/json" } : {}),
        ...(auth.cookie
          ? { cookie: auth.cookie, "x-csrf-token": auth.csrf }
          : {}),
      },
    });
    return {
      status: result.statusCode,
      data: result.json(),
      headers: result.headers,
    };
  };
  const register = async (role) => {
    const result = await call("POST", "/api/auth/register", {
      name: "Rental Test",
      email: randomUUID() + "@example.test",
      password: "test-pass-123",
      phone: "+998901234567",
      role,
      storeName: "Fleet",
      consent: true,
    });
    assert.equal(result.status, 201);
    return {
      cookie: result.headers["set-cookie"].split(";")[0],
      csrf: result.data.csrf,
    };
  };
  try {
    const seller = await register("seller"),
      stranger = await register("seller"),
      buyer = await register("buyer");
    const input = {
      name: "Test crane",
      category: "Crane",
      equipmentType: "crane",
      capacity: "25 t",
      unit: "сутки",
      city: "Bukhara",
      price: 100,
      minDays: 2,
      operatorIncluded: true,
      deliveryAvailable: true,
      published: true,
    };
    assert.equal(
      (await call("POST", "/api/seller/rentals", input, buyer)).status,
      403,
    );
    const created = await call("POST", "/api/seller/rentals", input, seller);
    assert.equal(created.status, 201);
    const id = created.data.item.id;
    assert.equal((await call("GET", "/api/rentals")).data.items.length, 1);
    assert.equal(
      (await call("PUT", "/api/seller/rentals/" + id, input, stranger)).status,
      404,
    );
    const date = (days) =>
      new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
    const request = {
      idempotencyKey: randomUUID(),
      name: "Test",
      phone: "+998901234567",
      address: "Test site",
      startDate: date(10),
      endDate: date(12),
      task: "Lift construction materials",
      consent: true,
    };
    const endpoint = "/api/rentals/" + id + "/requests";
    assert.equal((await call("POST", endpoint, request)).status, 401);
    assert.equal(
      (await call("POST", endpoint, { ...request, endDate: date(9) }, buyer))
        .status,
      400,
    );
    assert.equal(
      (await call("POST", endpoint, { ...request, endDate: date(10) }, buyer))
        .status,
      400,
    );
    const first = await call("POST", endpoint, request, buyer);
    assert.equal(first.status, 201);
    assert.equal(first.data.request.data.estimate, 300);
    assert.equal(
      (await call("POST", endpoint, request, buyer)).data.request.id,
      first.data.request.id,
    );
    const second = await call(
      "POST",
      endpoint,
      { ...request, idempotencyKey: randomUUID() },
      buyer,
    );
    assert.equal(second.status, 201);
    const statusPath = "/api/seller/requests/";
    assert.equal(
      (
        await call(
          "PATCH",
          statusPath + first.data.request.id,
          { status: "accepted" },
          stranger,
        )
      ).status,
      404,
    );
    assert.equal(
      (
        await call(
          "PATCH",
          statusPath + first.data.request.id,
          { status: "accepted" },
          seller,
        )
      ).status,
      200,
    );
    assert.equal(
      (
        await call(
          "PATCH",
          statusPath + second.data.request.id,
          { status: "accepted" },
          seller,
        )
      ).status,
      409,
    );
    assert.equal(
      (
        await call(
          "POST",
          endpoint,
          { ...request, idempotencyKey: randomUUID() },
          buyer,
        )
      ).status,
      409,
    );
    assert.equal(
      (await call("GET", "/api/requests", undefined, buyer)).data.items.length,
      2,
    );
    await call(
      "PATCH",
      statusPath + first.data.request.id,
      { status: "cancelled" },
      seller,
    );
    assert.equal(
      (
        await call(
          "PATCH",
          statusPath + second.data.request.id,
          { status: "accepted" },
          seller,
        )
      ).status,
      200,
    );
    await db.query("UPDATE listings SET seller_id=NULL WHERE id=$1", [id]);
    assert.equal(
      (
        await call(
          "POST",
          endpoint,
          {
            ...request,
            idempotencyKey: randomUUID(),
            startDate: date(20),
            endDate: date(21),
          },
          buyer,
        )
      ).data.error,
      "DEMO_LISTING",
    );
  } finally {
    await app.close();
    await db.close();
  }
});
