import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { useLanguage } from "../../i18n/useLanguage.js";
import Button from "../ui/Button.jsx";
import { statusLabel, statusAction } from "../../api/status.js";
export default function ApiOrders() {
  const { t } = useLanguage(),
    [orders, setOrders] = useState([]),
    [requests, setRequests] = useState([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const reload = () =>
    Promise.all([api("/seller/orders"), api("/seller/requests")]).then(
      ([o, r]) => {
        setOrders(o.items);
        setRequests(r.items);
      },
    );
  useEffect(() => {
    reload().catch((error) => setMessage(error.message));
  }, []);
  const change = async (kind, id, status) => {
    if (busy) return;
    setBusy(true);
    try {
      await api("/seller/" + kind + "/" + id, {
        method: "PATCH",
        body: { status },
      });
      await reload();
      setMessage("Изменения сохранены.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="auth-panel" style={{ width: "100%" }}>
      <h1>{t("Заказы и заявки")}</h1>
      <p role="status">{t(message)}</p>
      {!orders.length && !requests.length && <p>{t("Пока пусто")}</p>}
      {[
        ...orders.map((item) => ({ ...item, kind: "orders" })),
        ...requests.map((item) => ({ ...item, kind: "requests" })),
      ].map((item) => (
        <article className="auth-info" key={item.id} style={{ marginTop: 16 }}>
          <h2>{item.name}</h2>
          <p>
            #{item.id.slice(0, 8)} · {t(statusLabel(item.status))}
          </p>
          <p>
            {item.kind === "orders"
              ? item.address + " · " + item.phone
              : item.data.address + " · " + item.data.phone}
          </p>
          <p>
            {item.kind === "orders"
              ? item.quantity + " × " + item.price
              : item.data.task}
          </p>
          {(item.status === "new"
            ? ["accepted", "cancelled"]
            : item.status === "accepted"
              ? [item.kind === "orders" ? "shipped" : "completed", "cancelled"]
              : item.status === "shipped"
                ? ["completed"]
                : []
          ).map((status) => (
            <Button
              key={status}
              disabled={busy}
              onClick={() => change(item.kind, item.id, status)}
            >
              {t(statusAction(status))}
            </Button>
          ))}
        </article>
      ))}
    </section>
  );
}
