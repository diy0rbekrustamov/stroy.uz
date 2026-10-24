import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { connectDatabase, migrate } from "../db.js";
import { buildApp } from "../app.js";

test("PostgreSQL API: sessions, permissions, inventory transactions, orders and password reset", async () => {
  const db = await connectDatabase({
    API_EMBEDDED_DB: "1",
    API_DATA_DIR: "memory://",
  });
  await migrate(db);
  let resetUrl;
  const app = await buildApp({
    db,
    env: { APP_ORIGIN: "http://127.0.0.1:5173" },
    sendReset: async (email, url) => {
      resetUrl = url;
    },
  });
  const invoke = async (method, url, payload, auth = {}) => {
    const response = await app.inject({
      method,
      url,
      payload,
      headers: {
        ...(payload ? { "content-type": "application/json" } : {}),
        ...(auth.cookie
          ? { cookie: auth.cookie, "x-csrf-token": auth.csrf }
          : {}),
      },
    });
    return {
      status: response.statusCode,
      body: response.json(),
      headers: response.headers,
    };
  };
  const register = async (role, address) => {
    const response = await invoke("POST", "/api/auth/register", {
      name: "Test",
      email: address,
      password: "test-pass-123",
      phone: "+998901234567",
      role,
      storeName: "Test store",
      consent: true,
    });
    assert.equal(response.status, 201, JSON.stringify(response.body));
    return {
      cookie: response.headers["set-cookie"].split(";")[0],
      csrf: response.body.csrf,
      user: response.body.user,
    };
  };
  try {
    const seller = await register("seller", "seller@example.test");
    const buyer = await register("buyer", "buyer@example.test");
    const other = await register("seller", "other@example.test");
    assert.ok(seller.cookie);
    assert.match(seller.cookie, /stroy_session=/);
    assert.equal(
      (await invoke("GET", "/api/auth/me", null, buyer)).body.user.email,
      "buyer@example.test",
    );
    assert.equal(
      (await invoke("POST", "/api/seller/products", {}, buyer)).status,
      403,
    );
    assert.equal(
      (
        await invoke(
          "POST",
          "/api/auth/logout",
          {},
          { ...buyer, csrf: "wrong" },
        )
      ).status,
      403,
    );
    const item = {
      name: "Drill",
      description: "A test drill",
      category: "Tools",
      categoryId: "tools",
      price: 100,
      stock: 3,
      unit: "pcs",
      city: "Bukhara",
      published: true,
    };
    const product = await invoke("POST", "/api/seller/products", item, seller);
    assert.equal(product.status, 201, JSON.stringify(product.body));
    const id = product.body.item.id;
    assert.equal(
      (
        await invoke(
          "PUT",
          "/api/seller/products/" + id,
          { ...item, price: 1 },
          other,
        )
      ).status,
      404,
    );
    const orderData = {
      idempotencyKey: randomUUID(),
      address: "Test street 1",
      phone: "+998901234567",
      consent: true,
      items: [{ id, quantity: 2 }],
      total: 1,
    };
    const order = await invoke("POST", "/api/orders", orderData, buyer);
    assert.equal(order.status, 201, JSON.stringify(order.body));
    assert.equal(Number(order.body.order.total), 200);
    const duplicate = await invoke("POST", "/api/orders", orderData, buyer);
    assert.equal(duplicate.body.order.id, order.body.order.id);
    assert.equal(
      (await invoke("GET", "/api/products/" + id)).body.item.stock,
      1,
    );
    assert.equal(
      (
        await invoke(
          "POST",
          "/api/orders",
          { ...orderData, idempotencyKey: randomUUID() },
          buyer,
        )
      ).status,
      409,
    );
    assert.equal(
      (await invoke("GET", "/api/products/" + id)).body.item.stock,
      1,
    );
    const sellerOrders = (
      await invoke("GET", "/api/seller/orders", null, seller)
    ).body.items;
    assert.equal(sellerOrders.length, 1);
    assert.equal(
      (await invoke("GET", "/api/seller/orders", null, other)).body.items
        .length,
      0,
    );
    assert.equal(
      (
        await invoke(
          "PATCH",
          "/api/seller/orders/" + sellerOrders[0].id,
          { status: "completed" },
          seller,
        )
      ).status,
      409,
    );
    assert.equal(
      (
        await invoke(
          "PATCH",
          "/api/seller/orders/" + sellerOrders[0].id,
          { status: "cancelled" },
          seller,
        )
      ).status,
      200,
    );
    assert.equal(
      (await invoke("GET", "/api/products/" + id)).body.item.stock,
      3,
    );
    const concurrent = await Promise.all([
      invoke(
        "POST",
        "/api/orders",
        { ...orderData, idempotencyKey: randomUUID() },
        buyer,
      ),
      invoke(
        "POST",
        "/api/orders",
        { ...orderData, idempotencyKey: randomUUID() },
        other,
      ),
    ]);
    assert.deepEqual(
      concurrent.map((result) => result.status).sort(),
      [201, 409],
    );
    assert.equal(
      (await invoke("GET", "/api/products/" + id)).body.item.stock,
      1,
    );
    const service = (
      await invoke(
        "POST",
        "/api/seller/services",
        { ...item, name: "Plaster", unit: "m2" },
        seller,
      )
    ).body.item;
    const request = await invoke(
      "POST",
      "/api/services/" + service.id + "/requests",
      {
        name: "Test",
        phone: "+998901234567",
        address: "Test street",
        quantity: 10,
        task: "Walls in test room",
        consent: true,
      },
      buyer,
    );
    assert.equal(request.status, 201, JSON.stringify(request.body));
    assert.equal(
      (
        await invoke(
          "PATCH",
          "/api/seller/requests/" + request.body.request.id,
          { status: "accepted" },
          other,
        )
      ).status,
      404,
    );
    assert.equal(
      (
        await invoke(
          "PATCH",
          "/api/seller/requests/" + request.body.request.id,
          { status: "accepted" },
          seller,
        )
      ).status,
      200,
    );
    assert.equal(
      (
        await invoke(
          "POST",
          "/api/services/" + service.id + "/requests",
          {
            name: "Test",
            phone: "+998901234567",
            address: "Test",
            quantity: 0,
            task: "Test invalid quantity",
            consent: true,
          },
          buyer,
        )
      ).status,
      400,
    );
    assert.equal(
      (await app.inject({ method: "POST", url: "/api/media", payload: {} }))
        .statusCode,
      401,
    );
    assert.equal(
      (await invoke("GET", "/api/seller/requests", null, seller)).body.items[0]
        .data.estimate,
      1000,
    );
    assert.equal(
      (
        await invoke("POST", "/api/auth/login", {
          email: "buyer@example.test",
          password: "wrong",
        })
      ).status,
      401,
    );
    assert.equal(
      (
        await app.inject({
          method: "POST",
          url: "/api/auth/login",
          payload: { email: "buyer@example.test", password: "test-pass-123" },
          headers: { origin: "https://evil.example" },
        })
      ).statusCode,
      403,
    );
    await invoke("POST", "/api/auth/forgot-password", {
      email: "buyer@example.test",
      consent: true,
    });
    const raw = new URL(resetUrl).searchParams.get("token");
    const reset = await invoke("POST", "/api/auth/reset-password", {
      token: raw,
      password: "new-test-pass-123",
    });
    assert.equal(reset.status, 200);
    assert.equal(
      (await invoke("GET", "/api/auth/me", null, buyer)).body.user,
      null,
    );
    assert.equal(
      (
        await invoke("POST", "/api/auth/reset-password", {
          token: raw,
          password: "another-pass-123",
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await invoke("POST", "/api/auth/login", {
          email: "buyer@example.test",
          password: "new-test-pass-123",
        })
      ).status,
      200,
    );
    assert.equal(
      (await invoke("GET", "/api/seller/products", null, seller)).body.items
        .length,
      1,
    );
    assert.equal(
      (await invoke("POST", "/api/auth/logout", {}, seller)).status,
      200,
    );
    assert.equal(
      (await invoke("GET", "/api/seller/products", null, seller)).status,
      401,
    );
    const hashes = await db.query("SELECT password_hash FROM users");
    assert.ok(
      hashes.rows.every(
        (user) =>
          user.password_hash.startsWith("scrypt:") &&
          !user.password_hash.includes("test-pass"),
      ),
    );
  } finally {
    await app.close();
    await db.close();
  }
});
