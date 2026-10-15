import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Icon from "../components/home/Icon.jsx";
import { products, formatPrice } from "../components/home/homeData.js";
import { useShop } from "../context/ShopContext.jsx";
import "./ProductPage.css";

const productDetails = {
  drill: {
    title: "Дрель-шуруповёрт аккумуляторная 18V",
    eyebrow: "ПРОФЕССИОНАЛЬНЫЙ ИНСТРУМЕНТ",
    article: "SU-DR18",
    chips: ["18 В", "2 аккумулятора", "Кейс"],
    sectionTitle: "Точность. Мощность. Свобода движения.",
    description:
      "Инструмент для сборки, крепежа и повседневных задач на объекте. Компактная форма и автономное питание помогают работать там, где нет розетки.",
    specs: [
      ["Тип", "Аккумуляторная дрель-шуруповёрт"],
      ["Напряжение", "18 В"],
      ["Комплектация", "2 аккумулятора, зарядное устройство, кейс"],
      ["Режимы", "Сверление / завинчивание"],
      ["Цвет корпуса", "Тёмный бирюзовый / чёрный"],
      ["Единица продажи", "Штука"],
    ],
  },
  cement: {
    title: "Цемент М400 · 50 кг",
    eyebrow: "СТРОИТЕЛЬНЫЕ МАТЕРИАЛЫ",
    article: "SU-CM400",
    chips: ["М400", "Д20", "50 кг"],
    sectionTitle: "Надёжная основа для вашего проекта.",
    description:
      "Цемент для строительных и ремонтных работ. Подходит для приготовления растворов и бетонных смесей при соблюдении технологии производителя.",
    specs: [
      ["Тип", "Цемент"],
      ["Марка", "М400"],
      ["Добавки", "Д20"],
      ["Вес", "50 кг"],
      ["Упаковка", "Мешок"],
      ["Единица продажи", "Мешок"],
    ],
  },
  bricks: {
    title: "Кирпич керамический",
    eyebrow: "СТРОИТЕЛЬНЫЕ МАТЕРИАЛЫ",
    article: "SU-BR250",
    chips: ["Керамический", "250 × 120 × 65 мм"],
    sectionTitle: "Прочность и форма будущих стен.",
    description:
      "Керамический кирпич для кладочных работ. Используйте материал в соответствии с проектом и условиями строительства.",
    specs: [
      ["Тип", "Кирпич керамический"],
      ["Длина", "250 мм"],
      ["Ширина", "120 мм"],
      ["Высота", "65 мм"],
      ["Материал", "Керамика"],
      ["Единица продажи", "Штука"],
    ],
  },
  paint: {
    title: "Краска интерьерная · 10 л",
    eyebrow: "ОТДЕЛОЧНЫЕ МАТЕРИАЛЫ",
    article: "SU-PA10",
    chips: ["10 л", "Матовая", "Белая"],
    sectionTitle: "Свежий взгляд на ваш интерьер.",
    description:
      "Интерьерная краска для обновления и оформления помещений. Перед нанесением подготовьте поверхность и следуйте инструкции на упаковке.",
    specs: [
      ["Тип", "Краска интерьерная"],
      ["Объём", "10 л"],
      ["Цвет", "Белый"],
      ["Финиш", "Матовый"],
      ["Применение", "Внутренние работы"],
      ["Единица продажи", "Ведро"],
    ],
  },
};

const tabItems = [
  ["description", "Описание"],
  ["specs", "Характеристики"],
  ["delivery", "Доставка и оплата"],
  ["reviews", "Отзывы"],
];

export default function ProductPage() {
  const { productId = "drill" } = useParams();
  const product =
    products.find((item) => item.id === productId) ||
    products.find((item) => item.id === "drill");
  const detail = productDetails[product.id];
  const { favorites, toggleFavorite, addToCart, openCart } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const [imageOpen, setImageOpen] = useState(false);
  const [compared, setCompared] = useState(false);
  const [toast, setToast] = useState("");
  useEffect(() => {
    setQuantity(1);
    setActiveTab("specs");
    setCompared(false);
    window.scrollTo(0, 0);
  }, [product.id]);
  useEffect(() => {
    if (!imageOpen) return;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setImageOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [imageOpen]);
  const favorite = favorites.includes(product.id);
  const showAdded = (item, count = 1) => {
    addToCart(item, count);
    setToast(`${item.name} добавлен в корзину (${count} шт.)`);
  };

  return (
    <div className="product-page" id="product-page">
      <div className="product-container product-top">
        <nav className="product-breadcrumbs" aria-label="Навигация по каталогу">
          <Link to="/">Главная</Link>
          <span>/</span>
          <Link to="/#products">
            {product.group === "tools"
              ? "Инструменты"
              : product.group === "renovate"
                ? "Отделка"
                : "Стройматериалы"}
          </Link>
          <span>/</span>
          <span>
            {product.id === "drill" ? "Дрели-шуруповёрты" : product.name}
          </span>
        </nav>
        <section className="product-main-grid" aria-label="Информация о товаре">
          <div className="product-gallery">
            <button
              type="button"
              className="product-hero-image"
              onClick={() => setImageOpen(true)}
              aria-label={`Увеличить изображение: ${product.name}`}
            >
              <img src={product.image} alt={detail.title} />
              <span className="product-image-badge">{product.badge}</span>
            </button>
            <div className="product-gallery-controls">
              <button
                type="button"
                className="product-thumbnail"
                aria-label="Показать общий вид товара"
                onClick={() => setImageOpen(true)}
              >
                <img src={product.image} alt="" />
              </button>
              <span className="product-gallery-hint">
                Нажмите на изображение для увеличения
              </span>
              <button
                type="button"
                className="product-view-control"
                onClick={() => setImageOpen(true)}
              >
                <Icon name="search" /> <span>Общий вид</span>
              </button>
            </div>
          </div>
          <div className="product-information">
            <p className="product-eyebrow">{detail.eyebrow}</p>
            <h1>{detail.title}</h1>
            <p className="product-article">
              Артикул: {detail.article} · Демонстрационный товар
            </p>
            <div className="product-chips">
              {detail.chips.map((chip) => (
                <span key={chip}>{chip}</span>
              ))}
            </div>
            <div className="product-buy-card">
              <div className="product-price">
                <strong>{formatPrice(product.price)}</strong>
                <span>сум / {product.unit}</span>
              </div>
              <span className="product-stock">
                <span className="product-stock-dot" />В наличии
              </span>
              <div className="product-purchase-controls">
                <div className="product-stepper" aria-label="Количество товара">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => Math.max(1, value - 1))
                    }
                    aria-label="Уменьшить количество"
                  >
                    −
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => Math.min(999, value + 1))
                    }
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="product-add-button"
                  onClick={() => showAdded(product, quantity)}
                >
                  Добавить в корзину <Icon name="arrow" />
                </button>
              </div>
              <div className="product-extra-actions">
                <button
                  type="button"
                  onClick={() => toggleFavorite(product.id)}
                  aria-pressed={favorite}
                >
                  <Icon
                    name="heart"
                    className={favorite ? "product-heart-active" : ""}
                  />
                  {favorite ? "В избранном" : "В избранное"}
                </button>
                <button
                  type="button"
                  onClick={() => setCompared((value) => !value)}
                  aria-pressed={compared}
                >
                  <Icon name="layers" />
                  {compared ? "В сравнении" : "Сравнить"}
                </button>
              </div>
              <p className="product-price-note">
                Цена указана как пример для макета.
              </p>
            </div>
            <div className="product-delivery-note">
              <Icon name="truck" />
              <div>
                <strong>Доставка в Бухару</strong>
                <p>
                  Срок и стоимость рассчитываются при оформлении.
                  <br />
                  Также доступен самовывоз.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section
        className="product-details-band"
        aria-label="Описание и характеристики"
      >
        <div className="product-container">
          <div
            className="product-tabs"
            role="tablist"
            aria-label="Информация о товаре"
          >
            {tabItems.map(([id, title]) => (
              <button
                type="button"
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                className={activeTab === id ? "is-active" : ""}
                onClick={() => setActiveTab(id)}
              >
                {title}
              </button>
            ))}
          </div>
          {activeTab === "delivery" ? (
            <div className="product-details-content">
              <div className="product-description">
                <h2>Доставка и оплата</h2>
                <p>
                  Доставим заказ по Бухаре и другим городам Узбекистана. Точные
                  сроки и стоимость зависят от адреса и состава заказа.
                </p>
              </div>
              <div className="product-spec-card">
                <div className="product-spec-row">
                  <span>Доставка</span>
                  <strong>По Узбекистану</strong>
                </div>
                <div className="product-spec-row">
                  <span>Самовывоз</span>
                  <strong>Доступен</strong>
                </div>
                <div className="product-spec-row">
                  <span>Стоимость</span>
                  <strong>Рассчитывается при оформлении</strong>
                </div>
              </div>
            </div>
          ) : activeTab === "reviews" ? (
            <div className="product-details-content">
              <div className="product-description">
                <h2>Отзывы покупателей</h2>
                <p>
                  Для этого демонстрационного товара ещё нет отзывов. После
                  подключения магазина здесь появятся оценки и комментарии
                  покупателей.
                </p>
              </div>
              <div className="product-spec-card product-empty-reviews">
                <Icon name="heart" />
                <strong>Отзывов пока нет</strong>
                <p>Станьте первым, кто поделится впечатлением.</p>
              </div>
            </div>
          ) : (
            <div className="product-details-content">
              <div className="product-description">
                <h2>{detail.sectionTitle}</h2>
                <p>{detail.description}</p>
                <small>
                  Описание и характеристики демонстрационные.
                  <br />
                  Перед запуском заменить данными поставщика.
                </small>
              </div>
              <div className="product-spec-card">
                {detail.specs.map(([label, value]) => (
                  <div className="product-spec-row" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        className="product-related-section product-container"
        aria-labelledby="product-related-title"
      >
        <div className="product-related-heading">
          <div>
            <p>ДЛЯ ВАШЕГО ПРОЕКТА</p>
            <h2 id="product-related-title">Дополните заказ</h2>
          </div>
          <Link to="/#products">
            Все товары <Icon name="arrow" />
          </Link>
        </div>
        <div className="product-related-grid">
          {[
            ...products.filter((item) => item.id !== "drill"),
            products.find((item) => item.id === "drill"),
          ].map((item) => (
            <article className="product-related-card" key={item.id}>
              <div className="product-related-image">
                <Link
                  to={`/product/${item.id}`}
                  aria-label={`Открыть товар: ${item.name}`}
                >
                  <img src={item.image} alt={item.name} loading="lazy" />
                </Link>
                <span>{item.badge}</span>
                <button
                  type="button"
                  className="product-related-favorite"
                  aria-label={
                    favorites.includes(item.id)
                      ? `Убрать ${item.name} из избранного`
                      : `Добавить ${item.name} в избранное`
                  }
                  aria-pressed={favorites.includes(item.id)}
                  onClick={() => toggleFavorite(item.id)}
                >
                  <Icon
                    name="heart"
                    className={
                      favorites.includes(item.id) ? "product-heart-active" : ""
                    }
                  />
                </button>
              </div>
              <p className="product-related-category">{item.category}</p>
              <h3>
                <Link to={`/product/${item.id}`}>{item.name}</Link>
              </h3>
              <p className="product-related-details">{item.details}</p>
              <div className="product-related-price">
                <strong>{formatPrice(item.price)}</strong>
                <span>сум / {item.unit}</span>
              </div>
              <div className="product-related-bottom">
                <span className="product-stock">
                  <span className="product-stock-dot" />В наличии
                </span>
                <button type="button" onClick={() => showAdded(item)}>
                  В корзину <Icon name="arrow" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {toast && (
        <div className="product-toast" role="status">
          <span>{toast}</span>
          <button
            type="button"
            onClick={() => {
              setToast("");
              openCart();
            }}
          >
            Посмотреть корзину
          </button>
          <button
            type="button"
            aria-label="Закрыть уведомление"
            onClick={() => setToast("")}
          >
            ×
          </button>
        </div>
      )}
      {imageOpen && (
        <div
          className="product-zoom-overlay"
          role="presentation"
          onClick={() => setImageOpen(false)}
        >
          <div
            className="product-zoom-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Увеличенное изображение товара"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setImageOpen(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
            <img src={product.image} alt={detail.title} />
          </div>
        </div>
      )}
    </div>
  );
}
