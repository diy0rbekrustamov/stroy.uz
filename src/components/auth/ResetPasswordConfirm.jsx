import { useState } from "react";
import { Link } from "react-router";
import AuthLayout from "./AuthLayout.jsx";
import Button from "../ui/Button.jsx";
import { api } from "../../api/client.js";
import { useLanguage } from "../../i18n/useLanguage.js";
export default function ResetPasswordConfirm({token}) {
 const {t}=useLanguage();
 const [message,setMessage]=useState(""),[done,setDone]=useState(false),[busy,setBusy]=useState(false);
 return <AuthLayout title="Новый пароль" description="Не менее 8 символов, буквы и цифры">
  {!done && <form className="auth-form" onSubmit={async event=>{
   event.preventDefault();if(busy)return;
   const data=new FormData(event.currentTarget);
   if(data.get("password")!==data.get("confirm")) {setMessage("Пароли должны совпадать");return;}
   setBusy(true);
   try {await api("/auth/reset-password",{method:"POST",body:{token,password:data.get("password")}});setDone(true);setMessage("Пароль изменён. Войдите с новым паролем.");}
   catch(error) {setMessage(error.message);}finally {setBusy(false);}
  }}>
   <label className="auth-field">{t("Пароль *")}<input name="password" type="password" required minLength="8" maxLength="128" autoComplete="new-password" /></label>
   <label className="auth-field">{t("Повторите пароль *")}<input name="confirm" type="password" required minLength="8" maxLength="128" autoComplete="new-password" /></label>
   <Button type="submit" disabled={busy}>{t("Сохранить пароль")}</Button>
  </form>}
  <p role="status" className="auth-status">{t(message)}</p><Link className="auth-link" to="/login">{t("← Вернуться ко входу")}</Link>
 </AuthLayout>;
}
