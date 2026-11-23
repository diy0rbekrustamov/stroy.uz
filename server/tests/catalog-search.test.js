import test from "node:test";
import assert from "node:assert/strict";
import { connectDatabase, migrate } from "../db.js";
import { buildApp } from "../app.js";

const demo = [
  { id: "mix1", name: "Цемент M400", categoryId: "mixes", category: "Сухие смеси", brand: "STROY", price: 62000, stock: 10 },
  { id: "mix2", name: "Гипсовая смесь", categoryId: "mixes", category: "Сухие смеси", brand: "STROY", price: 52000, stock: 0 },
  { id: "tool1", name: "Дрель 18V", categoryId: "tools", category: "Электроинструменты", brand: "MAK", price: 890000, stock: 1 },
  { id: "tool2", name: "Шуруповёрт 12V", categoryId: "tools", category: "Электроинструменты", brand: "MAK", price: 450000, stock: 2 },
];

test("API catalog: server filters, totals, sorting, URL parameters and facets", async () => {
  const db = await connectDatabase({ API_EMBEDDED_DB: "1", API_DATA_DIR: "memory://" });
  await migrate(db);
  const app = await buildApp({ db, env: { APP_ORIGIN: "http://127.0.0.1:5173" } });
  try {
    const sellerId = "10000000-0000-4000-8000-000000000001";
    await db.query("INSERT INTO users(id,email,name,password_hash,role,store_name) VALUES($1,'catalog@example.test','Catalog seller','test-only','seller','Catalog store')",[sellerId]);
    for (const item of demo) {
      await db.query(
        "INSERT INTO listings(id,kind,data,price,stock,published,seller_id) VALUES($1,'product',$2,$3,$4,true,$5)",
        [item.id, JSON.stringify({ name: item.name, categoryId: item.categoryId, category: item.category, brand: item.brand }), item.price, item.stock, sellerId],
      );
    }
    const get = async (query) => {
      const result = await app.inject({ method: "GET", url: query });
      assert.equal(result.statusCode, 200, result.body);
      return result.json();
    };
    const first = await get("/api/products?category=mixes&sort=price-asc&limit=1&page=1");
    assert.equal(first.total, 2);
    assert.equal(first.pages, 2);
    assert.equal(first.items[0].id, "mix2");
    const second = await get("/api/products?category=mixes&sort=price-asc&limit=1&page=2");
    assert.equal(second.items[0].id, "mix1");
    const available = await get("/api/products?category=mixes&stock=1");
    assert.deepEqual(available.items.map((item) => item.id), ["mix1"]);
    const priced = await get("/api/products?min=100000&max=500000&sort=price-desc");
    assert.deepEqual(priced.items.map((item) => item.id), ["tool2"]);
    const search = await get("/api/products?q=%D0%94%D1%80%D0%B5%D0%BB%D1%8C&brand=MAK");
    assert.equal(search.total, 1);
    const facets = await get("/api/catalog/facets");
    assert.equal(facets.categories.mixes, 2);
    assert.deepEqual(facets.brands, ["MAK", "STROY"]);
    assert.equal(facets.maxPrice, 890000);
    // Compatibility with other parts of the app that consume offset pages.
    const legacy = await get("/api/products?limit=1&offset=1");
    assert.equal(legacy.items.length, 1);
    const invalid = await app.inject({ method: "GET", url: "/api/products?min=-1" });
    assert.equal(invalid.statusCode, 400);
  } finally {
    await app.close();
    await db.close();
  }
});
