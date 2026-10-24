import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router";
import { createServer } from "vite";

test("Product routes render every catalog item in RU/UZ/EN with four distinct recommendations", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  const stored = globalThis.localStorage;
  const h = React.createElement;
  try {
    const ProductPage = (await server.ssrLoadModule("/src/pages/ProductPage.jsx")).default;
    const LanguageProvider = (await server.ssrLoadModule("/src/i18n/LanguageProvider.jsx")).default;
    const { ShopProvider } = await server.ssrLoadModule("/src/context/ShopContext.jsx");
    const { catalogProducts } = await server.ssrLoadModule("/src/data/catalogData.js");
    const render = (id, language) => {
      globalThis.localStorage = { getItem: (key) => key === "stroy-uz-language" ? language : null };
      return renderToStaticMarkup(h(LanguageProvider, null, h(ShopProvider, null, h(MemoryRouter, { initialEntries: [`/product/${id}`] }, h(Routes, null, h(Route, { path: "/product/:productId", element: h(ProductPage) }))))));
    };
    for (const language of ["ru", "uz", "en"]) for (const product of catalogProducts) {
      const html = render(product.id, language);
      assert.match(html, /<h1>/);
      assert.equal((html.match(/role="tab"/g) || []).length, 4);
      assert.equal((html.match(/role="tabpanel"/g) || []).length, 1);
      assert.match(html, /aria-labelledby="product-tab-specs"/);
      const related = html.slice(html.indexOf('class="product-related-section'));
      assert.equal((related.match(/<article\b/g) || []).length, 4);
      assert.ok(!related.includes(`href="/product/${product.id}"`), product.id);
      if (language !== "ru") assert.doesNotMatch(html, /[А-Яа-яЁё]/);
    }
    assert.match(render("missing-product", "en"), /Product not found/);
    assert.doesNotMatch(render("missing-product", "en"), /product-add-button/);
  } finally {
    if (stored === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = stored;
    await server.close();
  }
});
