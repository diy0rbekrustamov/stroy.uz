import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../api/client.js";
import { useSession } from "../api/useSession.js";
import { useLanguage } from "../i18n/useLanguage.js";
import Button from "../components/ui/Button.jsx";
import { statusLabel } from "../api/status.js";
export default function AccountPage() {
  const { t } = useLanguage(),
    { user, loading } = useSession(),
    navigate = useNavigate();
  const [orders, setOrders] = useState([]),
    [requests, setRequests] = useState([]),
    [message, setMessage] = useState("");
  useEffect(() => {
    if (user)
      Promise.all([api("/orders"), api("/requests")])
        .then(([o, r]) => {
          setOrders(o.orders);
          setRequests(r.items);
        })
        .catch((error) => setMessage(error.message));
  }, [user]);
  if (loading) return <p role="status">{t("Загрузка…")}</p>;
  if (!user)
    return (
      <div className="market-page market-container">
        <h1>{t("Личный кабинет")}</h1>
        <Button to="/login">{t("Войти")}</Button>
      </div>
    );
  return (
    <div className="market-page">
      <div className="market-container">
        <h1>{t("Личный кабинет")}</h1>
        <p>
          {user.name} · {user.email}
        </p>
        <Button to="/seller">{t(user.role === "seller" ? "Кабинет продавца" : "Стать продавцом")}</Button>{" "}
        <Button
          variant="secondary"
          onClick={async () => {
            try {
              await api("/auth/logout", { method: "POST", body: {} });
              navigate("/login");
            } catch (error) {
              setMessage(error.message);
            }
          }}
        >
          {t("Выйти")}
        </Button>
        <h2>{t("Мои заказы")}</h2>
        {!orders.length && <p>{t("Пока пусто")}</p>}
        {orders.map((order) => (
          <section className="auth-info" key={order.id}>
            <strong>#{order.id.slice(0, 8)}</strong>
            <p>
              {new Date(order.created_at).toLocaleDateString()} · {order.total}{" "}
              {t("сум")}
            </p>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>
                  {t(item.name)} × {item.quantity} —{" "}
                  {t(statusLabel(item.status))}
                </li>
              ))}
            </ul>
          </section>
        ))}
        <h2>{t("Мои заявки")}</h2>
        {!requests.length && <p>{t("Пока пусто")}</p>}
        {requests.map((request) => (
          <section className="auth-info" key={request.id}>
            <strong>#{request.id.slice(0, 8)}</strong>
            <p>{request.data.task}</p>
            {request.data.kind === "rental" && <p>{t(request.data.name)} · {request.data.startDate} — {request.data.endDate} · {request.data.days} {t("сутки")}</p>}
            <p>{t(statusLabel(request.status))}</p>
          </section>
        ))}
        <p role="status">{t(message)}</p>
      </div>
    </div>
  );
}
