import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { parseSync } from "rolldown/utils";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router";

test("Tracked source files have no conflict markers and parse successfully", () => {
  for (const file of execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" }).split("\0").filter(Boolean)) {
    if (!/\.(jsx?|css|json|md|html)$/.test(file)) continue;
    const source = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(source, /^(?:<{7}|={7}|>{7})(?:\s|$)/m, file);
    if (/\.jsx?$/.test(file)) assert.deepEqual(parseSync(file, source).errors, [], file);
  }
});

test("One router and App retain all routes with correct nesting", () => {
  const { program } = parseSync("App.jsx", fs.readFileSync("src/App.jsx", "utf8"));
  const routers = [];
  const apps = [];
  let shopWrapsRouter = false;
  function visit(node) {
    if (!node || typeof node !== "object") return;
    if (node.type === "CallExpression" && node.callee.name === "createBrowserRouter") routers.push(node);
    if (node.type === "FunctionDeclaration" && node.id.name === "App") apps.push(node);
    if (node.type === "JSXElement" && node.openingElement.name.name === "ShopProvider") shopWrapsRouter = node.children.some((child) => child.type === "JSXElement" && child.openingElement.name.name === "RouterProvider");
    for (const value of Object.values(node)) if (value && typeof value === "object") (Array.isArray(value) ? value : [value]).forEach(visit);
  }
  visit(program);
  assert.equal(routers.length, 1);
  assert.equal(apps.length, 1);
  assert.ok(shopWrapsRouter);
  const prop = (node, name) => node.properties.find((p) => p.key.name === name)?.value;
  const root = routers[0].arguments[0].elements[0];
  assert.equal(prop(root, "path").value, "/");
  assert.equal(prop(root, "element").openingElement.name.name, "Layout");
  const children = prop(root, "children").elements;
  const paths = children.map((route) => prop(route, "path")?.value).filter(Boolean);
  assert.equal(paths.length, new Set(paths).size);
  assert.deepEqual(paths.sort(), ["catalog", "categories", "favorites", "product", "product/:productId", "cart", "register", "login", "reset-password", "seller"].sort());
  assert.equal(prop(children.find((r) => prop(r, "index")?.value), "element").openingElement.name.name, "HomePage");
  const seller = children.find((r) => prop(r, "path")?.value === "seller");
  assert.equal(prop(seller, "element").openingElement.name.name, "LayoutSeller");
  const sellerRoutes = prop(seller, "children").elements;
  assert.deepEqual(sellerRoutes.map((r) => prop(r, "path")?.value).filter(Boolean).sort(), ["add-product", "orders", "services"]);
  assert.equal(prop(sellerRoutes.find((r) => prop(r, "path")?.value === "orders"), "element").openingElement.name.name, "OrdersPage");
});

test("Layout renders all team screens and every catalog product with shared cart", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  const previousStorage = globalThis.localStorage;
  const h = React.createElement;
  try {
    const load = async (file) => (await server.ssrLoadModule(`/src/${file}`)).default;
    const Layout = await load("components/layout/Layout.jsx");
    const { ShopProvider } = await server.ssrLoadModule("/src/context/ShopContext.jsx");
    const { catalogProducts } = await server.ssrLoadModule("/src/data/catalogData.js");
    const pages = Object.fromEntries(await Promise.all(["HomePage", "CatalogPage", "CategoriesPage", "FavoritesPage", "ProductPage", "CartPage", "LoginPage", "RegisterPage", "ResetPasswordPage"].map(async (name) => [name, await load(`pages/${name}.jsx`)])));
    const seller = await load("components/seller/Layout.jsx");
    const sellers = await Promise.all(["product/ProductsPage", "product/AddProductPage", "service/ServicesPage", "order/OrdersPage"].map((p) => load(`pages/Seller/${p}.jsx`)));
    const extra = catalogProducts.find((p) => !["drill", "cement", "bricks", "paint"].includes(p.id));
    assert.ok(extra);
    globalThis.localStorage = { getItem: (key) => key === "stroy-uz-cart" ? JSON.stringify({ [extra.id]: 2 }) : key === "stroy-uz-favorites" ? JSON.stringify([extra.id]) : null };
    const pageRoutes = [["catalog", "CatalogPage"], ["categories", "CategoriesPage"], ["favorites", "FavoritesPage"], ["product", "ProductPage"], ["product/:productId", "ProductPage"], ["cart", "CartPage"], ["login", "LoginPage"], ["register", "RegisterPage"], ["reset-password", "ResetPasswordPage"]].map(([path, name]) => h(Route, { key: path, path, element: h(pages[name]) }));
    const sellerRoute = h(Route, { path: "seller", element: h(seller) },
      h(Route, { index: true, element: h(sellers[0]) }),
      ...["add-product", "services", "orders"].map((path, i) => h(Route, { key: path, path, element: h(sellers[i + 1]) })));
    const tree = h(Routes, null, h(Route, { path: "/", element: h(Layout) },
      h(Route, { index: true, element: h(pages.HomePage) }), ...pageRoutes, sellerRoute));
    const render = (url) => renderToStaticMarkup(h(ShopProvider, null, h(MemoryRouter, { initialEntries: [url] }, tree)));
    for (const url of ["/", "/catalog?q=цемент", "/categories", "/favorites", "/cart", "/login", "/register", "/reset-password", "/seller", "/seller/add-product", "/seller/services", "/seller/orders", "/product", ...catalogProducts.map((p) => `/product/${p.id}`)]) {
      const html = render(url);
      assert.match(html, /<header/);
      assert.match(html, /<main/);
      assert.match(html, /<footer/);
      if (url === "/cart" || url === "/favorites") assert.ok(html.includes(extra.name), `${url}: extra catalog product missing`);
    }
  } finally {
    if (previousStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previousStorage;
    await server.close();
  }
});
