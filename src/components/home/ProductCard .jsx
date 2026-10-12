import Icon from "./Icon.jsx";
import { formatPrice } from "./homeData.js";

export default function ProductCard({ product, favorite, onFavorite, onAdd }) {
  return (
    <article className="home-product-card">
      <div className="home-product-image">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width="1254"
          height="1254"
        />
        <span className="home-product-badge">{product.badge}</span>
        <button
          className="home-favorite"
          type="button"
          aria-label={`${favorite ? "Убрать из избранного" : "Добавить в избранное"}: ${product.name}`}
          aria-pressed={favorite}
          onClick={() => onFavorite(product.id)}
        >
          <Icon name="heart" />
        </button>
      </div>
      <p className="home-muted">{product.category}</p>
      <h3>{product.name}</h3>
      <p className="home-muted">{product.details}</p>
      <p className="home-product-price">
        <strong>{formatPrice(product.price)}</strong>
        <span>сум / {product.unit}</span>
      </p>
      <div className="home-product-bottom">
        <span className="home-stock">● В наличии</span>
        <button
          type="button"
          className="home-button"
          onClick={() => onAdd(product)}
        >
          В корзину <Icon name="arrow" />
        </button>
      </div>
    </article>
  );
}
