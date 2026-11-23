import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useShop } from "../context/ShopContext.jsx";
import { useSession } from "../api/useSession.js";
import { useCatalog } from "../api/useCatalog.js";
import { api } from "../api/client.js";
import { useLanguage } from "../i18n/useLanguage.js";
import Button from "../components/ui/Button.jsx";
import ShopImage from "../components/ui/ShopImage.jsx";
import { DeliveryLocationPicker } from "../components/delivery/DeliveryMap.jsx";
import { ListingState } from "../components/ui/ListingState.jsx";

export default function CheckoutPage() {
  const { t, language } = useLanguage(), { cart, clearCart } = useShop(), { user, loading } = useSession(), catalog = useCatalog(), navigate = useNavigate();
  const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const [point, setPoint] = useState(null);
  const submission = useRef(null);
  const lines = Object.entries(cart).map(([id, quantity]) => ({id, quantity, product:catalog.items.find(item => item.id === id)}));
  const hasUnavailable = lines.some(line => !line.product || line.product.demo || !line.product.inStock && line.product.stock === 0);
  const total = lines.reduce((sum, line) => sum + (line.product?.price || 0) * line.quantity, 0);
  const format = value => new Intl.NumberFormat(language).format(value);
  if (loading || catalog.loading || catalog.error) return <ListingState loading={loading || catalog.loading} error={catalog.error}/>;
  if (!user) return <section className="delivery-page"><div className="delivery-container"><h1>{t("Оформление заказа")}</h1><p>{t("Войдите в аккаунт, чтобы продолжить.")}</p><Button to="/login">{t("Войти")}</Button></div></section>;
  if (!lines.length) return <section className="delivery-page"><div className="delivery-container"><h1>{t("Корзина пуста")}</h1><Button to="/catalog">{t("Открыть каталог")}</Button></div></section>;
  return <section className="delivery-page"><div className="delivery-container">
    <Link to="/cart" className="delivery-back">← {t("Корзина")}</Link>
    <p className="delivery-eyebrow">{t("STROY UZ / ДОСТАВКА")}</p>
    <h1>{t("Куда доставить ваш заказ?")}</h1>
    <p className="delivery-muted">{t("Укажите адрес и отметьте удобный въезд на объект.")}</p>
    <form className="delivery-grid" onSubmit={async event => {
      event.preventDefault(); if (busy || hasUnavailable) return;
      const form = new FormData(event.currentTarget);
      const body = {address:form.get("address"),phone:form.get("phone"),consent:form.has("consent"),delivery:{point,note:form.get("note")},items:lines.map(({id,quantity})=>({id,quantity}))};
      const fingerprint = JSON.stringify(body);
      if (submission.current?.fingerprint !== fingerprint) submission.current = {fingerprint,key:crypto.randomUUID()};
      setBusy(true);setMessage("");
      try { const {order} = await api("/orders",{method:"POST",body:{...body,idempotencyKey:submission.current.key}}); clearCart();navigate(`/orders/${order.id}/delivery`); }
      catch(error){setMessage(error.message);}finally{setBusy(false);}
    }}>
      <div className="delivery-card">
        <DeliveryLocationPicker point={point} onChange={setPoint}/>
        <div className="delivery-fields">
          <label>{t("Город и адрес объекта *")}<input name="address" defaultValue={user.address || ""} required minLength={3} maxLength={300} autoComplete="street-address" placeholder={t("Город, улица, номер дома")}/></label>
          <label>{t("Телефон *")}<input name="phone" type="tel" required autoComplete="tel" defaultValue={user.phone} placeholder="+998 XX XXX XX XX"/></label>
          <label>{t("Комментарий для водителя")}<textarea name="note" maxLength={500} placeholder={t("Ориентир, ворота, подъезд или ограничения для грузовика")}/></label>
        </div>
      </div>
      <aside className="delivery-card delivery-summary">
        <h2>{t("Ваш заказ")}</h2>
        {lines.map(({id,product,quantity})=><div className="delivery-order-line" key={id}><ShopImage src={product?.image} alt=""/><div><strong>{t(product?.name || "Товар недоступен")}</strong><small>{quantity} × {format(product?.price || 0)} {t("сум")}</small></div><strong>{format((product?.price || 0)*quantity)}</strong></div>)}
        <div className="delivery-total"><span>{t("Товары")}</span><span>{format(total)} {t("сум")}</span></div>
        <p className="delivery-note">{t("Стоимость доставки согласуется отдельно. Онлайн-оплата не выполняется.")}</p>
        <p className="delivery-muted">{t("Предложения разных продавцов могут приехать отдельно.")}</p>
        <label className="delivery-check"><input name="consent" type="checkbox" required/><span>{t("Подтверждаю состав заказа и контактные данные.")}</span></label>
        {hasUnavailable && <p role="status" className="delivery-note">{t("В корзине есть демо или недоступные товары. Измените состав заказа.")}</p>}
        <Button type="submit" disabled={busy || hasUnavailable}>{t(busy ? "Сохраняем заказ…" : "Подтвердить заказ")}</Button>
        <p role="status" className="delivery-muted">{t(message)}</p>
      </aside>
    </form>
  </div></section>;
}
