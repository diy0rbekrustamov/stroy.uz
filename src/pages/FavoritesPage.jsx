import ProductCard from "../components/ui/ProductCard.jsx";
import { useLanguage } from "../i18n/useLanguage.js";
import { useEffect } from "react";
import { Link } from "react-router";
import Icon from "../components/home/Icon.jsx";
import { catalogProducts } from "../data/catalogData.js";
import { useShop } from "../context/ShopContext.jsx";
import "./FavoritesPage.css";

/** The favorites live in the same store as the catalog and product details. */
export default function FavoritesPage() {
  const { t } = useLanguage();

  const { favorites, toggleFavorite, addToCart } = useShop();
  const savedProducts = catalogProducts.filter((product) =>
    favorites.includes(product.id),
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <nav className="favorites-breadcrumbs" aria-label={t("Хлебные крошки")}>
          <Link to="/">{t("Главная")}</Link>
          <span aria-hidden="true" className="favorites-breadcrumb-chevron">
            ›
          </span>
          <span aria-current="page">{t("Избранное")}</span>
        </nav>

        <h1 className="favorites-title">{t("Избранное")}</h1>

        {t(
          savedProducts.length ? (
            <div
              className="favorites-grid"
              aria-label={t("Сохранённые товары")}
            >
              {savedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  headingLevel={2}
                  favorite={true}
                  onFavorite={toggleFavorite}
                  onAdd={addToCart}
                />
              ))}
            </div>
          ) : (
            <div className="favorites-empty">
              <Icon name="heart" />
              <h2>{t("В избранном пока нет товаров")}</h2>
              <p>
                {t(
                  "Нажмите на сердечко рядом с товаром, чтобы сохранить его здесь.",
                )}
              </p>
              <Link to="/catalog">
                {t("Перейти к товарам ")}
                <Icon name="arrow" />
              </Link>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
