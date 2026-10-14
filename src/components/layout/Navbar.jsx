import { Link } from "react-router";
import { useState } from "react";
import Brand from "./Brand.jsx";
import Icon from "../home/Icon.jsx";

export default function Navbar({
  query,
  onSearch,
  onSearchSubmit,
  cartCount,
  favoriteCount,
  onCart,
  onFavorites,
  onInfo,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header id="top" className="home-header">
      <div className="home-topbar">
        <div className="home-container">
          <span>
            <Icon name="pin" />
            Бухара{" "}
            <span className="home-delivery">Доставка по Узбекистану</span>
          </span>
          <div>
            <Link to="/#footer">О компании</Link>
            <button
              type="button"
              onClick={() =>
                onInfo(
                  "Помощь",
                  "Для подбора материалов используйте категории и поиск. Корзина на этой странице демонстрационная; оформление заказа будет подключено командой.",
                )
              }
            >
              Помощь
            </button>
            <Link to="/#business">Для бизнеса</Link>
          </div>
          <span>RU / UZ</span>
        </div>
      </div>
      <div className="home-container home-header-main">
        <Brand />
        <form
          className="home-search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            onSearchSubmit();
          }}
        >
          <button type="submit" aria-label="Найти товары">
            <Icon name="search" />
          </button>
          <input
            aria-label="Поиск материалов, инструментов или бренда"
            placeholder="Найти материалы, инструмент или бренд"
            value={query}
            onChange={(event) => onSearch(event.target.value)}
          />
          <span aria-hidden="true">⌕</span>
        </form>
        <div className="home-header-actions">
          <button type="button" onClick={onFavorites}>
            <Icon name="heart" />
            <span>Избранное{favoriteCount ? ` (${favoriteCount})` : ""}</span>
          </button>
          <Link to="/login">
            <Icon name="user" />
            <span>Войти</span>
          </Link>
          <button type="button" onClick={onCart}>
            <Icon name="cart" />
            <span>Корзина{cartCount ? ` (${cartCount})` : ""}</span>
          </button>
        </div>
        <button
          className="home-menu-toggle"
          type="button"
          aria-label="Меню"
          aria-expanded={menuOpen}
          aria-controls="home-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name="menu" />
        </button>
      </div>
      <nav
        id="home-navigation"
        className={`home-container home-navigation ${menuOpen ? "is-open" : ""}`}
        aria-label="Основная навигация"
      >
        <Link
          className="home-button home-button-dark"
          to="/#categories"
          onClick={() => setMenuOpen(false)}
        >
          Каталог товаров <Icon name="arrow" />
        </Link>
        {[
          ["Акции", "#products"],
          ["Стройматериалы", "#categories"],
          ["Инструменты", "#products"],
          ["Отделка", "#categories"],
          ["Доставка и оплата", "#services"],
          ["Оптовым клиентам ↗", "#business"],
        ].map(([label, href]) => (
          <Link key={label} to={`/${href}`} onClick={() => setMenuOpen(false)}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
