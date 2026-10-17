import { matchesProduct, productCount } from "../i18n/translate.js";
import { useLanguage } from "../i18n/useLanguage.js";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import Icon from "../components/home/Icon.jsx";
import { formatPrice } from "../components/home/homeData.js";
import { catalogCategories, catalogProducts } from "../data/catalogData.js";
import { useShop } from "../context/ShopContext.jsx";
import "./CatalogPage.css";

const quickCategories = ["all", "mixes", "bricks", "metal", "tools"];
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

export default function CatalogPage() {
  const { t, language } = useLanguage();

  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";
  const search = (searchParams.get("q") || "").trim();
  const category = catalogCategories.find(
    (item) => item.id === selectedCategory,
  );
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brand, setBrand] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState("popular");
  const [notice, setNotice] = useState("");
  const { favorites, toggleFavorite, addToCart } = useShop();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedCategory, search]);

  const chooseCategory = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === "all") next.delete("category");
    else next.set("category", id);
    setSearchParams(next);
  };
  const resetFilters = () => {
    setSearchParams({});
    setMinPrice("");
    setMaxPrice("");
    setBrand("all");
    setAvailableOnly(false);
    setSort("popular");
  };

  const visibleProducts = useMemo(() => {
    const minimum = minPrice.trim() === "" ? null : Number(minPrice);
    const maximum = maxPrice.trim() === "" ? null : Number(maxPrice);
    const matching = catalogProducts.filter((product) => {
      if (category && product.categoryId !== category.id) return false;
      if (search && !matchesProduct(product, search)) return false;
      if (minimum !== null && product.price < minimum) return false;
      if (maximum !== null && product.price > maximum) return false;
      if (brand !== "all" && product.brand !== brand) return false;
      if (availableOnly && !product.inStock) return false;
      return true;
    });
    if (sort === "price-asc") matching.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") matching.sort((a, b) => b.price - a.price);
    if (sort === "name")
      matching.sort((a, b) => t(a.name).localeCompare(t(b.name), language));
    return matching;
  }, [
    category,
    search,
    minPrice,
    maxPrice,
    brand,
    availableOnly,
    sort,
    language,
    t,
  ]);

  const handleCart = (product) => {
    addToCart(product);
    setNotice(`${product.name} добавлен в корзину`);
  };

  return (
    <div className="market-page market-catalog">
      <div className="market-container">
        <CatalogBreadcrumbs last="Каталог товаров" />
        <header className="market-catalog-heading">
          <p className="market-overline">{t("СТРОИТЕЛЬНЫЙ МАРКЕТПЛЕЙС")}</p>
          <h1>{t("Каталог товаров")}</h1>
          <div className="market-catalog-heading-bottom">
            <p>{t("Найдите всё необходимое для строительства и ремонта")}</p>
            <span>{productCount(visibleProducts.length, language)}</span>
          </div>
        </header>
        <div className="market-catalog-layout">
          <aside className="market-filters" aria-label={t("Фильтры каталога")}>
            <h2>{t("Категории")}</h2>
            <div className="market-sidebar-categories">
              <button
                type="button"
                className={selectedCategory === "all" ? "is-current" : ""}
                onClick={() => chooseCategory("all")}
              >
                {t("Все товары ")}
                <span>›</span>
              </button>
              {catalogCategories.map((item) => (
                <button
                  type="button"
                  className={selectedCategory === item.id ? "is-current" : ""}
                  key={item.id}
                  onClick={() => chooseCategory(item.id)}
                >
                  {t(item.name)}
                  <span>›</span>
                </button>
              ))}
            </div>
            <div className="market-filter-divider" />
            <fieldset className="market-filter-group">
              <legend>{t("Цена, сум")}</legend>
              <div className="market-price-controls">
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder={t("От")}
                  aria-label={t("Цена от")}
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                />
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  placeholder={t("До")}
                  aria-label={t("Цена до")}
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                />
              </div>
            </fieldset>
            <fieldset className="market-filter-group">
              <legend>{t("Бренд")}</legend>
              <select
                aria-label={t("Выбрать бренд")}
                value={brand}
                onChange={(event) => setBrand(event.target.value)}
              >
                <option value="all">{t("Все бренды")}</option>
                {[...new Set(catalogProducts.map((p) => p.brand))]
                  .sort()
                  .map((item) => (
                    <option key={item}>{t(item)}</option>
                  ))}
              </select>
            </fieldset>
            <label className="market-only-available">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(event) => setAvailableOnly(event.target.checked)}
              />
              <span>{t("Только в наличии")}</span>
            </label>
            <button
              type="button"
              className="market-reset"
              onClick={resetFilters}
            >
              {t("Сбросить фильтры ")}
              <span aria-hidden="true">×</span>
            </button>
            <Link className="market-all-categories-link" to="/categories">
              {t("Показать все категории ")}
              <Icon name="arrow" />
            </Link>
          </aside>

          <section
            className="market-catalog-main"
            aria-label={t("Товары каталога")}
          >
            <div className="market-catalog-toolbar">
              <div
                className="market-category-pills"
                aria-label={t("Быстрый выбор категории")}
              >
                {quickCategories.map((id) => (
                  <button
                    type="button"
                    key={id}
                    className={selectedCategory === id ? "is-active" : ""}
                    onClick={() => chooseCategory(id)}
                  >
                    {t(
                      id === "all"
                        ? "Все"
                        : catalogCategories.find((item) => item.id === id).name,
                    )}
                  </button>
                ))}
              </div>
              <div className="market-sort">
                <label htmlFor="market-sort-select">{t("Сортировка")}</label>
                <select
                  id="market-sort-select"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  {sortOptions.map(([id, label]) => (
                    <option value={id} key={id}>
                      {t(label)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {search && (
              <p className="market-search-note">
                {t("Результаты поиска по запросу «")}
                {search}»
              </p>
            )}
            {category && (
              <div className="market-selected-category">
                {t("Раздел: ")}
                <strong>{t(category.name)}</strong>
                <button type="button" onClick={() => chooseCategory("all")}>
                  {t("Показать всё ×")}
                </button>
              </div>
            )}
            {t(
              visibleProducts.length ? (
                <div className="market-products-grid">
                  {visibleProducts.map((product) => (
                    <CatalogProductCard
                      key={product.id}
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      onFavorite={toggleFavorite}
                      onCart={handleCart}
                    />
                  ))}
                </div>
              ) : (
                <div className="market-empty-result">
                  <h2>{t("Товары не найдены")}</h2>
                  <p>
                    {t("Попробуйте изменить категорию, поиск или фильтры.")}
                  </p>
                  <button type="button" onClick={resetFilters}>
                    {t("Показать все товары ")}
                    <Icon name="arrow" />
                  </button>
                </div>
              ),
            )}
            <p className="market-catalog-footnote">
              {t("Цены и ассортимент представлены для демонстрации макета.")}
            </p>
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
    </div>
  );
}
