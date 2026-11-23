import { demoItems } from "../data/demoCatalog.js";
import { DemoNotice } from "../components/ui/ListingState.jsx";
import { CatalogNotice } from "../components/ui/PageState.jsx";
import ProductCard from "../components/ui/ProductCard.jsx";
import { useProductCatalog, useProductFacets } from "../api/useCatalog.js";
import Button from "../components/ui/Button.jsx";
import {
  CATALOG_PAGE_SIZES,
  readCatalogFilters,
  filterCatalogProducts,
  paginateCatalog,
} from "../data/catalogFilters.js";
import { productCount } from "../i18n/translate.js";
import { useLanguage } from "../i18n/useLanguage.js";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import Icon from "../components/home/Icon.jsx";
import { catalogCategories } from "../data/catalogData.js";
import { useShop } from "../context/ShopContext.jsx";
import "./CatalogPage.css";

const catalogProducts = demoItems("products");

const sortOptions = [
  ["popular", "Популярное"],
  ["price-asc", "Сначала дешевле"],
  ["price-desc", "Сначала дороже"],
  ["name", "По названию"],
];

export function CatalogBreadcrumbs({ last }) {
  const { t } = useLanguage();

  return (
    <nav className="market-breadcrumbs" aria-label={t("Хлебные крошки")}>
      <Link to="/">{t("Главная")}</Link>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{t(last)}</span>
    </nav>
  );
}

function CatalogFilters({ filters, onApply, onReset, expanded, brands, priceLimit }) {
  const priceCeiling = 100000;
  const { t } = useLanguage();
  const [category, setCategory] = useState(filters.category);
  const [brand, setBrand] = useState(filters.brand);
  const [onlyAvailable, setOnlyAvailable] = useState(filters.stock);
  const [minPrice, setMinPrice] = useState(filters.min ?? "");
  const [maxPrice, setMaxPrice] = useState(filters.max ?? "");
  const rangeCeiling = Math.max(priceCeiling, priceLimit || 0, Number(maxPrice) || 0, 100000);
  const minValue = Math.min(rangeCeiling, Math.max(0, Number(minPrice) || 0));
  const maxValue = maxPrice === "" ? rangeCeiling : Math.min(rangeCeiling, Math.max(0, Number(maxPrice) || 0));
  const numberFormat = new Intl.NumberFormat("ru-RU");
  const selectedFilters = [
    category !== "all",
    brand !== "all",
    minPrice !== "" || maxPrice !== "",
    onlyAvailable,
  ].filter(Boolean).length;
  const applyFilters = (event) => {
    event.preventDefault();
    onApply({
      category,
      min: minPrice,
      max: maxPrice,
      brand,
      stock: onlyAvailable ? "1" : "",
    });
  };

  return (
    <form
      id="catalog-filters"
      className={`market-filters market-filters-premium ${expanded ? "is-expanded" : ""}`}
      aria-label={t("Фильтры каталога")}
      onSubmit={applyFilters}
    >
      <div className="market-filter-head">
        <div className="market-filter-heading-copy">
          <span className="market-filter-eyebrow">STROY UZ / {t("Каталог")}</span>
          <h2>{t("Фильтры")}</h2>
          <p>{t("Подберите материалы под свой проект")}</p>
        </div>
        <span className="market-filter-count" aria-label={`${t("Выбрано фильтров")}: ${selectedFilters}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2.4" fill="#fff"/><circle cx="16" cy="17" r="2.4" fill="#fff"/></svg>
          {selectedFilters > 0 && <em>{selectedFilters}</em>}
        </span>
      </div>

      <fieldset className="market-filter-section market-filter-categories">
        <legend><span>{t("Категории")}</span><small>01</small></legend>
        <div className="market-filter-category-list">
          {[{ id: "all", name: "Все товары" }, ...catalogCategories].map((item) => (
            <label key={item.id} className={`market-filter-category ${category === item.id ? "is-selected" : ""}`}>
              <input
                type="radio"
                name="category"
                value={item.id}
                checked={category === item.id}
                onChange={() => setCategory(item.id)}
              />
              <span className="market-filter-choice" aria-hidden="true" />
              <span className="market-filter-category-name">{t(item.name)}</span>
              <svg className="market-filter-choice-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="market-filter-section market-filter-prices">
        <legend><span>{t("Цена, сум")}</span><small>02</small></legend>
        <div className="market-price-controls">
          <label className="market-price-field">
            <span>{t("От")}</span>
            <input
              type="number"
              min="0"
              aria-label={t("Цена от")}
              placeholder="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
            />
          </label>
          <span className="market-price-separator" aria-hidden="true">—</span>
          <label className="market-price-field">
            <span>{t("До")}</span>
            <input
              type="number"
              min="0"
              aria-label={t("Цена до")}
              placeholder={numberFormat.format(rangeCeiling)}
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            />
          </label>
        </div>
        <div className="market-price-track" style={{
          "--range-start": `${minValue / rangeCeiling * 100}%`,
          "--range-end": `${maxValue / rangeCeiling * 100}%`,
        }}>
          <div className="market-price-rail" aria-hidden="true"><div className="market-price-highlight" /></div>
          <input
            className="market-price-slider market-price-slider-min"
            type="range"
            min="0"
            max={rangeCeiling}
            step="1000"
            value={Math.min(minValue, maxValue)}
            aria-label={t("Минимальная цена")}
            onChange={(event) => setMinPrice(String(Math.min(Number(event.target.value), maxValue)))}
          />
          <input
            className="market-price-slider market-price-slider-max"
            type="range"
            min="0"
            max={rangeCeiling}
            step="1000"
            value={Math.max(minValue, maxValue)}
            aria-label={t("Максимальная цена")}
            onChange={(event) => setMaxPrice(String(Math.max(Number(event.target.value), minValue)))}
          />
        </div>
        <div className="market-price-extents" aria-hidden="true">
          <span>0</span><span>{numberFormat.format(rangeCeiling)}</span>
        </div>
        <div className="market-price-presets" aria-label={t("Быстрый выбор цены")}>
          <button type="button" className={minPrice === "" && maxPrice === "" ? "is-selected" : ""} onClick={() => { setMinPrice(""); setMaxPrice(""); }}>{t("Любая цена")}</button>
          <button type="button" className={minPrice === "" && Number(maxPrice) === 100000 ? "is-selected" : ""} onClick={() => { setMinPrice(""); setMaxPrice("100000"); }}>{t("До 100 тыс.")}</button>
          <button type="button" className={minPrice === "" && Number(maxPrice) === 500000 ? "is-selected" : ""} onClick={() => { setMinPrice(""); setMaxPrice("500000"); }}>{t("До 500 тыс.")}</button>
        </div>
      </fieldset>

      <fieldset className="market-filter-section market-filter-brands">
        <legend><span>{t("Бренд")}</span><small>03</small></legend>
        <div className="market-filter-select-wrap">
          <select name="brand" aria-label={t("Выбрать бренд")} value={brand} onChange={(event) => setBrand(event.target.value)}>
            <option value="all">{t("Все бренды")}</option>
            {brands.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </fieldset>

      <label className="market-stock-switch-row">
        <span className="market-stock-copy">
          <strong>{t("Только в наличии")}</strong>
          <small>{t("Без товаров под заказ")}</small>
        </span>
        <input type="checkbox" name="stock" checked={onlyAvailable} onChange={(event) => setOnlyAvailable(event.target.checked)} />
        <span className="market-stock-toggle" aria-hidden="true"><i /></span>
      </label>

      <div className="market-filter-actions">
        <button className="market-apply" type="submit">
          {t("Показать товары")}
          <Icon name="arrow" />
        </button>
        <button type="button" className="market-reset" onClick={onReset}>
          <span aria-hidden="true">↺</span>{t("Сбросить фильтры")}
        </button>
      </div>
    </form>
  );
}

export default function CatalogPage() {
  const { t, language } = useLanguage();
  const [params, setParams] = useSearchParams();
  const filters = readCatalogFilters(params);
  const remoteCatalog = useProductCatalog(filters);
  const facets = useProductFacets();
  const fallbackMatching = filterCatalogProducts(catalogProducts, filters, language);
  const pagination = remoteCatalog.remote
    ? { page: remoteCatalog.page, pages: remoteCatalog.pages, products: remoteCatalog.items }
    : paginateCatalog(fallbackMatching, filters.page, filters.limit);
  const total = remoteCatalog.remote ? remoteCatalog.total : fallbackMatching.length;
  const [searchText, setSearchText] = useState(filters.search);
  const { error, loading } = remoteCatalog;
  const brands = facets?.brands || [...new Set(catalogProducts.map((item) => item.brand))].sort();
  const { favorites, toggleFavorite, addToCart } = useShop();
  useEffect(() => setSearchText(filters.search), [filters.search]);
  const [notice, setNotice] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const update = (changes) => {
    const next = new URLSearchParams(params);
    next.delete("page");
    for (const [key, value] of Object.entries(changes)) {
      if (value === "" || value === "all" || value === "popular")
        next.delete(key);
      else next.set(key, String(value));
    }
    setParams(next);
  };
  const reset = () => {
    const next = new URLSearchParams();
    if (filters.search) next.set("q", filters.search);
    setParams(next);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params]);
  useEffect(() => {
    if (remoteCatalog.remote && !remoteCatalog.loading &&
        filters.page > remoteCatalog.pages) {
      const next = new URLSearchParams(params);
      if (remoteCatalog.pages === 1) next.delete("page");
      else next.set("page", String(remoteCatalog.pages));
      setParams(next, { replace: true });
    }
  }, [remoteCatalog.remote, remoteCatalog.loading, remoteCatalog.pages, filters.page, params, setParams]);
  return (
    <div className="market-page market-catalog">
      <div className="market-container">
        <CatalogBreadcrumbs last="Каталог товаров" />
        <DemoNotice items={pagination.products}/>
        <CatalogNotice error={error} loading={loading} />
        <header className="market-catalog-heading">
          <h1>{t("Материалы и инструменты")}</h1>
          <div className="market-catalog-heading-bottom">
            <p>{t("Для фундамента, ремонта и каждой задачи между ними.")}</p>
            <span role="status">{loading ? t("Загрузка…") : productCount(total, language)}</span>
          </div>
          <div
            className="market-category-pills market-heading-pills"
            aria-label={t("Быстрый выбор категории")}
          >
            {["all", ...catalogCategories.map((item) => item.id)].map((id) => (
              <button
                type="button"
                key={id}
                aria-pressed={filters.category === id}
                className={filters.category === id ? "is-active" : ""}
                onClick={() => update({ category: id })}
              >
                {t(
                  id === "all"
                    ? "Все товары"
                    : catalogCategories.find((item) => item.id === id).name,
                )}
              </button>
            ))}
          </div>
        </header>
      </div>
      <div className="market-catalog-surface">
        <div className="market-container market-catalog-layout">
          <div className="market-filter-wrap">
            <Button
              variant="secondary"
              className="market-filter-toggle"
              aria-controls="catalog-filters"
              aria-expanded={filtersOpen}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              {t("Фильтры")}
              <Icon name="layers" />
            </Button>
            <CatalogFilters
              products={catalogProducts}
              key={params.toString()}
              filters={filters}
              expanded={filtersOpen}
              brands={brands}
              priceLimit={facets?.maxPrice}
              onApply={(changes) => {
                update(changes);
                setFiltersOpen(false);
              }}
              onReset={reset}
            />
          </div>
          <section
            className="market-catalog-main"
            aria-label={t("Товары каталога")}
          >
            <form
              className="market-catalog-search"
              role="search"
              onSubmit={(event) => { event.preventDefault(); update({ q: searchText.trim() }); }}
            >
              <Icon name="search" />
              <input
                type="search"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder={t("Поиск товаров, брендов, материалов")}
                aria-label={t("Поиск по каталогу")}
              />
              <button type="submit">{t("Найти")}</button>
            </form>
            <div className="market-catalog-toolbar">
              <span>{t("Подборка товаров")}{loading && " · " + t("Загрузка…")}</span>
              <div className="market-page-tools">
              <div className="market-page-size">
                <label htmlFor="market-page-size">{t("На странице")}</label>
                <select
                  id="market-page-size"
                  value={filters.limit}
                  onChange={(event) => update({ limit: event.target.value })}
                >
                  {CATALOG_PAGE_SIZES.map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </div>
              <div className="market-sort">
                <label htmlFor="market-sort-select">{t("Сортировка")}</label>
                <select
                  id="market-sort-select"
                  value={filters.sort}
                  onChange={(event) => update({ sort: event.target.value })}
                >
                  {sortOptions.map(([id, label]) => (
                    <option key={id} value={id}>
                      {t(label)}
                    </option>
                  ))}
                </select>
              </div>
              </div>
            </div>
            {filters.search && (
              <p className="market-search-note">
                {t("Результаты поиска по запросу «")}
                {filters.search}»
              </p>
            )}
            {loading ? (
              <div className="market-catalog-loading" role="status">{t("Загрузка товаров…")}</div>
            ) : total > 0 ? (
              <>
                <div className="market-products-grid">
                  {pagination.products.map((product) => (
                    <ProductCard
                      headingLevel={2}
                      key={product.id}
                      product={product}
                      favorite={favorites.includes(product.id)}
                      onFavorite={toggleFavorite}
                      onAdd={(item) => {
                        addToCart(item);
                        setNotice(item.name + " добавлен в корзину");
                      }}
                    />
                  ))}
                </div>
                {pagination.pages > 1 && (
                  <nav
                    className="market-pagination"
                    aria-label={t("Страницы каталога")}
                  >
                    <button
                      type="button"
                      disabled={pagination.page === 1}
                      aria-label={t("Предыдущая страница")}
                      onClick={() => update({ page: pagination.page - 1 })}
                    >
                      ←
                    </button>
                    {[1, pagination.page - 2, pagination.page - 1,
                      pagination.page, pagination.page + 1, pagination.page + 2,
                      pagination.pages]
                      .filter((page, index, list) =>
                        page >= 1 && page <= pagination.pages && list.indexOf(page) === index)
                      .sort((a, b) => a - b)
                      .map((page) => (
                      <button
                        type="button"
                        key={page}
                        aria-label={t("Страница") + " " + page}
                        aria-current={
                          page === pagination.page ? "page" : undefined
                        }
                        onClick={() => update({ page })}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={pagination.page === pagination.pages}
                      aria-label={t("Следующая страница")}
                      onClick={() => update({ page: pagination.page + 1 })}
                    >
                      →
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="market-empty-result">
                <h2>{t("Товары не найдены")}</h2>
                <p>{t("Попробуйте изменить категорию, поиск или фильтры.")}</p>
                <button type="button" onClick={() => setParams({})}>
                  {t("Показать все товары")}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
      <div className="market-container">
        <section
          className="market-assistance"
          aria-labelledby="catalog-help-title"
        >
          <div>
            <h2 id="catalog-help-title">{t("Не уверены в выборе?")}</h2>
            <p>{t("Подберём материалы под задачу и поможем собрать смету.")}</p>
          </div>
          <button
            type="button"
            className="market-apply"
            aria-expanded={helpOpen}
            aria-controls="catalog-help-form"
            onClick={() => setHelpOpen(!helpOpen)}
          >
            {t("Помочь с подбором")}
            <Icon name="arrow" />
          </button>
          {helpOpen && (
            <form
              id="catalog-help-form"
              className="market-help-form"
              onSubmit={(event) => {
                event.preventDefault();
                const values = new FormData(event.currentTarget);
                setParams({
                  category: values.get("category"),
                  ...(values.get("budget")
                    ? { max: values.get("budget") }
                    : {}),
                });
                setHelpOpen(false);
              }}
            >
              <label>
                {t("Что нужно для проекта?")}
                <select name="category">
                  {catalogCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {t(category.name)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                {t("Бюджет на единицу, сум")}
                <input
                  name="budget"
                  type="number"
                  min="0"
                  placeholder={t("Без ограничений")}
                />
              </label>
              <p>
                {t(
                  "Выберите задачу и бюджет — покажем подходящие товары из каталога.",
                )}
              </p>
              <button type="submit" className="market-apply">
                {t("Подобрать товары")}
                <Icon name="arrow" />
              </button>
            </form>
          )}
        </section>
      </div>
      {notice && (
        <div className="market-toast" role="status">
          <span>{t(notice)}</span>
          <button
            type="button"
            aria-label={t("Закрыть уведомление")}
            onClick={() => setNotice("")}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
