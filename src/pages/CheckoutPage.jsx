import { useRef,useState } from "react";
import { Link,useNavigate } from "react-router";
import { useShop } from "../context/ShopContext.jsx";
import { useSession } from "../api/useSession.js";
import { useCatalog } from "../api/useCatalog.js";
import { api } from "../api/client.js";
import { useLanguage } from "../i18n/useLanguage.js";
import Button from "../components/ui/Button.jsx";
import "../components/auth/AuthLayout.css";
export default function CheckoutPage() {
 const {t}=useLanguage(),{cart,clearCart}=useShop(),{user,loading}=useSession(),{items}=useCatalog(),navigate=useNavigate();
 const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
 const submission=useRef(null);
 if(loading) return <p role="status">{t("Загрузка…")}</p>;
 if(!user)return <div className="market-page market-container"><h1>{t("Оформление заказа")}</h1><p>{t("Войдите в аккаунт, чтобы продолжить.")}</p><Button to="/login">{t("Войти")}</Button></div>;
 if(!Object.keys(cart).length)return <div className="market-page market-container"><p>{t("Корзина пуста")}</p><Link to="/catalog">{t("Открыть каталог")}</Link></div>;
 return <div className="auth-page"><div className="market-container" style={{maxWidth:650}}><section className="auth-panel">
  <h1>{t("Оформление заказа")}</h1>
  <ul>{Object.entries(cart).map(([id,quantity])=><li key={id}>{t(items.find(item=>item.id===id)?.name || id)} × {quantity}</li>)}</ul>
  <form className="auth-form" onSubmit={async event=>{
   event.preventDefault();if(busy)return;const data=new FormData(event.currentTarget);
   const fingerprint=JSON.stringify(cart);
   if(!submission.current || submission.current.fingerprint!==fingerprint)submission.current={fingerprint,key:crypto.randomUUID()};
   setBusy(true);setMessage("");
   try {await api("/orders",{method:"POST",body:{idempotencyKey:submission.current.key,address:data.get("address"),phone:data.get("phone"),consent:data.has("consent"),items:Object.entries(cart).map(([id,quantity])=>({id,quantity}))}});clearCart();navigate("/account");}
   catch(error){setMessage(error.message);}finally{setBusy(false);}
  }}>
   <label className="auth-field">{t("Город и адрес объекта *")}<input name="address" required autoComplete="street-address" maxLength="300"/></label>
   <label className="auth-field">{t("Телефон *")}<input name="phone" type="tel" required autoComplete="tel" defaultValue={user.phone} placeholder="+998 XX XXX XX XX"/></label>
   <label className="auth-checkbox"><input name="consent" type="checkbox" required/>{t("Подтверждаю состав заказа и контактные данные.")}</label>
   <p>{t("Стоимость доставки согласуется отдельно. Онлайн-оплата не выполняется.")}</p>
   <Button type="submit" disabled={busy}>{t("Подтвердить заказ")}</Button>
   <p role="status" className="auth-status">{t(message)}</p>
  </form>
 </section></div></div>;
}
