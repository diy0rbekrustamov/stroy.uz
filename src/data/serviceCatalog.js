import renovation from "../assets/home/project-renovate.png";
import building from "../assets/home/project-build.png";
import tools from "../assets/home/project-tools.png";
import cement from "../assets/home/journal-cement.png";
import bricks from "../assets/home/journal-bricks.png";
import { matchesProduct } from "../i18n/translate.js";

export const serviceCategories = [
  "Все услуги",
  "Отделочные работы",
  "Строительные работы",
  "Монтаж и ремонт",
];
export const serviceCatalog = [
  {
    id: "plaster",
    name: "Штукатурка стен под маяк",
    category: "Отделочные работы",
    price: 45000,
    city: "Бухара",
    unit: "м²",
    available: true,
    image: renovation,
  },
  {
    id: "tile",
    name: "Укладка керамической плитки",
    category: "Отделочные работы",
    price: 80000,
    city: "Бухара",
    unit: "м²",
    available: true,
    image: renovation,
  },
  {
    id: "paint",
    name: "Покраска стен и потолков",
    category: "Отделочные работы",
    price: 25000,
    city: "Ташкент",
    unit: "м²",
    available: false,
    image: renovation,
  },
  {
    id: "foundation",
    name: "Заливка фундамента",
    category: "Строительные работы",
    price: 350000,
    city: "Бухара",
    unit: "м³",
    available: true,
    image: cement,
  },
  {
    id: "masonry",
    name: "Кладка кирпича",
    category: "Строительные работы",
    price: 120000,
    city: "Ташкент",
    unit: "м²",
    available: true,
    image: bricks,
  },
  {
    id: "wiring",
    name: "Монтаж электропроводки",
    category: "Монтаж и ремонт",
    price: 60000,
    city: "Бухара",
    unit: "точка",
    available: true,
    image: tools,
  },
  {
    id: "plumbing",
    name: "Установка сантехники",
    category: "Монтаж и ремонт",
    price: 150000,
    city: "Самарканд",
    unit: "шт.",
    available: true,
    image: tools,
  },
  {
    id: "roof",
    name: "Монтаж кровли",
    category: "Строительные работы",
    price: 95000,
    city: "Самарканд",
    unit: "м²",
    available: false,
    image: building,
  },
  {
    id: "floor",
    name: "Укладка напольного покрытия",
    category: "Отделочные работы",
    price: 40000,
    city: "Бухара",
    unit: "м²",
    available: true,
    image: renovation,
  },
];

export function filterServices(items, params) {
  const min = Number(params.get("min")) || 0;
  const rawMax = params.get("max");
  const max =
    rawMax === null || rawMax === "" || !Number.isFinite(Number(rawMax))
      ? Infinity
      : Number(rawMax);
  const category = params.get("category");
  const city = params.get("city");
  const result = items.filter(
    (item) =>
      (!category || category === "Все услуги" || item.category === category) &&
      (!city || item.city === city) &&
      (!params.get("available") || item.available) &&
      item.price >= min &&
      item.price <= max &&
      matchesProduct({ ...item, details: item.city }, params.get("q") || ""),
  );
  if (params.get("sort") === "price-asc")
    result.sort((a, b) => a.price - b.price);
  if (params.get("sort") === "price-desc")
    result.sort((a, b) => b.price - a.price);
  return result;
}
