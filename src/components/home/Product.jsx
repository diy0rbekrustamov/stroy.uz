import { useLanguage } from "../../i18n/useLanguage.js";
import ProductCard from "./ProductCard .jsx";
import Icon from "./Icon.jsx";
import { normalizeSearch, translate } from "../../i18n/translate.js";
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
  const { t } = useLanguage();

  const visible = products.filter(
    (product) =>
      (filter === "all" ||
        (filter === "favorites" && favorites.includes(product.id)) ||
        product.group === filter) &&
      normalizeSearch(
        `${product.name} ${product.category} ${product.details} ${product.brand || ""} ${translate(`${product.name} ${product.category} ${product.details}`, "uz")}`,
      ).includes(normalizeSearch(query)),
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
            <p className="home-section-label">
              {t("02 / ВЫБОР ДЛЯ ВАШЕГО ПРОЕКТА")}
            </p>
            <h2 id="products-title">{t("Материалы, с которых строят")}</h2>
          </div>
          <a href="#categories">
            {t("В каталог")}
            <Icon name="arrow" />
          </a>
        </div>
        <div className="home-filters" aria-label={t("Подбор товаров")}>
          {filters.map(([id, label]) => (
            <button
              type="button"
              key={id}
              aria-pressed={filter === id}
              onClick={() => onFilter(id)}
            >
              {t(label)}
            </button>
          ))}
          {t(
            filter === "favorites" && (
              <button
                type="button"
                aria-pressed="true"
                onClick={() => onFilter("favorites")}
              >
                {t("Избранное")}
              </button>
            ),
          )}
        </div>
        {t(
          query && (
            <p className="home-search-result">
              {t("Поиск: «")}
              {query}
              {t("» · Найдено: ")}
              {t(visible.length)}
            </p>
          ),
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
        {t(
          !visible.length && (
            <p className="home-empty">
              {t(
                "Товаров пока нет. Выберите другую категорию или измените поисковый запрос.",
              )}
            </p>
          ),
        )}
        <p className="home-demo-note">
          {t("Цены и ассортимент показаны для демонстрации макета.")}
        </p>
      </div>
    </section>
  );
}
