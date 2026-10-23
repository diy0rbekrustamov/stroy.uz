import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useCatalog } from "../api/useCatalog.js";
import {
  serviceCategories,
  filterServices,
} from "../data/serviceCatalog.js";
import { useLanguage } from "../i18n/useLanguage.js";
import { CatalogBreadcrumbs } from "./CatalogPage.jsx";
import Button from "../components/ui/Button.jsx";
import "./CatalogPage.css";
import "./ServicesPage.css";

function ServiceDetails({ service, onClose }) {
  const { t, language } = useLanguage();
  const dialog = useRef(null);
  const [quantity, setQuantity] = useState("1");
  useEffect(() => {
    dialog.current.showModal();
  }, []);
  const valid =
    Number.isFinite(Number(quantity)) &&
    Number(quantity) > 0 &&
    Number(quantity) <= 100000;
  const format = (value) =>
    new Intl.NumberFormat(
      language === "uz" ? "uz-UZ" : language === "en" ? "en-US" : "ru-RU",
    ).format(value);
  return (
    <dialog
      ref={dialog}
      className="service-dialog"
      aria-labelledby="service-detail-title"
      onClose={onClose}
    >
      <button
        className="service-close"
        type="button"
        autoFocus
        onClick={() => dialog.current.close()}
        aria-label={t("Закрыть")}
      >
        ×
      </button>
      <img src={service.image} alt="" />
      <p className="service-meta">
        {t(service.category)} · {t(service.city)}
      </p>
      <h2 id="service-detail-title">{t(service.name)}</h2>
      <p>
        {t("Цена от")} {format(service.price)} {t("сум")} / {t(service.unit)}
      </p>
      <p>
        {t(service.available ? "Доступно для заказа" : "Временно недоступно")}
      </p>
      <label className="service-quantity">
        {t("Объём работ")} ({t(service.unit)})
        <input
          type="number"
          min="0.01"
          max="100000"
          step="any"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          aria-invalid={!valid}
        />
      </label>
      <output className="service-estimate" aria-live="polite">
        {valid
          ? t("Предварительная стоимость") +
            ": " +
            format(Math.round(Number(quantity) * service.price)) +
            " " +
            t("сум")
          : t("Укажите объём от 0,01 до 100 000")}
      </output>
      <p className="service-demo">
        {t(
          "Это демонстрационная услуга. Итоговую цену согласуют после оценки работ. Отправка заявок пока недоступна.",
        )}
      </p>
      <Button variant="secondary" onClick={() => dialog.current.close()}>
        {t("Закрыть")}
      </Button>
    </dialog>
  );
}

export default function ServicesPage() {
  const {items:serviceCatalog} = useCatalog("services");
  const { t, language } = useLanguage();
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const filtered = filterServices(serviceCatalog, params);
  const pages = Math.max(1, Math.ceil(filtered.length / 6));
  const rawPage = Number(params.get("page"));
  const page = Math.min(
    pages,
    Math.max(1, Number.isFinite(rawPage) ? Math.floor(rawPage) || 1 : 1),
  );
  const update = (changes) => {
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.delete("page");
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, String(value));
        else next.delete(key);
      }
      return next;
    });
  };
  const format = (value) =>
    new Intl.NumberFormat(
      language === "en" ? "en-US" : language === "uz" ? "uz-UZ" : "ru-RU",
    ).format(value);
  return (
    <div className="market-page services-page">
      <div className="market-container">
        <CatalogBreadcrumbs last="Услуги" />
        <header className="market-catalog-heading">
          <h1>{t("Услуги для вашего проекта")}</h1>
          <p>
            {t("Строительство, отделка и ремонт — выберите нужные работы.")}
          </p>
          <p className="service-demo">
            {t(
              "Демо-каталог: услуги, цены и доступность показаны для примера.",
            )}
          </p>
        </header>
        <div
          className="market-category-pills services-categories"
          aria-label={t("Категории услуг")}
        >
          {serviceCategories.map((category) => (
            <button
              type="button"
              key={category}
              aria-pressed={
                (params.get("category") || "Все услуги") === category
              }
              className={
                (params.get("category") || "Все услуги") === category
                  ? "is-active"
                  : ""
              }
              onClick={() =>
                update({ category: category === "Все услуги" ? "" : category })
              }
            >
              {t(category)}
            </button>
          ))}
        </div>
      </div>
      <div className="services-surface">
        <div className="market-container">
          <Button
            className="services-filter-toggle"
            variant="secondary"
            aria-expanded={filtersOpen}
            aria-controls="service-filters"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            {t("Фильтры")}
          </Button>
          <div className="market-catalog-layout">
            <form
              key={params.toString()}
              id="service-filters"
              className={
                "market-filters service-filters " +
                (filtersOpen ? "is-expanded" : "")
              }
              aria-label={t("Фильтры услуг")}
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                update({
                  city: data.get("city"),
                  min: data.get("min"),
                  max: data.get("max"),
                  available: data.has("available") ? "1" : "",
                });
                setFiltersOpen(false);
              }}
            >
              <h2>{t("Фильтры")}</h2>
              <label>
                {t("Город")}
                <select name="city" defaultValue={params.get("city") || ""}>
                  <option value="">{t("Все города")}</option>
                  {["Бухара", "Ташкент", "Самарканд"].map((city) => (
                    <option key={city} value={city}>
                      {t(city)}
                    </option>
                  ))}
                </select>
              </label>
              <fieldset className="market-filter-group">
                <legend>{t("Цена, сум")}</legend>
                <div className="market-price-controls">
                  <input
                    name="min"
                    type="number"
                    min="0"
                    aria-label={t("Цена от")}
                    placeholder={t("От")}
                    defaultValue={params.get("min") || ""}
                  />
                  <input
                    name="max"
                    type="number"
                    min="0"
                    aria-label={t("Цена до")}
                    placeholder={t("До")}
                    defaultValue={params.get("max") || ""}
                  />
                </div>
              </fieldset>
              <label className="service-available">
                <input
                  type="checkbox"
                  name="available"
                  defaultChecked={!!params.get("available")}
                />
                {t("Только доступные")}
              </label>
              <Button type="submit" variant="secondary">
                {t("Применить")}
              </Button>
              <button
                type="button"
                className="market-reset"
                onClick={() => setParams({})}
              >
                {t("Сбросить фильтры")}
              </button>
            </form>
            <section
              className="market-catalog-main"
              aria-label={t("Каталог услуг")}
            >
              <form
                className="services-search"
                role="search"
                onSubmit={(event) => {
                  event.preventDefault();
                  update({
                    q: new FormData(event.currentTarget).get("q").trim(),
                  });
                }}
              >
                <input
                  key={params.get("q") || ""}
                  name="q"
                  type="search"
                  aria-label={t("Поиск услуг")}
                  placeholder={t("Название услуги")}
                  defaultValue={params.get("q") || ""}
                />
                <Button type="submit" variant="secondary">
                  {t("Найти")}
                </Button>
              </form>
              <div className="services-toolbar">
                <p role="status">
                  {t("Найдено")}: {filtered.length}
                </p>
                <label>
                  {t("Сортировка")}
                  <select
                    value={params.get("sort") || "popular"}
                    onChange={(event) => update({ sort: event.target.value })}
                  >
                    <option value="popular">{t("Популярное")}</option>
                    <option value="price-asc">{t("Сначала дешевле")}</option>
                    <option value="price-desc">{t("Сначала дороже")}</option>
                  </select>
                </label>
              </div>
              {filtered.length ? (
                <div className="services-grid">
                  {filtered.slice((page - 1) * 6, page * 6).map((service) => (
                    <article className="service-card" key={service.id}>
                      <img
                        src={service.image}
                        alt=""
                        loading="lazy"
                        width="420"
                        height="240"
                      />
                      <div className="service-card-body">
                        <p className="service-meta">{t(service.category)}</p>
                        <h2>{t(service.name)}</h2>
                        <p className="service-meta">
                          {t(service.city)} ·{" "}
                          {t(
                            service.available
                              ? "Доступно для заказа"
                              : "Временно недоступно",
                          )}
                        </p>
                        <p className="service-price">
                          {t("От")} {format(service.price)}{" "}
                          <small>
                            {t("сум")} / {t(service.unit)}
                          </small>
                        </p>
                        <Button
                          to={`/services/${service.id}`}
                          aria-label={t("Подробнее") + ": " + t(service.name)}
                        >
                          {t("Подробнее")}
                        </Button>
                        <button
                          className="service-calculate"
                          type="button"
                          onClick={() => setSelected(service)}
                        >
                          {t("Рассчитать стоимость")}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="market-empty-result">
                  <h2>{t("Услуги не найдены")}</h2>
                  <p>{t("Измените поиск или фильтры.")}</p>
                  <Button onClick={() => setParams({})}>
                    {t("Сбросить фильтры")}
                  </Button>
                </div>
              )}
              {pages > 1 && (
                <nav
                  className="market-pagination"
                  aria-label={t("Страницы услуг")}
                >
                  {Array.from({ length: pages }, (_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={t("Страница") + " " + (index + 1)}
                      aria-current={page === index + 1 ? "page" : undefined}
                      onClick={() => update({ page: index + 1 })}
                    >
                      {index + 1}
                    </button>
                  ))}
                </nav>
              )}
            </section>
          </div>
        </div>
      </div>
      {selected && (
        <ServiceDetails
          key={selected.id}
          service={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
