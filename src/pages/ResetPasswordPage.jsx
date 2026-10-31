import { useLanguage } from "../i18n/useLanguage.js";
import { Link, useSearchParams } from "react-router";
import { api } from "../api/client.js";
import ResetPasswordConfirm from "../components/auth/ResetPasswordConfirm.jsx";
import { useState } from "react";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import Button from "../components/ui/Button.jsx";
import Icon from "../components/home/Icon.jsx";
import { validateAuthForm } from "../data/authValidation.js";

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ email: "", consent: false });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const change = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setMessage("");
  };
  if (params.get("token"))
    return <ResetPasswordConfirm token={params.get("token")} />;
  return (
    <AuthLayout
      title="Восстановление пароля"
      description="Укажите email, который использовали при регистрации."
    >
      <form
        className="auth-form"
        aria-label={t("Восстановление пароля")}
        noValidate
        onSubmit={async (event) => {
          event.preventDefault();
          if (busy) return;
          const next = validateAuthForm(form, "reset");
          setErrors(next);
          setMessage("");
          const first = Object.keys(next)[0];
          if (first) {
            event.currentTarget.elements.namedItem(first)?.focus();
            return;
          }
          setBusy(true);
          try {
            await api("/auth/forgot-password", { method: "POST", body: form });
            setMessage(
              "Если аккаунт существует, инструкция по восстановлению будет отправлена на email.",
            );
          } catch (error) {
            setMessage(error.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="auth-field">
          <label htmlFor="reset-email">{t("Электронная почта *")}</label>
          <input
            id="reset-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={254}
            placeholder={t("Введите email")}
            value={form.email}
            onChange={(event) => change("email", event.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={
              errors.email ? "reset-email-error" : "reset-email-hint"
            }
          />
          {errors.email ? (
            <p id="reset-email-error" className="auth-error">
              {t(errors.email)}
            </p>
          ) : (
            <small id="reset-email-hint">
              {t("Проверьте адрес перед отправкой")}
            </small>
          )}
        </div>
        <div>
          <label className="auth-checkbox">
            <input
              name="consent"
              type="checkbox"
              required
              checked={form.consent}
              onChange={(event) => change("consent", event.target.checked)}
              aria-invalid={!!errors.consent}
              aria-describedby={
                errors.consent ? "reset-consent-error" : undefined
              }
            />
            {t("Согласен на обработку email для восстановления доступа")}
          </label>
          {errors.consent && (
            <p id="reset-consent-error" className="auth-error">
              {t(errors.consent)}
            </p>
          )}
        </div>
        <Button type="submit" disabled={busy}>
          {t("Отправить ссылку")}
          <Icon name="arrow" />
        </Button>
        <p className="auth-status" role="status">
          {t(message)}
        </p>
        <div className="auth-info">
          <strong>{t("Без раскрытия данных аккаунта")}</strong>
          <p>
            {t(
              "При восстановлении ответ не должен раскрывать, существует ли аккаунт с указанным email.",
            )}
          </p>
        </div>
        <Link className="auth-link" to="/login">
          {t("← Вернуться ко входу")}
        </Link>
      </form>
    </AuthLayout>
  );
}
