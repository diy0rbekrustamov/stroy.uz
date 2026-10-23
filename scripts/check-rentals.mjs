import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router";
import { createServer } from "vite";

test("Rental catalog supports three languages, combined filters, empty state and inclusive dates", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  const storage = globalThis.localStorage;
  try {
    const { rentalDays } = await server.ssrLoadModule(
      "/src/data/rentalCatalog.js",
    );
    assert.equal(rentalDays("2028-02-28", "2028-03-01"), 3);
    assert.equal(rentalDays("2028-03-01", "2028-02-28"), 0);
    assert.equal(rentalDays("", ""), 0);
    const { default: Page } = await server.ssrLoadModule(
      "/src/pages/RentalsPage.jsx",
    );
    const { default: Detail } = await server.ssrLoadModule(
      "/src/pages/RentalPage.jsx",
    );
    const { default: Language } = await server.ssrLoadModule(
      "/src/i18n/LanguageProvider.jsx",
    );
    const render = (url, lang) => {
      globalThis.localStorage = { getItem: () => lang };
      return renderToStaticMarkup(
        React.createElement(
          Language,
          null,
          React.createElement(
            MemoryRouter,
            { initialEntries: [url] },
            React.createElement(
              Routes,
              null,
              React.createElement(Route, {
                path: "/rentals",
                element: React.createElement(Page),
              }),
              React.createElement(Route, {
                path: "/rentals/:rentalId",
                element: React.createElement(Detail),
              }),
            ),
          ),
        ),
      );
    };
    for (const lang of ["ru", "uz", "en"]) {
      assert.equal(
        (render("/rentals", lang).match(/<article\b/g) || []).length,
        3,
      );
      assert.equal(
        (
          render("/rentals?type=crane&city=Бухара&operator=1", lang).match(
            /<article\b/g,
          ) || []
        ).length,
        1,
      );
      assert.equal(
        (render("/rentals?q=xyz-not-found", lang).match(/<article\b/g) || [])
          .length,
        0,
      );
      const html = render("/rentals/rental-crane", lang);
      assert.match(html, /type="date"/);
      assert.match(html, /type="submit" disabled=""/);
    }
    assert.equal(
      (render("/rentals?q=excavator", "ru").match(/<article\b/g) || []).length,
      1,
    );
    assert.equal(
      (render("/rentals?q=avtokran", "en").match(/<article\b/g) || []).length,
      1,
    );
  } finally {
    globalThis.localStorage = storage;
    await server.close();
  }
});
