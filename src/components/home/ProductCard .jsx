import { useLanguage } from "../../i18n/useLanguage.js";
import { Link } from "react-router";
import Icon from "./Icon.jsx";
import { formatPrice } from "./homeData.js";

export default function ProductCard({ product, favorite, onFavorite, onAdd }) {
  const { t } = useLanguage();

  return (
    <article className="home-product-card">
      <div className="home-product-image">
        <Link
          to={`/product/${product.id}`}
          className="home-product-link"
          aria-label={t(`Открыть товар: ${product.name}`)}
        >
          <img
            src={product.image}
            alt={t(product.name)}
            loading="lazy"
            width="1254"
            height="1254"
          />
        </Link>
        <span className="home-product-badge">{t(product.badge)}</span>
        <button
          className="home-favorite"
          type="button"
          aria-label={t(
            `${favorite ? "Убрать из избранного" : "Добавить в избранное"}: ${product.name}`,
          )}
          aria-pressed={favorite}
          onClick={() => onFavorite(product.id)}
        >
          <Icon name="heart" />
        </button>
      </div>
      <p className="home-muted">{t(product.category)}</p>
      <h3>
        <Link to={`/product/${product.id}`}>{t(product.name)}</Link>
      </h3>
      <p className="home-muted">{t(product.details)}</p>
      <p className="home-product-price">
        <strong>{t(formatPrice(product.price))}</strong>
        <span>
          {t("сум / ")}
          {t(product.unit)}
        </span>
      </p>
      <div className="home-product-bottom">
        <span className="home-stock">{t("● В наличии")}</span>
        <button
          type="button"
          className="home-button"
          onClick={() => onAdd(product)}
        >
          {t("В корзину")}
          <Icon name="arrow" />
        </button>
      </div>
    </article>
  );
}
