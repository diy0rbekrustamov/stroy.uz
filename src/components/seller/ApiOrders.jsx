import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { useLanguage } from "../../i18n/useLanguage.js";
import Button from "../ui/Button.jsx";
import { statusLabel, statusAction } from "../../api/status.js";
import DriverLink from "../delivery/DriverLink.jsx";
export default function ApiOrders() {
  const { t } = useLanguage(),
    [orders, setOrders] = useState([]),
    [requests, setRequests] = useState([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [loading,setLoading]=useState(true), [filter,setFilter]=useState("all"), [query,setQuery]=useState(""), [revision,setRevision]=useState(0);
  const reload = () =>
    Promise.all([api("/seller/orders"), api("/seller/requests")]).then(
      ([o, r]) => {
        setOrders(o.items);
        setRequests(r.items);
      },
    );
  useEffect(() => {
    let active=true; setLoading(true); setMessage("");
    Promise.all([api("/seller/orders"), api("/seller/requests")]).then(([o,r])=>{if(active){setOrders(o.items);setRequests(r.items);}}).catch(e=>{if(active)setMessage(e.message);}).finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  }, [revision]);
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
      <div className="workspace-toolbar"><label>{t("Поиск")}<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label><label>{t("Статус")}<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">{t("Все")}</option>{["new","accepted","shipped","completed","cancelled"].map(status=><option key={status} value={status}>{t(statusLabel(status))}</option>)}</select></label><Button disabled={loading||busy} variant="secondary" onClick={()=>setRevision(n=>n+1)}>{t("Обновить")}</Button></div>
      <p role="status">{t(loading ? "Загрузка…" : message)}</p>
      {!loading && !message && !orders.length && !requests.length && <p>{t("Пока пусто")}</p>}
      {[
        ...orders.map((item) => ({ ...item, kind: "orders" })),
        ...requests.map((item) => ({ ...item, kind: "requests" })),
      ].filter(item=>(filter==="all"||item.status===filter) && `${item.id} ${item.name || item.data?.name || ""} ${item.phone || item.data?.phone || ""}`.toLowerCase().includes(query.toLowerCase())).map((item) => (
        <article className="auth-info" key={item.id} style={{ marginTop: 16 }}>
          <h2>{t(item.name)}</h2>
          {item.kind === "orders" && <>
            {item.delivery?.point && <p>{t("Точка доставки")}: {item.delivery.point.lat}, {item.delivery.point.lng}</p>}
            {item.delivery?.note && <p>{item.delivery.note}</p>}
            <DriverLink item={item}/>
          </>}
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
          {item.data?.kind === "rental" && <p>{item.data.startDate} — {item.data.endDate} · {item.data.days} {t("сутки")} · {item.data.estimate} {t("сум")}</p>}
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
