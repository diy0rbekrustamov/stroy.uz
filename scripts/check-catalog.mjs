import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { createServer } from "vite";
import { readCatalogFilters, filterCatalogProducts, paginateCatalog } from "../src/data/catalogFilters.js";

const products = Array.from({ length: 9 }, (_, index) => ({
  id: String(index), name: index === 0 ? "Кирпич керамический" : "Цемент",
  category: "Стройматериалы", details: "", categoryId: index % 2 ? "tools" : "mixes",
  price: (index + 1) * 10000, brand: index % 2 ? "B" : "A", inStock: index !== 0,
}));
const filters = (query = "") => readCatalogFilters(new URLSearchParams(query));

test("Catalog combines price, category, brand and stock filters without mutating data", () => {
  assert.deepEqual(filterCatalogProducts(products, filters("category=mixes&min=20000&max=80000&brand=A&stock=1&sort=price-desc"), "ru").map((p) => p.id), ["6", "4", "2"]);
  assert.equal(products[0].id, "0");
  assert.equal(filterCatalogProducts(products, filters("q=brick"), "en")[0].id, "0");
  assert.equal(filterCatalogProducts(products, filters("q=g%27isht"), "uz")[0].id, "0");
  assert.equal(filterCatalogProducts(products, filters("q=brick&stock=1"), "en").length, 0);
});

test("URL filters validate prices and pagination never duplicates products", () => {
  assert.equal(filters("min=no&max=-2&sort=wrong&page=-5").min, null);
  assert.equal(filters("min=100&max=20").min, 20);
  assert.equal(filters("min=100&max=20").max, 100);
  const first = paginateCatalog(products, 1);
  const last = paginateCatalog(products, 99);
  assert.equal(first.products.length, 6);
  assert.equal(last.products.length, 3);
  assert.equal(last.page, 2);
  assert.equal(new Set([...first.products, ...last.products].map((p) => p.id)).size, 9);
  assert.deepEqual(paginateCatalog([], 8), { page: 1, pages: 1, products: [] });
});

test("Server-backed catalog renders localized loading and preserves URL filters", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false }, optimizeDeps: { noDiscovery: true, include: [] }, appType: "custom" });
  const stored = globalThis.localStorage;
  try {
    const load = async (path) => (await server.ssrLoadModule(`/src/${path}`)).default;
    const CatalogPage = await load("pages/CatalogPage.jsx");
    const LanguageProvider = await load("i18n/LanguageProvider.jsx");
    const { ShopProvider } = await server.ssrLoadModule("/src/context/ShopContext.jsx");
    const render = (url, language) => {
      globalThis.localStorage = { getItem: (key) => ({ "stroy-uz-language": language, "stroy-uz-favorites": '["cement"]' })[key] ?? null };
      return renderToStaticMarkup(React.createElement(LanguageProvider, null, React.createElement(ShopProvider, null, React.createElement(MemoryRouter, { initialEntries: [url] }, React.createElement(CatalogPage)))));
    };
    for (const language of ["ru", "uz", "en"]) {
      const html = render("/catalog", language);
      assert.equal((html.match(/<article\b/g) || []).length, 0);
      assert.match(html, /role="status"/);
      assert.match(html, /aria-pressed="true"/);
      if (language !== "ru") assert.doesNotMatch(html, /[А-Яа-яЁё]/);
      assert.equal((render("/catalog?page=2", language).match(/<article\b/g) || []).length, 0);
    }
    const selected = render("/catalog?q=insulation&max=150000", "en");
    assert.match(selected, /value="insulation"/);
    assert.match(selected, /value="150000"/);
    assert.equal((selected.match(/<article\b/g) || []).length, 0);
    assert.equal((render("/catalog?max=1", "en").match(/<article\b/g) || []).length, 0);
  } finally {
    if (stored === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = stored;
    await server.close();
  }
});
