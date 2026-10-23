import { useState } from "react";
import { Link, useParams } from "react-router";
import { useLanguage } from "../i18n/useLanguage.js";
import ShopImage from "../components/ui/ShopImage.jsx";
import { useCatalog } from "../api/useCatalog.js";
import { api } from "../api/client.js";
import Button from "../components/ui/Button.jsx";
import "./CatalogPage.css";
import "./ServicesPage.css";

export default function ServicePage() {
  const { items: serviceCatalog, remote } = useCatalog("services");
  const { serviceId } = useParams();
  const service = serviceCatalog.find((item) => item.id === serviceId);
  const { t, language } = useLanguage();
  const [quantity, setQuantity] = useState("40");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [today] = useState(() =>
    new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date()),
  );
  const format = (value) =>
    new Intl.NumberFormat(
      language === "uz" ? "uz-UZ" : language === "en" ? "en-US" : "ru-RU",
    ).format(value);
  const valid =
    Number(quantity) >= 0.01 &&
    Number(quantity) <= 100000 &&
    Number.isFinite(Number(quantity));
  if (!service)
    return (
      <div className="market-page">
        <div className="market-container market-empty-result">
          <h1>{t("Услуга не найдена")}</h1>
          <Button to="/services">{t("В каталог услуг")}</Button>
        </div>
      </div>
    );
  return (
    <div className="market-page service-page">
      <div className="market-container">
        <Link className="auth-back" to="/services">
          {t("В каталог услуг")} ←
        </Link>
        <header className="market-catalog-heading">
          <h1>{t(service.name)}</h1>
          <p>
            {t(service.category)} · {t(service.city)}
          </p>
        </header>
        <p className="service-demo">
          {t("Демо-каталог: услуги, цены и доступность показаны для примера.")}
        </p>
        <div className="service-page-grid">
          <div className="service-description">
            <ShopImage
              className="service-photo"
              src={service.image}
              alt={t(service.name)}
            />
            <section>
              <h2>{t("Что входит в работу")}</h2>
              <p>
                {t(
                  "Подготовку, объём работ и материалы согласуют до начала. Материалы и доставка рассчитываются отдельно.",
                )}
              </p>
              <p>
                {t(service.city)} ·{" "}
                {t(
                  service.available
                    ? "Доступно для заказа"
                    : "Временно недоступно",
                )}
              </p>
            </section>
            <section>
              <h2>{t("Исполнитель — демо")}</h2>
              <p>
                {t(
                  "Это пример профиля, а не подтверждённая компания. Контакты и отзывы исполнителя пока не подключены.",
                )}
              </p>
            </section>
            <section>
              <h2>{t("Как устроена заявка")}</h2>
              <ol>
                <li>{t("Опишите объект и объём работ.")}</li>
                <li>
                  {t("Согласуйте материалы, сроки и итоговую стоимость.")}
                </li>
                <li>{t("Подтвердите условия перед началом работ.")}</li>
              </ol>
            </section>
          </div>
          <form
            className="service-request"
            aria-label={t("Запросить смету")}
            onSubmit={async (event) => {
              event.preventDefault();
              if (busy) return;
              const data = new FormData(event.currentTarget);
              setBusy(true);
              setMessage("");
              try {
                const result = await api(
                  "/services/" + service.id + "/requests",
                  {
                    method: "POST",
                    body: {
                      name: data.get("name"),
                      phone: data.get("phone"),
                      address: data.get("address"),
                      quantity: Number(quantity),
                      ...(data.get("date") ? { date: data.get("date") } : {}),
                      task: data.get("task"),
                      consent: data.has("consent"),
                    },
                  },
                );
                setMessage("Заявка сохранена. Номер: " + result.request.id);
              } catch (error) {
                setMessage(error.message);
              } finally {
                setBusy(false);
              }
            }}
            onChange={() => setMessage("")}
          >
            <h2>{t("Запросить смету")}</h2>
            <strong>
              {t("От")} {format(service.price)} {t("сум")} / {t(service.unit)}
            </strong>
            <p className="auth-note">
              {t(
                "Итоговую цену и сроки согласуйте с исполнителем до начала работ.",
              )}
            </p>
            <label>
              {t("Ваше имя *")}
              <input
                name="name"
                required
                autoComplete="name"
                maxLength="100"
                placeholder={t("Введите имя")}
                pattern=".*\S.*"
              />
            </label>
            <label>
              {t("Телефон *")}
              <input
                name="phone"
                required
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="+998 XX XXX XX XX"
                pattern="\+998(?: ?[0-9]){9}"
                maxLength="22"
              />
            </label>
            <label>
              {t("Город и адрес объекта *")}
              <input
                name="address"
                required
                autoComplete="street-address"
                maxLength="250"
                pattern=".*\S.*"
              />
            </label>
            <label>
              {t("Объём работ")} ({t(service.unit)}) *
              <input
                name="quantity"
                required
                type="number"
                min="0.01"
                max="100000"
                step="any"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
            </label>
            <output aria-live="polite">
              {valid
                ? t("Предварительная стоимость") +
                  ": " +
                  format(Math.round(Number(quantity) * service.price)) +
                  " " +
                  t("сум")
                : t("Укажите объём от 0,01 до 100 000")}
            </output>
            <label>
              {t("Желаемая дата")}
              <input name="date" type="date" min={today} />
            </label>
            <label>
              {t("Задача *")}
              <textarea
                name="task"
                required
                minLength="10"
                maxLength="2000"
                rows="4"
                placeholder={t("Опишите объект и объём работ.")}
              />
            </label>
            <label className="service-available">
              <input type="checkbox" name="consent" required />
              {t("Согласен на обработку данных для заявки")}
            </label>
            <Button
              type="submit"
              disabled={!service.available || busy || !remote}
            >
              {t("Отправить заявку")}
            </Button>
            <p className="service-demo" role="status">
              {t(
                message ||
                  (!remote
                    ? "Сервис временно недоступен. Повторите позже."
                    : ""),
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
