import {
  readCatalogFilters,
  filterCatalogProducts,
  paginateCatalog,
} from "../data/catalogFilters.js";
import { productCount } from "../i18n/translate.js";
import { useLanguage } from "../i18n/useLanguage.js";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import Icon from "../components/home/Icon.jsx";
import { formatPrice } from "../components/home/homeData.js";
import { catalogCategories, catalogProducts } from "../data/catalogData.js";
import { useShop } from "../context/ShopContext.jsx";
import "./CatalogPage.css";

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

function CatalogProductCard({ product, isFavorite, onFavorite, onCart }) {
  const { t } = useLanguage();

  return (
    <article className="market-product-card">
      <div className="market-card-topline">
        <span>{t(product.badge)}</span>
        <button
          type="button"
          className={`market-heart ${isFavorite ? "is-favorite" : ""}`}
          aria-label={t(
            `${isFavorite ? "Убрать из избранного" : "Добавить в избранное"}: ${product.name}`,
          )}
          aria-pressed={isFavorite}
          onClick={() => onFavorite(product.id)}
        >
          <Icon name="heart" />
        </button>
      </div>
      <Link
        className="market-card-image"
        to={`/product/${product.id}`}
        aria-label={t(`Открыть товар: ${product.name}`)}
      >
        <img src={product.image} alt={t(product.name)} loading="lazy" />
      </Link>
      <div className="market-card-copy">
        <p className="market-card-category">{t(product.category)}</p>
        <h2>
          <Link to={`/product/${product.id}`}>{t(product.name)}</Link>
        </h2>
        <p className="market-card-spec">{t(product.details)}</p>
        <div className="market-card-pricing">
          {t(
            product.oldPrice ? (
              <span className="market-old-price">
                {t(formatPrice(product.oldPrice))}
                {t(" сум / ")}
                {t(product.unit)}
              </span>
            ) : (
              <span
                className="market-old-price market-price-spacer"
                aria-hidden="true"
              >
                 
              </span>
            ),
          )}
          <div className="market-current-price">
            <strong>
              {t(formatPrice(product.price))}
              {t(" сум")}
            </strong>
            <span>/ {t(product.unit)}</span>
          </div>
        </div>
        <div className="market-card-bottom">
          <span className="market-stock">
            <i />
            {t("В наличии")}
          </span>
          <button
            type="button"
            className="market-cart-button"
            onClick={() => onCart(product)}
          >
            {t("В корзину")}
            <Icon name="arrow" />
          </button>
        </div>
      </div>
    </article>
  );
}

const priceCeiling =
  Math.ceil(Math.max(...catalogProducts.map((item) => item.price)) / 100000) *
  100000;

function CatalogFilters({ filters, onApply, onReset }) {
  const { t } = useLanguage();
  const [minPrice, setMinPrice] = useState(filters.min ?? "");
  const [maxPrice, setMaxPrice] = useState(filters.max ?? "");
  return (
    <form
      className="market-filters"
      aria-label={t("Фильтры каталога")}
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        onApply({
          category: data.get("category"),
          min: minPrice,
          max: maxPrice,
          brand: data.get("brand"),
          stock: data.has("stock") ? "1" : "",
        });
      }}
    >
      <h2>{t("Фильтры")}</h2>
      <fieldset className="market-filter-group market-category-options">
        <legend>{t("Категории")}</legend>
        {[{ id: "all", name: "Все товары" }, ...catalogCategories].map(
          (item) => (
            <label key={item.id}>
              <input
                type="radio"
                name="category"
                value={item.id}
                defaultChecked={filters.category === item.id}
              />
              <span>{t(item.name)}</span>
            </label>
          ),
        )}
      </fieldset>
      <fieldset className="market-filter-group">
        <legend>{t("Цена, сум")}</legend>
        <div className="market-price-controls">
          <input
            type="number"
            min="0"
            max={maxPrice === "" ? undefined : maxPrice}
            aria-label={t("Цена от")}
            placeholder={t("От")}
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />
          <input
            type="number"
            min={minPrice || 0}
            aria-label={t("Цена до")}
            placeholder={t("До")}
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </div>
        <div className="market-range-controls">
          <label>
            {t("Минимальная цена")}
            <input
              type="range"
              min="0"
              max={priceCeiling}
              step="1000"
              value={Math.min(priceCeiling, Number(minPrice) || 0)}
              onChange={(event) =>
                setMinPrice(
                  Math.min(
                    Number(event.target.value),
                    maxPrice === "" ? priceCeiling : Number(maxPrice),
                  ),
                )
              }
            />
          </label>
          <label>
            {t("Максимальная цена")}
            <input
              type="range"
              min="0"
              max={priceCeiling}
              step="1000"
              value={Math.min(
                priceCeiling,
                maxPrice === "" ? priceCeiling : Number(maxPrice),
              )}
              onChange={(event) =>
                setMaxPrice(
                  Math.max(Number(event.target.value), Number(minPrice) || 0),
                )
              }
            />
          </label>
        </div>
      </fieldset>
      <fieldset className="market-filter-group">
        <legend>{t("Бренд")}</legend>
        <select
          name="brand"
          aria-label={t("Выбрать бренд")}
          defaultValue={filters.brand}
        >
          <option value="all">{t("Все бренды")}</option>
          {[...new Set(catalogProducts.map((item) => item.brand))]
            .sort()
            .map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
        </select>
      </fieldset>
      <label className="market-only-available">
        <input type="checkbox" name="stock" defaultChecked={filters.stock} />
        <span>{t("Только в наличии")}</span>
      </label>
      <button className="market-apply" type="submit">
        {t("Применить")}
        <Icon name="arrow" />
      </button>
      <button type="button" className="market-reset" onClick={onReset}>
        {t("Сбросить фильтры")}
      </button>
    </form>
  );
}

export default function CatalogPage() {
  const { t, language } = useLanguage();
  const [params, setParams] = useSearchParams();
  const filters = readCatalogFilters(params);
  const matching = filterCatalogProducts(catalogProducts, filters, language);
  const pagination = paginateCatalog(matching, filters.page);
  const { favorites, toggleFavorite, addToCart } = useShop();
  const [notice, setNotice] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
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
  return (
    <div className="market-page market-catalog">
      <div className="market-container">
        <CatalogBreadcrumbs last="Каталог товаров" />
        <header className="market-catalog-heading">
          <h1>{t("Материалы и инструменты")}</h1>
          <div className="market-catalog-heading-bottom">
            <p>{t("Для фундамента, ремонта и каждой задачи между ними.")}</p>
            <span role="status">{productCount(matching.length, language)}</span>
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
          <CatalogFilters
            key={params.toString()}
            filters={filters}
            onApply={update}
            onReset={reset}
          />
          <section
            className="market-catalog-main"
            aria-label={t("Товары каталога")}
          >
            <div className="market-catalog-toolbar">
              <span>{t("Подборка товаров")}</span>
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
            {filters.search && (
              <p className="market-search-note">
                {t("Результаты поиска по запросу «")}
                {filters.search}»
              </p>
            )}
            {matching.length ? (
              <>
                <div className="market-products-grid">
                  {pagination.products.map((product) => (
                    <CatalogProductCard
                      key={product.id}
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      onFavorite={toggleFavorite}
                      onCart={(item) => {
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
                    {Array.from(
                      { length: pagination.pages },
                      (_, index) => index + 1,
                    ).map((page) => (
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
            <p className="market-catalog-footnote">
              {t("Цены и ассортимент представлены для демонстрации макета.")}
            </p>
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
