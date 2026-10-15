import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useShop } from "../context/ShopContext.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import Footer from "../components/layout/Footer.jsx";
import Hero from "../components/home/Hero.jsx";
import Product from "../components/home/Product.jsx";
import Icon from "../components/home/Icon.jsx";
import HomeDialog from "../components/home/HomeDialog.jsx";
import {
  categories,
  products,
  projects,
  articles,
  formatPrice,
} from "../components/home/homeData.js";
import business from "../assets/home/business.png";
import { catalogCategories, catalogCategoryPath } from "../data/catalogData.js";
import "./HomePage.css";

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, favorites, addToCart, toggleFavorite, changeQuantity } = useShop();
  const [query, setQuery] = useState(() => typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("q") || "" : "");
  const [filter, setFilter] = useState("all");
  const [dialog, setDialog] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const info = (title, text) => setDialog({ title, text });
  const chooseGroup = (group) => {
    setFilter(group);
    setQuery("");
    document.getElementById("products").scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q") || "");
    if (params.has("favorites")) setFilter("favorites");
  }, [location.search]);
  const add = (product) => {
    addToCart(product);
    setAnnouncement(`${product.name} добавлен в корзину`);
  };
  const favorite = toggleFavorite;
  return (
    <div className="homepage">
      <a className="home-skip" href="#main">
        Перейти к содержимому
      </a>
      {/* <Navbar
        query={query}
        onSearch={(value) => {
          setQuery(value);
          setFilter("all");
        }}
        cartCount={cartCount}
        favoriteCount={favorites.length}
        onCart={() => setDialog({ title: "Корзина", type: "cart" })}
        onFavorites={() => chooseGroup("favorites")}
        onInfo={info}
      /> */}
      <main id="main">
        <Hero />
        <section
          id="services"
          className="home-container home-services"
          aria-label="Преимущества"
        >
          {[
            ["truck", "До вашего объекта", "Доставка и самовывоз"],
            ["shield", "Понятный выбор", "Характеристики и сравнение"],
            ["box", "Весь заказ вместе", "Материалы и инструменты"],
            ["layers", "Для частных и B2B", "Розница и оптовые поставки"],
          ].map(([icon, title, text]) => (
            <div key={title}>
              <Icon name={icon} />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
        </section>
        <section
          id="categories"
          className="home-container home-section"
          aria-labelledby="categories-title"
        >
          <div className="home-section-heading">
            <div>
              <p className="home-section-label">01 / КАТАЛОГ</p>
              <h2 id="categories-title">Всё начинается с материалов</h2>
            </div>
            <Link to="/categories">
              Все категории <Icon name="arrow" />
            </Link>
          </div>
          <div className="home-category-grid">
            {categories.map(([title, text], index) => (
              <button
                type="button"
                className="home-category"
                key={title}
                onClick={() => navigate(catalogCategoryPath(catalogCategories[index].id))}
              >
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <Icon name="layers" />
              </button>
            ))}
          </div>
        </section>
        <Product
          products={products}
          filter={filter}
          onFilter={setFilter}
          favorites={favorites}
          onFavorite={favorite}
          onAdd={add}
          query={query}
        />
        <section
          className="home-container home-section home-project-section"
          aria-labelledby="projects-title"
        >
          <div className="home-section-heading">
            <div>
              <p className="home-section-label">03 / ВАШ СЛЕДУЮЩИЙ ШАГ</p>
              <h2 id="projects-title">На каком этапе ваш проект?</h2>
            </div>
            <Link to="/categories">
              Подобрать материалы <Icon name="arrow" />
            </Link>
          </div>
          <div className="home-project-grid">
            {projects.map((project, index) => (
              <button
                type="button"
                key={project.title}
                className={`home-project ${index === 0 ? "home-project-dark" : ""}`}
                onClick={() => chooseGroup(project.group)}
              >
                <div className="home-project-number">
                  <span>0{index + 1}</span>
                  <Icon name="arrow" />
                </div>
                <h3>{project.title}</h3>
                <p>{project.text}</p>
                <img src={project.image} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </section>
        <section
          className="home-container home-business-wrap"
          id="business"
          aria-labelledby="business-title"
        >
          <div className="home-business">
            <div>
              <p className="home-eyebrow">STROY UZ / BUSINESS</p>
              <h2 id="business-title">
                Большой проект.
                <br />
                Надёжная основа.
              </h2>
              <p className="home-business-description">
                Оптовые поставки, подбор материалов
                <br />и коммерческое предложение под вашу смету.
              </p>
              <button
                type="button"
                className="home-button"
                onClick={() =>
                  info(
                    "Обсудить поставку",
                    "Раздел оптовых поставок готовится. Здесь команда сможет подключить форму заявки и контакты отдела продаж.",
                  )
                }
              >
                Обсудить поставку <Icon name="arrow" />
              </button>
            </div>
            <img
              src={business}
              alt="Строительный объект с материалами и рабочими"
              loading="lazy"
            />
          </div>
        </section>
        <section
          className="home-container home-section home-journal"
          aria-labelledby="journal-title"
        >
          <div className="home-section-heading">
            <div>
              <p className="home-section-label">04 / ЖУРНАЛ</p>
              <h2 id="journal-title">Стройте с пониманием</h2>
            </div>
            <button
              type="button"
              onClick={() =>
                info(
                  "Журнал",
                  "Выберите одну из статей ниже. Тексты на главной демонстрационные; полноценный журнал будет подключён отдельно.",
                )
              }
            >
              Все материалы <Icon name="arrow" />
            </button>
          </div>
          <div className="home-journal-grid">
            {articles.map((article) => (
              <button
                type="button"
                className="home-article"
                key={article.title}
                onClick={() => info(article.title, article.text)}
              >
                <img src={article.image} alt="" loading="lazy" />
                <p className="home-section-label">{article.meta}</p>
                <h3>{article.title}</h3>
              </button>
            ))}
          </div>
        </section>
      </main>
      {/* <Footer onInfo={info} />
      <p className="home-sr-only" role="status">
        {announcement}
      </p> */}
      <HomeDialog dialog={dialog} onClose={() => setDialog(null)}>
        {dialog?.type === "cart" ? (
          <>
            <p className="home-muted">
              Демонстрационная корзина. Оформление заказа пока не подключено.
            </p>
            {cartCount ? (
              <>
                <ul className="home-cart-list">
                  {products
                    .filter((product) => cart[product.id])
                    .map((product) => (
                      <li key={product.id}>
                        <img src={product.image} alt="" />
                        <div>
                          <h3>{product.name}</h3>
                          <p>
                            {formatPrice(product.price * cart[product.id])} сум
                          </p>
                          <div className="home-quantity">
                            <button
                              type="button"
                              aria-label={`Уменьшить количество: ${product.name}`}
                              onClick={() => changeQuantity(product.id, -1)}
                            >
                              −
                            </button>
                            <span>{cart[product.id]}</span>
                            <button
                              type="button"
                              aria-label={`Увеличить количество: ${product.name}`}
                              onClick={() => changeQuantity(product.id, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
                <p className="home-cart-total">
                  Итого:{" "}
                  {formatPrice(
                    products.reduce(
                      (sum, product) =>
                        sum + product.price * (cart[product.id] || 0),
                      0,
                    ),
                  )}{" "}
                  сум
                </p>
              </>
            ) : (
              <p className="home-empty">
                Корзина пока пуста. Добавьте материалы для вашего проекта.
              </p>
            )}
          </>
        ) : (
          <p>{dialog?.text}</p>
        )}
      </HomeDialog>
    </div>
  );
}

export default HomePage;
