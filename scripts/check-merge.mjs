import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parseSync } from "rolldown/utils";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router";

test("Merged sources parse and contain no conflict markers", () => {
  for (const file of fs
    .readdirSync("src", { recursive: true })
    .filter((file) => /\.(jsx|js)$/.test(file))) {
    const source = fs.readFileSync(`src/${file}`, "utf8");
    assert.doesNotMatch(source, /^(?:<{7}|={7}|>{7})/m, file);
    assert.equal(parseSync(file, source).errors.length, 0, file);
  }
});

test("Routes retain cart, products, auth and seller pages without duplicate paths", () => {
  const { program } = parseSync(
    "App.jsx",
    fs.readFileSync("src/App.jsx", "utf8"),
  );
  const paths = [];
  function visit(node) {
    if (!node || typeof node !== "object") return;
    if (node.type === "Property" && node.key.name === "path")
      paths.push(node.value.value);
    for (const value of Object.values(node))
      if (value && typeof value === "object")
        (Array.isArray(value) ? value : [value]).forEach(visit);
  }
  visit(program);
  assert.equal(paths.length, new Set(paths).size);
  for (const route of [
    "/",
    "cart",
    "product",
    "product/:productId",
    "login",
    "register",
    "reset-password",
    "seller",
    "add-product",
    "services",
    "orders",
  ])
    assert.ok(paths.includes(route), route);
});

test("Shared layout renders team pages with one shop context and RU/UZ", async () => {
  const server = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });
  const stored = globalThis.localStorage;
  const h = React.createElement;
  try {
    const load = async (file) =>
      (await server.ssrLoadModule(`/src/${file}`)).default;
    const LanguageProvider = await load("i18n/LanguageProvider.jsx");
    const { ShopProvider } = await server.ssrLoadModule(
      "/src/context/ShopContext.jsx",
    );
    const Layout = await load("components/layout/Layout.jsx");
    const pageNames = [
      "HomePage",
      "CartPage",
      "ProductPage",
      "LoginPage",
      "RegisterPage",
      "ResetPasswordPage",
    ];
    const pageComponents = Object.fromEntries(
      await Promise.all(
        pageNames.map(async (name) => [name, await load(`pages/${name}.jsx`)]),
      ),
    );
    const sellerLayout = await load("components/seller/Layout.jsx");
    const sellerProducts = await load("pages/Seller/product/ProductsPage.jsx");
    const sellerAdd = await load("pages/Seller/product/AddProductPage.jsx");
    const sellerServices = await load("pages/Seller/service/ServicesPage.jsx");
    const sellerOrders = await load("pages/Seller/order/OrdersPage.jsx");
    function render(url, language, cart = { drill: 2 }) {
      const values = {
        "stroy-uz-language": language,
        "stroy-uz-cart": JSON.stringify(cart),
        "stroy-uz-favorites": '["drill"]',
      };
      globalThis.localStorage = { getItem: (key) => values[key] ?? null };
      return renderToStaticMarkup(
        h(
          LanguageProvider,
          null,
          h(
            ShopProvider,
            null,
            h(
              MemoryRouter,
              { initialEntries: [url] },
              h(
                Routes,
                null,
                h(
                  Route,
                  { path: "/", element: h(Layout) },
                  h(Route, {
                    index: true,
                    element: h(pageComponents.HomePage),
                  }),
                  ...[
                    ["cart", "CartPage"],
                    ["product/:productId", "ProductPage"],
                    ["login", "LoginPage"],
                    ["register", "RegisterPage"],
                    ["reset-password", "ResetPasswordPage"],
                  ].map(([path, name]) =>
                    h(Route, {
                      key: path,
                      path,
                      element: h(pageComponents[name]),
                    }),
                  ),
                  h(
                    Route,
                    { path: "seller", element: h(sellerLayout) },
                    h(Route, { index: true, element: h(sellerProducts) }),
                    h(Route, { path: "add-product", element: h(sellerAdd) }),
                    h(Route, { path: "services", element: h(sellerServices) }),
                    h(Route, { path: "orders", element: h(sellerOrders) }),
                  ),
                ),
              ),
            ),
          ),
        ),
      );
    }
    for (const language of ["ru", "uz"]) {
      const cart = render("/cart", language);
      assert.match(cart, /1\s*780\s*000/);
      assert.match(
        cart,
        language === "ru" ? /Состав заказа/ : /Buyurtma hisoboti/,
      );
      assert.match(
        cart,
        language === "ru" ? /Дрель-шуруповёрт/ : /Drel-shurupburagich/,
      );
      assert.match(
        render("/cart", language, {}),
        language === "ru" ? /Корзина пуста/ : /Savatcham bo‘sh/,
      );
      for (const url of [
        "/",
        "/product/drill",
        "/product/cement",
        "/login",
        "/register",
        "/reset-password",
        "/seller",
        "/seller/add-product",
        "/seller/services",
        "/seller/orders",
      ]) {
        const html = render(url, language);
        assert.match(html, /<main/);
        assert.match(html, /<header/);
        assert.match(html, /<footer/);
        // Existing seller screens own an inner main; preserve those team layouts here.
        if (!url.startsWith("/seller"))
          assert.equal((html.match(/<main\b/g) || []).length, 1, url);
        assert.match(html, language === "ru" ? /Русский/ : /O‘zbekcha/);
      }
    }
    const results = render("/?q=g%27isht#products", "uz");
    assert.match(results, /Keramik g‘isht/);
    assert.doesNotMatch(results, /<article[^>]*>[\s\S]*Drel-shurupburagich/);
  } finally {
    if (stored === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = stored;
    await server.close();
  }
});
