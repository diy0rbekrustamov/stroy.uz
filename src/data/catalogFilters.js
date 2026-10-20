import { matchesProduct, translate } from "../i18n/translate.js";

export const CATALOG_PAGE_SIZE = 6;
export const catalogSorts = ["popular", "price-asc", "price-desc", "name"];

export function readCatalogFilters(params) {
  const price = (key) => {
    const value = params.get(key);
    return value !== null &&
      value.trim() !== "" &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0
      ? Number(value)
      : null;
  };
  const minimum = price("min");
  const maximum = price("max");
  return {
    category: params.get("category") || "all",
    search: (params.get("q") || "").trim(),
    min:
      minimum !== null && maximum !== null
        ? Math.min(minimum, maximum)
        : minimum,
    max:
      minimum !== null && maximum !== null
        ? Math.max(minimum, maximum)
        : maximum,
    brand: params.get("brand") || "all",
    stock: params.get("stock") === "1",
    sort: catalogSorts.includes(params.get("sort"))
      ? params.get("sort")
      : "popular",
    page: Math.max(1, Math.floor(Number(params.get("page")) || 1)),
  };
}

export function filterCatalogProducts(products, filters, language) {
  const matching = products.filter(
    (product) =>
      (filters.category === "all" || product.categoryId === filters.category) &&
      (!filters.search || matchesProduct(product, filters.search)) &&
      (filters.min === null || product.price >= filters.min) &&
      (filters.max === null || product.price <= filters.max) &&
      (filters.brand === "all" || product.brand === filters.brand) &&
      (!filters.stock || product.inStock),
  );
  if (filters.sort === "price-asc") matching.sort((a, b) => a.price - b.price);
  if (filters.sort === "price-desc") matching.sort((a, b) => b.price - a.price);
  if (filters.sort === "name")
    matching.sort((a, b) =>
      translate(a.name, language).localeCompare(
        translate(b.name, language),
        language,
      ),
    );
  return matching;
}

export function paginateCatalog(products, requestedPage) {
  const pages = Math.max(1, Math.ceil(products.length / CATALOG_PAGE_SIZE));
  const page = Math.min(
    pages,
    Number.isFinite(requestedPage) ? Math.max(1, Math.floor(requestedPage)) : 1,
  );
  return {
    page,
    pages,
    products: products.slice(
      (page - 1) * CATALOG_PAGE_SIZE,
      page * CATALOG_PAGE_SIZE,
    ),
  };
}
