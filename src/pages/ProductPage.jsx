import ProductCard from "../components/ui/ProductCard.jsx";
import { useCatalog } from "../api/useCatalog.js";
import { useLanguage } from "../i18n/useLanguage.js";
import ShopImage from "../components/ui/ShopImage.jsx";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import Icon from "../components/home/Icon.jsx";
import { formatPrice } from "../components/home/homeData.js";
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
  const { items: products } = useCatalog();
  const { productId = "drill" } = useParams();
  const { t } = useLanguage();
  const product = products.find((item) => item.id === productId);
  if (!product)
    return (
      <section className="product-not-found product-container">
        <h1>{t("Товар не найден")}</h1>
        <p>{t("Проверьте ссылку или выберите товар в каталоге.")}</p>
        <Link className="home-button" to="/catalog">
          {t("Открыть каталог")}
        </Link>
      </section>
    );
  return (
    <ProductDetail key={product.id} product={product} products={products} />
  );
}

function ProductDetail({ product, products }) {
  const { t } = useLanguage();
  const detail = productDetails[product.id] || {
    title: product.name,
    eyebrow: product.category,
    article: "SU-" + product.id.toUpperCase(),
    chips: [product.details],
    sectionTitle: "Характеристики товара",
    description: product.details,
    specs: [
      ["Категория", product.category],
      ["Характеристики", product.details],
      ["Бренд", product.brand],
      ["Единица продажи", product.unit],
    ],
  };
  const { favorites, toggleFavorite, addToCart, openCart } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("specs");
  const [imageOpen, setImageOpen] = useState(false);
  const [compared, setCompared] = useState(false);
  const [toast, setToast] = useState("");
  const [comparisonId, setComparisonId] = useState(
    () => products.find((item) => item.id !== product.id)?.id || product.id,
  );
  const comparison =
    products.find((item) => item.id === comparisonId) || product;
  const zoomPanel = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (!imageOpen) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    zoomPanel.current?.querySelector("button")?.focus();
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setImageOpen(false);
      if (event.key === "Tab") {
        event.preventDefault();
        zoomPanel.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [imageOpen]);
  const favorite = favorites.includes(product.id);
  const showAdded = (item, count = 1) => {
    addToCart(item, count);
    setToast(`${item.name} добавлен в корзину (${count} шт.)`);
  };

  return (
    <div className="product-page" id="product-page">
      <div className="product-container product-top">
        <nav
          className="product-breadcrumbs"
          aria-label={t("Навигация по каталогу")}
        >
          <Link to="/">{t("Главная")}</Link>
          <span>/</span>
          <Link to={"/catalog?category=" + product.categoryId}>
            {t(
              product.group === "tools"
                ? "Инструменты"
                : product.group === "renovate"
                  ? "Отделка"
                  : "Стройматериалы",
            )}
          </Link>
          <span>/</span>
          <span>
            {t(product.id === "drill" ? "Дрели-шуруповёрты" : product.name)}
          </span>
        </nav>
        <section
          className="product-main-grid"
          aria-label={t("Информация о товаре")}
        >
          <div className="product-gallery">
            <button
              type="button"
              className="product-hero-image"
              onClick={() => setImageOpen(true)}
              aria-label={t(`Увеличить изображение: ${product.name}`)}
            >
              <ShopImage src={product.image} alt={t(detail.title)} width="800" height="800" />
              <span className="product-image-badge">{t(product.badge)}</span>
            </button>
            <div className="product-gallery-controls">
              <button
                type="button"
                className="product-thumbnail"
                aria-label={t("Показать общий вид товара")}
                onClick={() => setImageOpen(true)}
              >
                <ShopImage src={product.image} alt="" width="80" height="80" />
              </button>
              <span className="product-gallery-hint">
                {t("Нажмите на изображение для увеличения")}
              </span>
              <button
                type="button"
                className="product-view-control"
                onClick={() => setImageOpen(true)}
              >
                <Icon name="search" /> <span>{t("Общий вид")}</span>
              </button>
            </div>
          </div>
          <div className="product-information">
            <p className="product-eyebrow">{t(detail.eyebrow)}</p>
            <h1>{t(detail.title)}</h1>
            <p className="product-article">
              {t("Артикул: ")}
              {t(detail.article)}
              {t(" · Демонстрационный товар")}
            </p>
            <div className="product-chips">
              {detail.chips.map((chip) => (
                <span key={chip}>{t(chip)}</span>
              ))}
            </div>
            <div className="product-buy-card">
              <div className="product-price">
                <strong>{t(formatPrice(product.price))}</strong>
                <span>
                  {t("сум / ")}
                  {t(product.unit)}
                </span>
              </div>
              <span className="product-stock">
                <span className="product-stock-dot" />
                {t(product.inStock ? "В наличии" : "Нет в наличии")}
              </span>
              <div className="product-purchase-controls">
                <div
                  className="product-stepper"
                  aria-label={t("Количество товара")}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => Math.max(1, value - 1))
                    }
                    aria-label={t("Уменьшить количество")}
                    disabled={quantity === 1}
                  >
                    −
                  </button>
                  <span aria-live="polite">{t(quantity)}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => Math.min(999, value + 1))
                    }
                    aria-label={t("Увеличить количество")}
                    disabled={quantity === 999}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="product-add-button"
                  onClick={() => showAdded(product, quantity)}
                  disabled={!product.inStock}
                >
                  {t("Добавить в корзину ")}
                  <Icon name="arrow" />
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
                  {t(favorite ? "В избранном" : "В избранное")}
                </button>
                <button
                  type="button"
                  onClick={() => setCompared((value) => !value)}
                  aria-pressed={compared}
                >
                  <Icon name="layers" />
                  {t(compared ? "В сравнении" : "Сравнить")}
                </button>
              </div>
              <p className="product-price-note">
                {t("Цена указана как пример для макета.")}
              </p>
            </div>
            {compared && (
              <section
                className="product-comparison"
                aria-label={t("Сравнение товаров")}
              >
                <label>
                  {t("Сравнить с")}
                  <select
                    value={comparisonId}
                    onChange={(event) => setComparisonId(event.target.value)}
                  >
                    {products
                      .filter((item) => item.id !== product.id)
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {t(item.name)}
                        </option>
                      ))}
                  </select>
                </label>
                <div className="product-comparison-scroll">
                  <table>
                    <caption>{t("Сравнение товаров")}</caption>
                    <thead>
                      <tr>
                        <th scope="col">{t("Характеристики")}</th>
                        <th scope="col">{t(product.name)}</th>
                        <th scope="col">{t(comparison.name)}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        [
                          "Цена, сум",
                          formatPrice(product.price),
                          formatPrice(comparison.price),
                        ],
                        [
                          "Категория",
                          t(product.category),
                          t(comparison.category),
                        ],
                        [
                          "Характеристики",
                          t(product.details),
                          t(comparison.details),
                        ],
                        [
                          "Единица продажи",
                          t(product.unit),
                          t(comparison.unit),
                        ],
                      ].map(([label, left, right]) => (
                        <tr key={label}>
                          <th scope="row">{t(label)}</th>
                          <td>{left}</td>
                          <td>{right}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
            <div className="product-delivery-note">
              <Icon name="truck" />
              <div>
                <strong>{t("Доставка в Бухару")}</strong>
                <p>
                  {t("Срок и стоимость рассчитываются при оформлении.")}
                  <br />
                  {t("Также доступен самовывоз.")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section
        className="product-details-band"
        aria-label={t("Описание и характеристики")}
      >
        <div className="product-container">
          <div
            className="product-tabs"
            role="tablist"
            aria-label={t("Информация о товаре")}
          >
            {tabItems.map(([id, title], index) => (
              <button
                type="button"
                key={id}
                role="tab"
                id={"product-tab-" + id}
                aria-controls="product-tab-panel"
                tabIndex={activeTab === id ? 0 : -1}
                onKeyDown={(event) => {
                  const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
                  if (!keys.includes(event.key)) return;
                  event.preventDefault();
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? tabItems.length - 1
                        : (index +
                            (event.key === "ArrowRight" ? 1 : -1) +
                            tabItems.length) %
                          tabItems.length;
                  setActiveTab(tabItems[next][0]);
                  document
                    .getElementById("product-tab-" + tabItems[next][0])
                    ?.focus();
                }}
                aria-selected={activeTab === id}
                className={activeTab === id ? "is-active" : ""}
                onClick={() => setActiveTab(id)}
              >
                {t(title)}
              </button>
            ))}
          </div>
          <div
            id="product-tab-panel"
            role="tabpanel"
            aria-labelledby={"product-tab-" + activeTab}
            tabIndex={0}
          >
            {t(
              activeTab === "delivery" ? (
                <div className="product-details-content">
                  <div className="product-description">
                    <h2>{t("Доставка и оплата")}</h2>
                    <p>
                      {t(
                        "Доставим заказ по Бухаре и другим городам Узбекистана. Точные сроки и стоимость зависят от адреса и состава заказа.",
                      )}
                    </p>
                  </div>
                  <div className="product-spec-card">
                    <div className="product-spec-row">
                      <span>{t("Доставка")}</span>
                      <strong>{t("По Узбекистану")}</strong>
                    </div>
                    <div className="product-spec-row">
                      <span>{t("Самовывоз")}</span>
                      <strong>{t("Доступен")}</strong>
                    </div>
                    <div className="product-spec-row">
                      <span>{t("Стоимость")}</span>
                      <strong>{t("Рассчитывается при оформлении")}</strong>
                    </div>
                  </div>
                </div>
              ) : activeTab === "reviews" ? (
                <ProductReviews productId={product.id} />
              ) : activeTab === "description" ? (
                <div className="product-description">
                  <h2>{t(detail.sectionTitle)}</h2>
                  <p>{t(detail.description)}</p>
                </div>
              ) : (
                <div className="product-details-content">
                  <div className="product-description">
                    <h2>{t(detail.sectionTitle)}</h2>
                    <p>{t(detail.description)}</p>
                    <small>
                      {t("Описание и характеристики демонстрационные.")}
                      <br />
                      {t("Перед запуском заменить данными поставщика.")}
                    </small>
                  </div>
                  <div className="product-spec-card">
                    {detail.specs.map(([label, value]) => (
                      <div className="product-spec-row" key={label}>
                        <span>{t(label)}</span>
                        <strong>{t(value)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section
        className="product-related-section product-container"
        aria-labelledby="product-related-title"
      >
        <div className="product-related-heading">
          <div>
            <p>{t("ДЛЯ ВАШЕГО ПРОЕКТА")}</p>
            <h2 id="product-related-title">{t("Дополните заказ")}</h2>
          </div>
          <Link to="/catalog">
            {t("Все товары ")}
            <Icon name="arrow" />
          </Link>
        </div>
        <div className="product-related-grid">
          {products
            .filter((item) => item.id !== product.id)
            .sort(
              (a, b) =>
                Number(b.categoryId === product.categoryId) -
                Number(a.categoryId === product.categoryId),
            )
            .slice(0, 4)
            .map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                favorite={favorites.includes(item.id)}
                onFavorite={toggleFavorite}
                onAdd={showAdded}
              />
            ))}
        </div>
      </section>

      {t(
        toast && (
          <div className="product-toast" role="status">
            <span>{t(toast)}</span>
            <button
              type="button"
              onClick={() => {
                setToast("");
                openCart();
              }}
            >
              {t("Посмотреть корзину")}
            </button>
            <button
              type="button"
              aria-label={t("Закрыть уведомление")}
              onClick={() => setToast("")}
            >
              ×
            </button>
          </div>
        ),
      )}
      {t(
        imageOpen && (
          <div
            className="product-zoom-overlay"
            role="presentation"
            onClick={() => setImageOpen(false)}
          >
            <div
              className="product-zoom-panel"
              ref={zoomPanel}
              role="dialog"
              aria-modal="true"
              aria-label={t("Увеличенное изображение товара")}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setImageOpen(false)}
                aria-label={t("Закрыть")}
              >
                ×
              </button>
              <ShopImage src={product.image} alt={t(detail.title)} width="800" height="800" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}

function ProductReviews({ productId }) {
  const { t, language } = useLanguage();
  const storageKey = "stroy-uz-reviews:" + productId;
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(saved)
        ? saved
            .filter(
              (review) =>
                typeof review.name === "string" &&
                typeof review.text === "string" &&
                Number.isInteger(review.rating) &&
                review.rating >= 1 &&
                review.rating <= 5,
            )
            .slice(0, 100)
        : [];
    } catch {
      return [];
    }
  });
  const [message, setMessage] = useState("");
  const average = reviews.length
    ? (
        reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      ).toLocaleString(language, { maximumFractionDigits: 1 })
    : "—";
  return (
    <div className="product-reviews">
      <div>
        <h2>{t("Отзывы покупателей")}</h2>
        <p className="product-reviews-summary">
          {t("Средняя оценка")}: {average} / 5
        </p>
        {reviews.length ? (
          reviews.map((review, index) => (
            <article className="product-review" key={index}>
              <strong>{review.name}</strong>
              <span aria-label={t("Оценка") + ": " + review.rating + " / 5"}>
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </span>
              <p>{review.text}</p>
            </article>
          ))
        ) : (
          <p>{t("Отзывов пока нет")}</p>
        )}
      </div>
      <form
        className="product-review-form"
        onSubmit={(event) => {
          event.preventDefault();
          const form = event.currentTarget;
          const data = new FormData(form);
          const name = String(data.get("name")).trim(),
            text = String(data.get("text")).trim(),
            rating = Number(data.get("rating"));
          if (!name || text.length < 10) {
            setMessage("Укажите имя и напишите отзыв минимум из 10 символов.");
            return;
          }
          const next = [{ name, text, rating }, ...reviews].slice(0, 100);
          setReviews(next);
          try {
            localStorage.setItem(storageKey, JSON.stringify(next));
            setMessage("Спасибо! Ваш отзыв добавлен.");
          } catch {
            setMessage(
              "Отзыв добавлен, но браузер не разрешил сохранить его после перезагрузки.",
            );
          }
          form.reset();
        }}
      >
        <h3>{t("Оставить отзыв")}</h3>
        <p>{t("Отзывы сохраняются только в этом браузере.")}</p>
        <label>
          {t("Ваше имя")}
          <input name="name" required maxLength={80} autoComplete="name" />
        </label>
        <label>
          {t("Оценка")}
          <select name="rating" defaultValue="5">
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} / 5
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("Ваш отзыв")}
          <textarea
            name="text"
            required
            minLength={10}
            maxLength={2000}
            rows={4}
          />
        </label>
        <button type="submit" className="product-add-button">
          {t("Добавить отзыв")}
        </button>
        <p role="status">{t(message)}</p>
      </form>
    </div>
  );
}
