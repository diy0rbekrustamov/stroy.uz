import { useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { useCatalog } from "../api/useCatalog.js";
import { useSession } from "../api/useSession.js";
import { api } from "../api/client.js";
import { rentalDays } from "../data/rentalCatalog.js";
import { useLanguage } from "../i18n/useLanguage.js";
import ShopImage from "../components/ui/ShopImage.jsx";
import Button from "../components/ui/Button.jsx";
import { PageLoading } from "../components/ui/PageState.jsx";
import "./CatalogPage.css";
import "./ServicesPage.css";
import "./RentalsPage.css";

export default function RentalPage() {
  const { rentalId } = useParams();
  return <RentalDetails key={rentalId} rentalId={rentalId} />;
}

function RentalDetails({ rentalId }) {
  const { items, loading, remote } = useCatalog("rentals");
  const { user } = useSession();
  const { t, language } = useLanguage();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(null);
  const [busy, setBusy] = useState(false);
  const [today] = useState(() => new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date()));
  const submission = useRef(null);
  const item = items.find((machine) => machine.id === rentalId);
  if (!item && loading) return <PageLoading />;
  if (!item)
    return (
      <section className="page-state">
        <h1>{t("Техника не найдена")}</h1>
        <Button to="/rentals">{t("Аренда техники")}</Button>
      </section>
    );
  const days = rentalDays(start, end);
  const minDays = item.minDays || 1;

  const valid = days >= minDays && start >= today;
  const format = (value) => new Intl.NumberFormat(language).format(value);
  return (
    <div className="market-page service-page">
      <div className="market-container">
        <Link to="/rentals" className="auth-back">
          ← {t("Аренда техники")}
        </Link>
        <header className="market-catalog-heading">
          <h1>{t(item.name)}</h1>
          <p>
            {t(item.city)} · {t(item.category)}
          </p>
        </header>
        {item.demo && (
          <p className="service-demo">
            {t(
              "Демонстрационная техника: изображения и цены приведены для примера. Заявки на неё не принимаются.",
            )}
          </p>
        )}
        <div className="service-page-grid">
          <div className="service-description">
            <ShopImage
              className="service-photo"
              src={item.image}
              alt={t(item.name)}
              width="800"
              height="600"
            />
            <section>
              <h2>{t("Условия аренды")}</h2>
              <p>
                {t("Характеристики")}: {t(item.capacity)}
              </p>
              <p>
                {t(item.operatorIncluded ? "С оператором" : "Без оператора")}
              </p>
              <p>
                {t(
                  item.deliveryAvailable
                    ? "Доставка обсуждается отдельно"
                    : "Самовывоз / подача по согласованию",
                )}
              </p>
              <p>
                {t("Минимум суток")}: {minDays}
              </p>
              {item.description && <p>{t(item.description)}</p>}
            </section>
            <section>
              <h2>{t("До подтверждения согласуйте")}</h2>
              <p>
                {t(
                  "Рабочие часы в сутки, топливо, подачу и возврат, залог и ответственность за повреждения согласуйте с владельцем. Расчёт на сайте предварительный.",
                )}
              </p>
            </section>
          </div>
          <form
            className="service-request"
            key={rentalId}
            onSubmit={async (event) => {
              event.preventDefault();
              if (busy || saved || !valid || !remote || item.demo || !user)
                return;
              const data = new FormData(event.currentTarget);
              const input = {
                name: data.get("name"),
                phone: data.get("phone"),
                address: data.get("address"),
                startDate: start,
                endDate: end,
                task: data.get("task"),
                consent: data.has("consent"),
              };
              const fingerprint = JSON.stringify({ id: item.id, ...input });
              if (submission.current?.fingerprint !== fingerprint)
                submission.current = { fingerprint, key: crypto.randomUUID() };
              setBusy(true);
              setMessage("");
              try {
                const result = await api("/rentals/" + item.id + "/requests", {
                  method: "POST",
                  body: { ...input, idempotencyKey: submission.current.key },
                });
                setSaved(result.request.id);
              } catch (error) {
                setMessage(error.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            <h2>{t("Заявка на аренду")}</h2>
            <strong>
              {format(item.price)} {t("сум")} / {t("сутки")}
            </strong>
            <div className="rental-dates">
              <label className="auth-field">
                {t("Начало аренды")}
                <input
                  type="date"
                  required
                  min={today}
                  value={start}
                  onInput={(event) => setStart(event.currentTarget.value)}
                  disabled={!!saved}
                />
              </label>
              <label className="auth-field">
                {t("Окончание аренды")}
                <input
                  type="date"
                  required
                  min={start || today}
                  value={end}
                  onInput={(event) => setEnd(event.currentTarget.value)}
                  disabled={!!saved}
                />
              </label>
            </div>
            <p className="rental-summary">
              {t("Суток")}: {days} · {t("Предварительно")}:{" "}
              {format(days * item.price)} {t("сум")}
            </p>
            <p>
              {t(
                "Даты включительно. До 365 суток, с учётом минимального срока аренды.",
              )}
            </p>
            {start && end && !valid && (
              <p role="status">
                {t(
                  days > 0 && days < minDays
                    ? "Период меньше минимального срока аренды."
                    : "Проверьте даты аренды.",
                )}
              </p>
            )}
            <label className="auth-field">
              {t("Имя")}
              <input
                name="name"
                required
                maxLength="100"
                defaultValue={user?.name || ""}
                autoComplete="name"
                disabled={!!saved}
              />
            </label>
            <label className="auth-field">
              {t("Телефон")}
              <input
                name="phone"
                type="tel"
                required
                maxLength="24"
                placeholder="+998 XX XXX XX XX"
                defaultValue={user?.phone || ""}
                autoComplete="tel"
                disabled={!!saved}
              />
            </label>
            <label className="auth-field">
              {t("Адрес объекта")}
              <input
                name="address"
                required
                maxLength="300"
                autoComplete="street-address"
                disabled={!!saved}
              />
            </label>
            <label className="auth-field">
              {t("Задача")}
              <textarea
                name="task"
                required
                minLength="10"
                maxLength="2000"
                rows="3"
                disabled={!!saved}
              />
            </label>
            <label className="auth-checkbox">
              <input
                name="consent"
                type="checkbox"
                required
                disabled={!!saved}
              />
              {t("Подтверждаю контактные данные для заявки.")}
            </label>
            {!user && !item.demo && <Button to="/login">{t("Войти")}</Button>}
            <Button
              type="submit"
              disabled={
                busy || !!saved || !valid || !remote || !!item.demo || !user
              }
            >
              {t(busy ? "Отправка…" : "Отправить заявку")}
            </Button>
            <p className="auth-note">
              {t(
                "Отправка заявки не резервирует технику и не списывает деньги. Дождитесь подтверждения владельца.",
              )}
            </p>
            {saved && (
              <div role="status">
                <p>
                  {t("Заявка сохранена.")} #{saved.slice(0, 8)}
                </p>
                <Button to="/account">{t("Мои заявки")}</Button>
              </div>
            )}
            <p role="status">{t(message)}</p>
          </form>
        </div>
      </div>
    </div>
  );
}
