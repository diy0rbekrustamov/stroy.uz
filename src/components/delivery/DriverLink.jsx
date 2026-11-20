import { useState } from "react";
import { api } from "../../api/client.js";
import { useLanguage } from "../../i18n/useLanguage.js";
import Button from "../ui/Button.jsx";
import "./delivery.css";

export default function DriverLink({ item }) {
  const { t } = useLanguage();
  const [link,setLink] = useState(""), [message,setMessage] = useState(""), [busy,setBusy] = useState(false);
  if (!["accepted","shipped"].includes(item.status)) return null;
  async function change(revoke = false) {
    setBusy(true);setMessage("");
    try {
      const result = await api(`/seller/orders/${item.id}/driver`, {method:revoke ? "DELETE" : "POST",body:{}});
      setLink(revoke ? "" : `${location.origin}/delivery/driver#${result.token}`);
      setMessage(revoke ? "Ссылка водителя отключена." : "Ссылка действует 24 часа. Передайте её только водителю.");
    } catch(e){setMessage(e.message);}finally{setBusy(false);}
  }
  return <div className="delivery-driver-controls"><strong>{t("Отслеживание доставки")}</strong>
    <p className="delivery-muted">{t("Водитель открывает ссылку на своём телефоне и включает передачу координат после отправки заказа.")}</p>
    <Button disabled={busy} onClick={()=>change()} variant="secondary">{t("Создать ссылку водителю")}</Button>
    <Button disabled={busy} onClick={()=>change(true)} variant="secondary">{t("Отключить ссылку")}</Button>
    {link && <label>{t("Ссылка водителю")}<input readOnly value={link} onFocus={e=>e.target.select()}/></label>}
    <p role="status" className="delivery-muted">{t(message)}</p>
  </div>;
}
