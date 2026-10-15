import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { parseSync } from "rolldown/utils";
import { normalizeSearch, translate } from "../src/i18n/translate.js";
import { uz } from "../src/i18n/uz.js";

test("Russian source and non-text values remain unchanged", () => {
  assert.equal(translate("Корзина (2)", "ru"), "Корзина (2)");
  assert.equal(translate(2, "uz"), 2);
  assert.equal(translate(null, "uz"), null);
  const items = [{ id: "cement" }];
  assert.equal(translate(items, "uz"), items);
});

test("Uzbek translations handle interpolated counts, names and whitespace", () => {
  assert.equal(translate("Корзина (2)", "uz"), "Savat (2)");
  assert.equal(translate("  В корзину  ", "uz"), "  Savatga  ");
  assert.equal(
    translate("Добавить в избранное: Цемент М400 · 50 кг", "uz"),
    "Sevimlilarga qo‘shish: Sement M400 · 50 kg",
  );
  assert.equal(
    translate("Цемент М400 · 50 кг добавлен в корзину", "uz"),
    "Sement M400 · 50 kg savatga qo‘shildi",
  );
  assert.match(translate("Кирпич керамический", "uz").toLowerCase(), /g‘isht/);
  assert.ok(
    normalizeSearch(translate("Кирпич керамический", "uz")).includes(
      normalizeSearch("G'ISHT"),
    ),
  );
});

test("Every dictionary entry is nonempty and translates exactly", () => {
  for (const [source, target] of Object.entries(uz)) {
    assert.ok(source.trim() && target.trim(), source);
    // A phrase containing spaces at its edge is used only in composed sentences.
    if (source === source.trim())
      assert.equal(translate(source, "uz"), target, source);
  }
});

test("Current interface and demo labels have Uzbek coverage", () => {
  const uncovered = new Set();
  function visit(node) {
    if (!node || typeof node !== "object") return;
    if (
      ["Literal", "JSXText"].includes(node.type) &&
      typeof node.value === "string" &&
      /[А-Яа-яЁё]/.test(node.value)
    ) {
      const source = node.value.replace(/\s+/g, " ").trim();
      // Language selector names are intentionally written in their own language.
      if (
        !["Русский", "Язык интерфейса"].includes(source) &&
        /[А-Яа-яЁё]/.test(translate(source, "uz"))
      )
        uncovered.add(source);
    }
    for (const value of Object.values(node))
      if (value && typeof value === "object")
        (Array.isArray(value) ? value : [value]).forEach(visit);
  }
  for (const file of fs
    .readdirSync("src", { recursive: true })
    .filter((file) => /\.(jsx|js)$/.test(file) && !file.startsWith("i18n"))) {
    visit(parseSync(file, fs.readFileSync(`src/${file}`, "utf8")).program);
  }
  assert.deepEqual([...uncovered], []);
});
