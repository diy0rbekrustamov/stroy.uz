import { useLanguage } from "../i18n/useLanguage.js";
import { Link, useNavigate } from "react-router";
import { api } from "../api/client.js";
import { useState } from "react";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import Button from "../components/ui/Button.jsx";
import Icon from "../components/home/Icon.jsx";
import { validateAuthForm } from "../data/authValidation.js";

export default function LoginPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState("buyer");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const change = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setMessage("");
  };
  return (
    <AuthLayout
      title="Вход"
      description="Вернитесь к своему проекту. Один аккаунт для покупок и продаж."
    >
      <div className="auth-roles" role="group" aria-label={t("Тип аккаунта")}>
        <button
          type="button"
          aria-pressed={role === "buyer"}
          onClick={() => {
            setRole("buyer");
            setMessage("");
          }}
        >
          {t("Покупатель")}
        </button>
        <button
          type="button"
          aria-pressed={role === "seller"}
          onClick={() => {
            setRole("seller");
            setMessage("");
          }}
        >
          {t("Продавец")}
        </button>
      </div>
      <form
        className="auth-form"
        aria-label={t("Вход")}
        noValidate
        onSubmit={async (event) => {
          event.preventDefault();
          if (busy) return;
          const next = validateAuthForm(form);
          setErrors(next);
          setMessage("");
          const first = Object.keys(next)[0];
          if (first) {
            event.currentTarget.elements.namedItem(first)?.focus();
            return;
          }
          setBusy(true);
          try {
            const { user } = await api("/auth/login", {
              method: "POST",
              body: {
                email: form.email,
                password: form.password,
                remember: form.remember,
              },
            });
            navigate(user.role === "seller" ? "/seller" : "/account");
          } catch (error) {
            setMessage(error.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <div className="auth-field">
          <label htmlFor="login-email">{t("Электронная почта *")}</label>
          <input
            id="login-email"
            name="email"
            type="email"
            required
            autoComplete="username"
            inputMode="email"
            maxLength={254}
            placeholder={t("Введите email")}
            value={form.email}
            onChange={(event) => change("email", event.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={
              errors.email ? "login-email-error" : "login-email-hint"
            }
          />
          {errors.email ? (
            <p className="auth-error" id="login-email-error">
              {t(errors.email)}
            </p>
          ) : (
            <small id="login-email-hint">
              {t("Например, name@example.com")}
            </small>
          )}
        </div>
        <div className="auth-field">
          <label htmlFor="login-password">{t("Пароль *")}</label>
          <div className="auth-password">
            <input
              id="login-password"
              name="password"
              type={showPass ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder={t("Введите пароль")}
              value={form.password}
              onChange={(event) => change("password", event.target.value)}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "login-password-error" : undefined
              }
            />
            <button
              type="button"
              aria-label={t(showPass ? "Скрыть пароль" : "Показать пароль")}
              aria-pressed={showPass}
              onClick={() => setShowPass(!showPass)}
            >
              {t(showPass ? "Скрыть" : "Показать")}
            </button>
          </div>
          {errors.password && (
            <p className="auth-error" id="login-password-error">
              {t(errors.password)}
            </p>
          )}
        </div>
        <div className="auth-options">
          <label className="auth-checkbox">
            <input
              name="remember"
              type="checkbox"
              checked={form.remember}
              onChange={(event) => change("remember", event.target.checked)}
            />
            {t("Запомнить меня на этом устройстве")}
          </label>
          <Link className="auth-link" to="/reset-password">
            {t("Забыли пароль?")}
          </Link>
        </div>
        <Button type="submit" disabled={busy}>
          {t("Войти")}
          <Icon name="arrow" />
        </Button>
        <p className="auth-status" role="status">
          {t(message)}
        </p>
        <p className="auth-register">
          {t("Нет аккаунта?")}{" "}
          <Link className="auth-link" to="/register">
            {t("Зарегистрироваться →")}
          </Link>
        </p>
        <p className="auth-note">
          {t(
            "Обязательные поля отмечены *. Ошибки показываем рядом с полем, данные сохраним при повторе.",
          )}
        </p>
      </form>
    </AuthLayout>
  );
}
