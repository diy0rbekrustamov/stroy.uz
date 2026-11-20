import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { api } from "../api/client.js";
import { useLanguage } from "../i18n/useLanguage.js";
import { statusLabel } from "../api/status.js";
import Button from "../components/ui/Button.jsx";
import DeliveryMap from "../components/delivery/DeliveryMap.jsx";

export default function OrderDeliveryPage() {
  const { orderId } = useParams(), { t, language } = useLanguage();
  const [data, setData] = useState(null), [error, setError] = useState(""), [selected, setSelected] = useState(null), [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    let active = true, timer;
    const refresh = async () => {
      try { const result = await api(`/orders/${orderId}/delivery`); if(active){setData(result);setError("");setNow(Date.now());} }
      catch(e){if(active)setError(e.message);}
      if(active) timer = setTimeout(refresh, 15000);
    };
    refresh(); return () => {active=false;clearTimeout(timer);};
  }, [orderId]);
  const item = data?.items.find(item => item.id === selected) || data?.items[0];
  const recent = item?.sharing && item.updated_at && now - Date.parse(item.updated_at) < 90000;
  const stages = ["new","accepted","shipped","completed"];
  return <section className="delivery-page"><div className="delivery-container">
    <Link to="/account" className="delivery-back">← {t("Мои заказы")}</Link>
    <p className="delivery-eyebrow">{t("STROY UZ / ДОСТАВКА")}</p>
    <h1>{t("Доставка вашего заказа")}</h1>
    <p className="delivery-muted">{t("Статусы заказа и местоположение доставки в одном месте.")}</p>
    {error && <p role="alert" className="delivery-note">{t(error)} <Link to="/login">{t("Войти")}</Link></p>}
    {!data && !error && <p role="status">{t("Загрузка…")}</p>}
    {data && <div className="delivery-grid">
      <div className="delivery-card">
        <div className="delivery-section-heading"><div><h2>{t("Доставка заказа")} #{orderId.slice(0,8)}</h2><p>{data.order.address}</p></div><span className="delivery-note">{t(statusLabel(item?.status))}</span></div>
        <DeliveryMap point={data.order.delivery?.point} vehicle={item?.position}/>
        <div className="delivery-status"><span className="delivery-dot"/>{t(recent ? "Координаты обновляются" : item?.position ? "Последняя известная позиция" : "Водитель ещё не передаёт координаты")}</div>
        {item?.updated_at && <p className="delivery-muted">{t("Последнее обновление")}: {new Date(item.updated_at).toLocaleString(language)}</p>}
        {item?.status === "cancelled" ? <p>{t(statusLabel("cancelled"))}</p> : <ol className="delivery-timeline">{stages.map((stage,index)=><li key={stage} data-done={index <= stages.indexOf(item?.status)}>{t(statusLabel(stage))}</li>)}</ol>}
        {data.order.delivery?.note && <p className="delivery-note">{data.order.delivery.note}</p>}
        <p className="delivery-muted">{t("Позиция появится после отправки заказа и включения геолокации водителем. Время прибытия уточняйте у продавца.")}</p>
      </div>
      <aside className="delivery-card"><h2>{t("Отправления")}</h2><p className="delivery-muted">{t("Предложения разных продавцов могут приехать отдельно.")}</p>
        {data.items.map(shipment=><button type="button" className="delivery-shipment" key={shipment.id} aria-pressed={item?.id===shipment.id} onClick={()=>setSelected(shipment.id)}><strong>{t(shipment.name)}</strong><span>{shipment.seller_name}</span><span>{t(statusLabel(shipment.status))}</span></button>)}
        <Button to="/account" variant="secondary">{t("Личный кабинет")}</Button>
      </aside>
    </div>}
  </div></section>;
}
