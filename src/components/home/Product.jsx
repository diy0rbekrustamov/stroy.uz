import ProductCard from "./ProductCard .jsx";
import Icon from "./Icon.jsx";
const filters = [
  ["all", "Популярное"],
  ["build", "Для стройки"],
  ["renovate", "Для ремонта"],
  ["tools", "Инструменты"],
];

export default function Product({
  products,
  filter,
  onFilter,
  favorites,
  onFavorite,
  onAdd,
  query,
}) {
  const visible = products.filter(
    (product) =>
      (filter === "all" ||
        (filter === "favorites" && favorites.includes(product.id)) ||
        product.group === filter) &&
      `${product.name} ${product.category} ${product.details} ${product.brand || ""}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <section
      className="home-products"
      id="products"
      aria-labelledby="products-title"
    >
      <div className="home-container">
        <div className="home-section-heading">
          <div>
            <p className="home-section-label">02 / ВЫБОР ДЛЯ ВАШЕГО ПРОЕКТА</p>
            <h2 id="products-title">Материалы, с которых строят</h2>
          </div>
          <a href="#categories">
            В каталог <Icon name="arrow" />
          </a>
        </div>
        <div className="home-filters" aria-label="Подбор товаров">
          {filters.map(([id, label]) => (
            <button
              type="button"
              key={id}
              aria-pressed={filter === id}
              onClick={() => onFilter(id)}
            >
              {label}
            </button>
          ))}
          {filter === "favorites" && (
            <button
              type="button"
              aria-pressed="true"
              onClick={() => onFilter("favorites")}
            >
              Избранное
            </button>
          )}
        </div>
        {query && (
          <p className="home-search-result">
            Поиск: «{query}» · Найдено: {visible.length}
          </p>
        )}
        <div className="home-product-grid">
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              favorite={favorites.includes(product.id)}
              onFavorite={onFavorite}
              onAdd={onAdd}
            />
          ))}
        </div>
        {!visible.length && (
          <p className="home-empty">
            Товаров пока нет. Выберите другую категорию или измените поисковый
            запрос.
          </p>
        )}
        <p className="home-demo-note">
          Цены и ассортимент показаны для демонстрации макета.
        </p>
      </div>
    </section>
  );
}
