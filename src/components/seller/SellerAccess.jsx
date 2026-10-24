import { useState } from "react";
import { api } from "../../api/client.js";
import { useLanguage } from "../../i18n/useLanguage.js";
import Button from "../ui/Button.jsx";
import "../auth/AuthLayout.css";

export default function SellerAccess() {
  const {t}=useLanguage();
  const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
  return <section className="auth-panel"><h1>{t("Стать продавцом")}</h1><p>{t("Укажите название магазина, чтобы публиковать товары, услуги и технику. Покупки и история заказов сохранятся.")}</p>
    <form className="auth-form" onSubmit={async event=>{event.preventDefault();if(busy)return;const data=new FormData(event.currentTarget);setBusy(true);setMessage("");try{await api("/auth/seller",{method:"POST",body:{storeName:data.get("storeName")}});}catch(error){setMessage(error.message);}finally{setBusy(false);}}}>
      <label className="auth-field">{t("Название магазина")}<input name="storeName" required maxLength="150" autoComplete="organization"/></label>
      <Button type="submit" disabled={busy}>{t("Открыть кабинет продавца")}</Button><p role="status">{t(message)}</p>
    </form><Button to="/account" variant="secondary">{t("Личный кабинет")}</Button>
  </section>;
}
