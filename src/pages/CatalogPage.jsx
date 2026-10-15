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
  return (
    <nav className="market-breadcrumbs" aria-label="Хлебные крошки">
      <Link to="/">Главная</Link>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{last}</span>
    </nav>
  );
}

function CatalogProductCard({ product, isFavorite, onFavorite, onCart }) {
  return (
    <article className="market-product-card">
      <div className="market-card-topline">
        <span>{product.badge}</span>
        <button
          type="button"
          className={`market-heart ${isFavorite ? "is-favorite" : ""}`}
          aria-label={`${isFavorite ? "Убрать из избранного" : "Добавить в избранное"}: ${product.name}`}
          aria-pressed={isFavorite}
          onClick={() => onFavorite(product.id)}
        >
          <Icon name="heart" />
        </button>
      </div>
      <Link className="market-card-image" to={`/product/${product.id}`} aria-label={`Открыть товар: ${product.name}`}>
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="market-card-copy">
        <p className="market-card-category">{product.category}</p>
        <h2><Link to={`/product/${product.id}`}>{product.name}</Link></h2>
        <p className="market-card-spec">{product.details}</p>
        <div className="market-card-pricing">
          {product.oldPrice ? (
            <span className="market-old-price">{formatPrice(product.oldPrice)} сум / {product.unit}</span>
          ) : (
            <span className="market-old-price market-price-spacer" aria-hidden="true"> </span>
          )}
          <div className="market-current-price"><strong>{formatPrice(product.price)} сум</strong><span>/ {product.unit}</span></div>
        </div>
        <div className="market-card-bottom">
          <span className="market-stock"><i />В наличии</span>
          <button type="button" className="market-cart-button" onClick={() => onCart(product)}>
            В корзину <Icon name="arrow" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") || "all";
  const search = (searchParams.get("q") || "").trim();
  const category = catalogCategories.find((item) => item.id === selectedCategory);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [brand, setBrand] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState("popular");
  const [notice, setNotice] = useState("");
  const { favorites, toggleFavorite, addToCart } = useShop();

  useEffect(() => { window.scrollTo(0, 0); }, [selectedCategory, search]);

  const chooseCategory = (id) => {
    const next = new URLSearchParams(searchParams);
    if (id === "all") next.delete("category"); else next.set("category", id);
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
      if (search && !`${product.name} ${product.category} ${product.details} ${product.brand}`.toLowerCase().includes(search.toLowerCase())) return false;
      if (minimum !== null && product.price < minimum) return false;
      if (maximum !== null && product.price > maximum) return false;
      if (brand !== "all" && product.brand !== brand) return false;
      if (availableOnly && !product.inStock) return false;
      return true;
    });
    if (sort === "price-asc") matching.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") matching.sort((a, b) => b.price - a.price);
    if (sort === "name") matching.sort((a, b) => a.name.localeCompare(b.name, "ru"));
    return matching;
  }, [category, search, minPrice, maxPrice, brand, availableOnly, sort]);

  const handleCart = (product) => {
    addToCart(product);
    setNotice(`${product.name} добавлен в корзину`);
  };

  return (
    <div className="market-page market-catalog">
      <div className="market-container">
        <CatalogBreadcrumbs last="Каталог товаров" />
        <header className="market-catalog-heading">
          <p className="market-overline">СТРОИТЕЛЬНЫЙ МАРКЕТПЛЕЙС</p>
          <h1>Каталог товаров</h1>
          <div className="market-catalog-heading-bottom">
            <p>Найдите всё необходимое для строительства и ремонта</p>
            <span>{visibleProducts.length} {visibleProducts.length % 10 === 1 && visibleProducts.length % 100 !== 11 ? "товар" : [2, 3, 4].includes(visibleProducts.length % 10) && ![12, 13, 14].includes(visibleProducts.length % 100) ? "товара" : "товаров"}</span>
          </div>
        </header>
        <div className="market-catalog-layout">
          <aside className="market-filters" aria-label="Фильтры каталога">
            <h2>Категории</h2>
            <div className="market-sidebar-categories">
              <button type="button" className={selectedCategory === "all" ? "is-current" : ""} onClick={() => chooseCategory("all")}>Все товары <span>›</span></button>
              {catalogCategories.map((item) => (
                <button type="button" className={selectedCategory === item.id ? "is-current" : ""} key={item.id} onClick={() => chooseCategory(item.id)}>{item.name}<span>›</span></button>
              ))}
            </div>
            <div className="market-filter-divider" />
            <fieldset className="market-filter-group">
              <legend>Цена, сум</legend>
              <div className="market-price-controls">
                <input type="number" min="0" inputMode="numeric" placeholder="От" aria-label="Цена от" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
                <input type="number" min="0" inputMode="numeric" placeholder="До" aria-label="Цена до" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
              </div>
            </fieldset>
            <fieldset className="market-filter-group">
              <legend>Бренд</legend>
              <select aria-label="Выбрать бренд" value={brand} onChange={(event) => setBrand(event.target.value)}>
                <option value="all">Все бренды</option>
                {[...new Set(catalogProducts.map((p) => p.brand))].sort().map((item) => <option key={item}>{item}</option>)}
              </select>
            </fieldset>
            <label className="market-only-available"><input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} /><span>Только в наличии</span></label>
            <button type="button" className="market-reset" onClick={resetFilters}>Сбросить фильтры <span aria-hidden="true">×</span></button>
            <Link className="market-all-categories-link" to="/categories">Показать все категории <Icon name="arrow" /></Link>
          </aside>

          <section className="market-catalog-main" aria-label="Товары каталога">
            <div className="market-catalog-toolbar">
              <div className="market-category-pills" aria-label="Быстрый выбор категории">
                {quickCategories.map((id) => (
                  <button type="button" key={id} className={selectedCategory === id ? "is-active" : ""} onClick={() => chooseCategory(id)}>{id === "all" ? "Все" : catalogCategories.find((item) => item.id === id).name}</button>
                ))}
              </div>
              <div className="market-sort"><label htmlFor="market-sort-select">Сортировка</label><select id="market-sort-select" value={sort} onChange={(event) => setSort(event.target.value)}>{sortOptions.map(([id, label]) => <option value={id} key={id}>{label}</option>)}</select></div>
            </div>
            {search && <p className="market-search-note">Результаты поиска по запросу «{search}»</p>}
            {category && <div className="market-selected-category">Раздел: <strong>{category.name}</strong><button type="button" onClick={() => chooseCategory("all")}>Показать всё ×</button></div>}
            {visibleProducts.length ? (
              <div className="market-products-grid">
                {visibleProducts.map((product) => (
                  <CatalogProductCard key={product.id} product={product} isFavorite={favorites.includes(product.id)} onFavorite={toggleFavorite} onCart={handleCart} />
                ))}
              </div>
            ) : (
              <div className="market-empty-result"><h2>Товары не найдены</h2><p>Попробуйте изменить категорию, поиск или фильтры.</p><button type="button" onClick={resetFilters}>Показать все товары <Icon name="arrow" /></button></div>
            )}
            <p className="market-catalog-footnote">Цены и ассортимент представлены для демонстрации макета.</p>
          </section>
        </div>
        {notice && <div className="market-toast" role="status"><span>{notice}</span><button type="button" aria-label="Закрыть уведомление" onClick={() => setNotice("")}>×</button></div>}
      </div>
    </div>
  );
}
