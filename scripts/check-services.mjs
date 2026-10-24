import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { Routes, Route } from "react-router";
import { createServer } from "vite";

test("Public services combine filters, multilingual search and pagination", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  const stored = globalThis.localStorage;
  try {
    const { serviceCatalog, filterServices } = await server.ssrLoadModule(
      "/src/data/serviceCatalog.js",
    );
    const filter = (query) =>
      filterServices(serviceCatalog, new URLSearchParams(query));
    assert.equal(filter("q=plaster")[0].id, "plaster");
    assert.equal(filter("q=suvoq")[0].id, "plaster");
    assert.deepEqual(
      filter("city=Бухара&min=40000&max=80000&available=1&sort=price-desc").map(
        (item) => item.id,
      ),
      ["tile", "wiring", "plaster", "floor"],
    );
    assert.equal(filter("q=does-not-exist").length, 0);
    assert.equal(serviceCatalog[0].id, "plaster");
    const { default: Page } = await server.ssrLoadModule(
      "/src/pages/ServicesPage.jsx",
    );
    const { default: LanguageProvider } = await server.ssrLoadModule(
      "/src/i18n/LanguageProvider.jsx",
    );
    const {default: ServicePage} = await server.ssrLoadModule("/src/pages/ServicePage.jsx");
    const render = (url, language) => {
      globalThis.localStorage = { getItem: () => language };
      return renderToStaticMarkup(
        React.createElement(
          LanguageProvider,
          null,
          React.createElement(
            MemoryRouter,
            { initialEntries: [url] },
            React.createElement(Routes,null,
              React.createElement(Route,{path:"/services",element:React.createElement(Page)}),
              React.createElement(Route,{path:"/services/:serviceId",element:React.createElement(ServicePage)})),
          ),
        ),
      );
    };
    for (const language of ["ru", "uz", "en"]) {
      const html = render("/services", language);
      assert.equal((html.match(/<article\b/g) || []).length, 6);
      assert.equal(
        (render("/services?page=2", language).match(/<article\b/g) || [])
          .length,
        3,
      );
      assert.equal(
        (render("/services?q=plaster", language).match(/<article\b/g) || [])
          .length,
        1,
      );
      assert.match(html, /aria-controls="service-filters"/);
      const detail = render("/services/plaster",language);
      assert.match(detail,/name="quantity"/);
      assert.match(detail,/name="phone"/);
      assert.match(detail,/1[\s,]*800[\s,]*000/);
      assert.match(render("/services/unknown",language),/href="\/services"/);
      if (language !== "ru")
        assert.doesNotMatch(html.replace(/<[^>]*>/g, ""), /[А-Яа-яЁё]/);
      if (language !== "ru") assert.doesNotMatch(detail.replace(/<[^>]*>/g,""),/[А-Яа-яЁё]/);
    }
  } finally {
    if (stored === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = stored;
    await server.close();
  }
});
