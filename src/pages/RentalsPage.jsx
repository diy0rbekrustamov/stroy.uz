import { ListingState, DemoNotice } from "../components/ui/ListingState.jsx";
import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useCatalog } from "../api/useCatalog.js";
import { useLanguage } from "../i18n/useLanguage.js";
import { matchesProduct } from "../i18n/translate.js";
import { equipmentTypes } from "../data/rentalCatalog.js";
import ShopImage from "../components/ui/ShopImage.jsx";
import Button from "../components/ui/Button.jsx";
import { CatalogNotice } from "../components/ui/PageState.jsx";
import "./CatalogPage.css";
import "./RentalsPage.css";

export default function RentalsPage() {
  const { items, error, loading } = useCatalog("rentals");
  const { t, language } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const change = (key, value) =>
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  const cities = [...new Set(items.map((item) => item.city))];
  const filtered = items.filter(
    (item) =>
      (!params.get("type") || item.equipmentType === params.get("type")) &&
      (!params.get("city") || item.city === params.get("city")) &&
      (!params.get("operator") || item.operatorIncluded) &&
      matchesProduct(item, params.get("q") || ""),
  );
  const sorted = [...filtered].sort((a, b) =>
    params.get("sort") === "price"
      ? a.price - b.price
      : a.name.localeCompare(b.name),
  );
  if (!loading && !error && !items.length) return <div className="market-page market-container"><h1>{t("Аренда техники")}</h1><ListingState empty/></div>;
  if (loading || error) return <div className="market-page market-container"><h1>{t("Аренда техники")}</h1><ListingState loading={loading} error={error}/></div>;
  return (
    <div className="market-page rental-page">
      <div className="market-container">
        <Link className="auth-back" to="/">
          {t("Главная")} ←
        </Link>
        <header className="market-catalog-heading">
          <p className="rental-eyebrow">STROY UZ / RENTAL</p>
          <h1>{t("Аренда техники")}</h1>
          <p>{t("Краны, самосвалы и экскаваторы для вашего объекта.")}</p>
        </header>
        <DemoNotice items={items} />
        <CatalogNotice
          error={items.every((item) => item.demo) ? null : error}
          loading={loading}
        />
        <div className="market-category-pills" aria-label={t("Тип техники")}>
          {[["", "Вся техника"], ...Object.entries(equipmentTypes)].map(
            ([id, label]) => (
              <button
                key={id}
                aria-pressed={(params.get("type") || "") === id}
                onClick={() => change("type", id)}
              >
                {t(label)}
              </button>
            ),
          )}
        </div>
      <button className="rental-filter-toggle" aria-expanded={filtersOpen} aria-controls="rental-filters" onClick={()=>setFiltersOpen(value=>!value)}>{t("Фильтры")} <span aria-hidden="true">{filtersOpen ? "−" : "+"}</span></button>
      <div className="rental-toolbar" id="rental-filters" data-open={filtersOpen}>
          <label>
            {t("Поиск техники")}
            <input
              value={params.get("q") || ""}
              onChange={(event) => change("q", event.target.value)}
              type="search"
            />
          </label>
          <label>
            {t("Город")}
            <select
              value={params.get("city") || ""}
              onChange={(event) => change("city", event.target.value)}
            >
              <option value="">{t("Все города")}</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {t(city)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("Сортировка")}
            <select
              value={params.get("sort") || ""}
              onChange={(event) => change("sort", event.target.value)}
            >
              <option value="">{t("По названию")}</option>
              <option value="price">{t("Сначала дешевле")}</option>
            </select>
          </label>
          <label className="rental-checkbox">
            <input
              type="checkbox"
              checked={!!params.get("operator")}
              onChange={(event) =>
                change("operator", event.target.checked ? "1" : "")
              }
            />
            {t("С оператором")}
          </label>
          <Button variant="secondary" onClick={() => setParams({})}>
            {t("Сбросить фильтры")}
          </Button>
        </div>
        <p role="status">
          {t("Найдено:")} {sorted.length}
        </p>
        {!loading && !sorted.length && (
          <section className="market-empty-result">
            <h2>{t("Техника не найдена")}</h2>
            <p>{t("Попробуйте изменить фильтры.")}</p>
          </section>
        )}
        <div className="rental-grid">
          {sorted.map((item) => (
            <article className="rental-card" key={item.id}>
              <Link to={"/rentals/" + item.id}>
                <ShopImage
                  src={item.image}
                  width="800"
                  height="600"
                  loading="lazy"
                  alt={t(item.name)}
                />
              </Link>
              <div className="rental-card-body">
                <p>
                  {t(item.city)} ·{" "}
                  {t(equipmentTypes[item.equipmentType] || item.category)}
                </p>
                <h2>
                  <Link to={"/rentals/" + item.id}>{t(item.name)}</Link>
                </h2>
                <p>
                  {t("Характеристики")}: {t(item.capacity)}
                </p>
                <p>
                  {t(item.operatorIncluded ? "С оператором" : "Без оператора")}
                </p>
                {item.demo && <span className="rental-demo">{t("ДЕМО")}</span>}
                <strong>
                  {new Intl.NumberFormat(language).format(item.price)}{" "}
                  {t("сум")} / {t("сутки")}
                </strong>
                <Button to={"/rentals/" + item.id}>
                  {t("Условия аренды")}
                </Button>
              </div>
            </article>
          ))}
        </div>
        <aside className="rental-explainer">
          <h2>{t("Как арендовать технику")}</h2>
          <p>
            {t(
              "Выберите машину и даты, отправьте заявку. Владелец подтвердит доступность и итоговую стоимость. Отправка заявки не является оплатой или бронированием.",
            )}
          </p>
          <Button to="/seller/rentals">{t("Сдать технику в аренду")}</Button>
        </aside>
      </div>
    </div>
  );
}
