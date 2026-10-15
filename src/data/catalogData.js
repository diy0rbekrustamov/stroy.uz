import { products as homepageProducts } from "../components/home/homeData.js";
import rebar from "../assets/catalog/rebar.svg";
import tile from "../assets/catalog/tile.svg";
import pipe from "../assets/catalog/pipe.svg";
import plaster from "../assets/catalog/plaster.svg";
import insulation from "../assets/catalog/insulation.svg";

/** Shared catalog taxonomy. Keep ids stable: they are part of the URL. */
export const catalogCategories = [
  { id: "mixes", name: "Цемент и сухие смеси", description: "Цемент, штукатурка и смеси для строительства", image: homepageProducts[0].image },
  { id: "bricks", name: "Кирпичи и блоки", description: "Всё для прочных стен и перегородок", image: homepageProducts[1].image },
  { id: "metal", name: "Металл и арматура", description: "Арматура и металлический прокат", image: rebar },
  { id: "tools", name: "Инструменты", description: "Электроинструменты для любой задачи", image: homepageProducts[2].image },
  { id: "finishing", name: "Краски и отделка", description: "Краски, покрытия и материалы для ремонта", image: homepageProducts[3].image },
  { id: "plumbing", name: "Сантехника и электрика", description: "Инженерные системы и комплектующие", image: pipe },
];

const categoryByProduct = {
  cement: "mixes",
  bricks: "bricks",
  drill: "tools",
  paint: "finishing",
};
const oldPriceByProduct = {
  cement: 68000,
  bricks: 3200,
  drill: 1050000,
};
export const catalogProducts = [
  ...homepageProducts.map((product) => ({
    ...product,
    categoryId: categoryByProduct[product.id],
    oldPrice: oldPriceByProduct[product.id] || null,
    brand: product.id === "paint" ? "INTERIOR" : product.id === "drill" ? "STROY UZ" : "STROY",
    inStock: true,
    ...(product.id === "bricks" ? { badge: "БЕСТСЕЛЛЕР" } : {}),
  })),
  { id: "rebar", name: "Арматура стальная · 12 мм", category: "Металл и арматура", categoryId: "metal", details: "Диаметр 12 мм · 6 м", price: 38500, unit: "шт.", badge: "ПОПУЛЯРНОЕ", brand: "STROY", image: rebar, inStock: true },
  { id: "tile", name: "Плитка керамическая", category: "Отделочные материалы", categoryId: "finishing", details: "Серая · 60 × 60 см", price: 98000, unit: "м²", badge: "", brand: "STROY", image: tile, inStock: true },
  { id: "pipe", name: "Труба ПВХ · 50 мм", category: "Сантехника", categoryId: "plumbing", details: "Для внутренней канализации", price: 27000, unit: "шт.", badge: "", brand: "STROY", image: pipe, inStock: true },
  { id: "plaster", name: "Штукатурка гипсовая · 30 кг", category: "Сухие смеси", categoryId: "mixes", details: "Для внутренних работ", price: 52000, unit: "мешок", badge: "", brand: "STROY", image: plaster, inStock: true },
  { id: "insulation", name: "Утеплитель · 50 мм", category: "Отделочные материалы", categoryId: "finishing", details: "Теплоизоляционные плиты", price: 118000, unit: "упак.", badge: "", brand: "STROY", image: insulation, inStock: true },
];

export const catalogCategoryPath = (id) => `/catalog?category=${encodeURIComponent(id)}`;
