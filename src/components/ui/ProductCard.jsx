import { Link } from "react-router";
import { useLanguage } from "../../i18n/useLanguage.js";
import { formatPrice } from "../home/homeData.js";
import Icon from "../home/Icon.jsx";
import Button from "./Button.jsx";

export default function ProductCard({
  product,
  favorite,
  onFavorite,
  onAdd,
  headingLevel = 3,
}) {
  const { t } = useLanguage();
  const Heading = `h${headingLevel}`;
  const available = product.inStock !== false;
  return (
    <article className="ui-product-card">
      <div className="ui-product-card__media">
        <Link
          to={`/product/${product.id}`}
          aria-label={t(`Открыть товар: ${product.name}`)}
        >
          <img
            src={product.image}
            alt={t(product.name)}
            loading="lazy"
            width="400"
            height="400"
          />
        </Link>
        {product.badge && (
          <span className="ui-product-card__badge">{t(product.badge)}</span>
        )}
        <button
          className="ui-product-card__favorite"
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
      <p className="ui-product-card__category">{t(product.category)}</p>
      <Heading className="ui-product-card__name">
        <Link to={`/product/${product.id}`}>{t(product.name)}</Link>
      </Heading>
      <p className="ui-product-card__details">{t(product.details)}</p>
      <div className="ui-product-card__price">
        {product.oldPrice > product.price && (
          <del>
            {formatPrice(product.oldPrice)} {t("сум")}
          </del>
        )}
        <div>
          <strong>{formatPrice(product.price)}</strong>
          <span>
            {t("сум / ")}
            {t(product.unit)}
          </span>
        </div>
      </div>
      <div className="ui-product-card__actions">
        <span className="ui-product-card__stock" data-available={available}>
          <i aria-hidden="true" />
          {t(available ? "В наличии" : "Нет в наличии")}
        </span>
        <Button disabled={!available} onClick={() => onAdd(product)}>
          {t("В корзину")}
          <Icon name="arrow" />
        </Button>
      </div>
    </article>
  );
}
