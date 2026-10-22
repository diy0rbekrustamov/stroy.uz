import test from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { createServer } from "vite";
import {
  validateAuthForm,
  validateRegistration,
} from "../src/data/authValidation.js";

test("Registration validates role-specific fields and password confirmation", () => {
  const form = {
    name: "Test",
    storeName: "",
    phone: "+998 90 123 45 67",
    email: "test@example.com",
    password: "sample123",
    confirmPassword: "sample123",
    consent: true,
  };
  assert.deepEqual(validateRegistration(form, "buyer"), {});
  assert.ok(validateRegistration(form, "seller").storeName);
  assert.deepEqual(
    validateRegistration({ ...form, storeName: "Test store" }, "seller"),
    {},
  );
  assert.ok(
    validateRegistration({ ...form, password: "12345678" }, "buyer").password,
  );
  assert.ok(
    validateRegistration({ ...form, confirmPassword: "different" }, "buyer")
      .confirmPassword,
  );
  assert.ok(
    validateRegistration({ ...form, phone: "+998 90 123" }, "buyer").phone,
  );
  assert.ok(validateRegistration({ ...form, consent: false }, "buyer").consent);
  assert.ok(validateRegistration({ ...form, name: "   " }, "buyer").name);
});

test("Auth validation rejects empty fields, malformed email and missing consent", () => {
  assert.deepEqual(
    Object.keys(validateAuthForm({ email: "", password: "", consent: false })),
    ["email", "password", "consent"],
  );
  assert.ok(
    validateAuthForm({ email: "broken@", password: "valid", consent: true })
      .email,
  );
  assert.deepEqual(
    validateAuthForm({
      email: "  user@example.com  ",
      password: "existing-password",
      consent: true,
    }),
    {},
  );
  assert.deepEqual(
    validateAuthForm({ email: "user@example.com", consent: true }, "reset"),
    {},
  );
  assert.ok(
    validateAuthForm({ email: "user@example.com", consent: false }, "reset")
      .consent,
  );
});

test("Login and recovery render accessible localized forms without false success", async () => {
  const server = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  const stored = globalThis.localStorage;
  try {
    const load = async (path) =>
      (await server.ssrLoadModule(`/src/${path}`)).default;
    const LanguageProvider = await load("i18n/LanguageProvider.jsx");
    const login = await load("pages/LoginPage.jsx"),
      reset = await load("pages/ResetPasswordPage.jsx");
    const register = await load("pages/RegisterPage.jsx");
    for (const language of ["ru", "uz", "en"])
      for (const page of [login, reset, register]) {
        globalThis.localStorage = { getItem: () => language };
        const html = renderToStaticMarkup(
          React.createElement(
            LanguageProvider,
            null,
            React.createElement(MemoryRouter, null, React.createElement(page)),
          ),
        );
        assert.equal((html.match(/<h1\b/g) || []).length, 1);
        assert.match(html, /type="email"/);
        assert.match(html, /name="email"/);
        assert.match(html, /role="status"/);
        assert.match(html, /required=""/);
        assert.doesNotMatch(
          html,
          /Ссылка отправлена|Link sent|min-h-\[700px\]/,
        );
        if (language !== "ru") assert.doesNotMatch(html, /[А-Яа-яЁё]/);
        if (page === login)
          assert.match(html, /autoComplete="current-password"/);
        if (page === register) {
          assert.match(html, /name="storeName"/);
          assert.match(html, /type="tel"/);
          assert.match(html, /name="confirmPassword"/);
          assert.match(html, /autoComplete="new-password"/);
        }
      }
  } finally {
    if (stored === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = stored;
    await server.close();
  }
});
