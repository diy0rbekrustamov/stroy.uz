import { useOutletContext } from "react-router";
import Hero from "../components/home/Hero.jsx";
import Product from "../components/home/Product.jsx";
import Icon from "../components/home/Icon.jsx";
import {
  categories,
  products,
  projects,
  articles,
} from "../components/home/homeData.js";
import business from "../assets/home/business.png";
import "./HomePage.css";

function HomePage() {
  const {
    query,
    filter,
    setFilter,
    setQuery,
    favorites,
    favorite,
    add,
    info,
    chooseGroup,
  } = useOutletContext();
  return (
    <div className="home-content">
      <a className="home-skip" href="#main">
        Перейти к содержимому
      </a>
      <div>
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
            <a
              href="#products"
              onClick={() => {
                setFilter("all");
                setQuery("");
              }}
            >
              Все категории <Icon name="arrow" />
            </a>
          </div>
          <div className="home-category-grid">
            {categories.map(([title, text, group]) => (
              <button
                type="button"
                className="home-category"
                key={title}
                onClick={() => chooseGroup(group)}
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
            <a href="#categories">
              Подобрать материалы <Icon name="arrow" />
            </a>
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
      </div>
    </div>
  );
}

export default HomePage;
