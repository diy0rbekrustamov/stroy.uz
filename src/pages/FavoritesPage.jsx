import { useEffect } from "react";
import { Link } from "react-router";
import Icon from "../components/home/Icon.jsx";
import { formatPrice } from "../components/home/homeData.js";
import { catalogProducts } from "../data/catalogData.js";
import { useShop } from "../context/ShopContext.jsx";
import "./FavoritesPage.css";

/** The favorites live in the same store as the catalog and product details. */
export default function FavoritesPage() {
  const { favorites, toggleFavorite, addToCart } = useShop();
  const savedProducts = catalogProducts.filter((product) => favorites.includes(product.id));

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="favorites-page">
      <div className="favorites-container">
        <nav className="favorites-breadcrumbs" aria-label="Хлебные крошки">
          <Link to="/">Главная</Link>
          <span aria-hidden="true" className="favorites-breadcrumb-chevron">›</span>
          <span aria-current="page">Избранное</span>
        </nav>

        <h1 className="favorites-title">Избранное</h1>

        {savedProducts.length ? (
          <div className="favorites-grid" aria-label="Сохранённые товары">
            {savedProducts.map((product) => (
              <article className="favorites-card" key={product.id}>
                <div className="favorites-card-media">
                  <span className="favorites-card-badge">{product.badge}</span>
                  <button
                    type="button"
                    className="favorites-card-heart"
                    aria-label={`Убрать из избранного: ${product.name}`}
                    aria-pressed="true"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Icon name="heart" />
                  </button>
                  <Link
                    className="favorites-card-image"
                    to={`/product/${product.id}`}
                    aria-label={`Посмотреть товар: ${product.name}`}
                  >
                    <img src={product.image} alt={product.name} loading="lazy" />
                  </Link>
                </div>
                <p className="favorites-card-category">{product.category}</p>
                <h2 className="favorites-card-name">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h2>
                <div className="favorites-card-pricing">
                  {product.id === "cement" && (
                    <span className="favorites-card-old-price">68 000 сум · мешок</span>
                  )}
                  <div className="favorites-card-current-price">
                    <strong>{formatPrice(product.price)} сум</strong>
                    <span>/ {product.unit}</span>
                  </div>
                </div>
                <div className="favorites-card-bottom">
                  <span className="favorites-card-in-stock"><span aria-hidden="true" />В наличии</span>
                  <button
                    type="button"
                    className="favorites-card-cart"
                    onClick={() => addToCart(product)}
                    aria-label={`Добавить в корзину: ${product.name}`}
                  >
                    В корзину <Icon name="arrow" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="favorites-empty">
            <Icon name="heart" />
            <h2>В избранном пока нет товаров</h2>
            <p>Нажмите на сердечко рядом с товаром, чтобы сохранить его здесь.</p>
            <Link to="/catalog">Перейти к товарам <Icon name="arrow" /></Link>
          </div>
        )}
      </div>
    </div>
  );
}
