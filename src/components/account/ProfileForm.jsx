import { useState } from "react";
import { api } from "../../api/client.js";
import { useLanguage } from "../../i18n/useLanguage.js";
import Button from "../ui/Button.jsx";

export default function ProfileForm({ user }) {
  const { t } = useLanguage();
  const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  return <section className="workspace-card">
    <h2>{t("Профиль и адрес")}</h2>
    <p className="workspace-muted">{user.email}</p>
    <form className="workspace-form" onSubmit={async event => {
      event.preventDefault(); if (busy) return;
      const values = Object.fromEntries(new FormData(event.currentTarget));
      setBusy(true); setMessage("");
      try {
        await api("/auth/profile", { method: "PATCH", body: values });
        window.dispatchEvent(new Event("stroy-session"));
        setMessage("Изменения сохранены.");
      } catch (error) { setMessage(error.message); }
      finally { setBusy(false); }
    }}>
      <label>{t("Имя")}<input name="name" required maxLength={150} autoComplete="name" defaultValue={user.name}/></label>
      <label>{t("Телефон")}<input name="phone" required type="tel" minLength={7} maxLength={25} autoComplete="tel" defaultValue={user.phone}/></label>
      {user.role === "seller" && <label>{t("Название магазина")}<input name="storeName" required maxLength={150} defaultValue={user.storeName}/></label>}
      <label>{t("Адрес по умолчанию")}<textarea name="address" maxLength={300} autoComplete="street-address" defaultValue={user.address}/></label>
      <p className="workspace-muted">{t("Этот адрес будет подставлен при оформлении заказа.")}</p>
      <div className="workspace-actions"><Button type="submit" disabled={busy}>{t(busy ? "Сохраняем…" : "Сохранить")}</Button><Button to="/reset-password" variant="secondary">{t("Восстановление пароля")}</Button></div>
      <p role="status">{t(message)}</p>
    </form>
  </section>;
}
