import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { api } from "../api/client.js";
import { useLanguage } from "../i18n/useLanguage.js";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import Button from "../components/ui/Button.jsx";
import Icon from "../components/home/Icon.jsx";
import { validateRegistration } from "../data/authValidation.js";

export default function RegisterPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [busy,setBusy] = useState(false);
  const [role, setRole] = useState("seller");
  const [visible, setVisible] = useState({});
  const [form, setForm] = useState({
    name: "",
    storeName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const change = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({
      ...current,
      [key]: undefined,
      ...(key === "password" ? { confirmPassword: undefined } : {}),
    }));
    setMessage("");
  };
  const field = (key, label, placeholder, type = "text", autoComplete) => {
    const password = type === "password";
    const input = (
      <input
        id={`register-${key}`}
        name={key}
        type={password && visible[key] ? "text" : type}
        required
        autoComplete={autoComplete}
        maxLength={password ? undefined : 254}
        inputMode={
          type === "tel" ? "tel" : type === "email" ? "email" : undefined
        }
        placeholder={t(placeholder)}
        value={form[key]}
        onChange={(event) => change(key, event.target.value)}
        aria-invalid={!!errors[key]}
        aria-describedby={
          errors[key]
            ? `register-${key}-error`
            : password && key === "password"
              ? "register-password-hint"
              : undefined
        }
      />
    );
    return (
      <div className="auth-field">
        <label htmlFor={`register-${key}`}>{t(label)}</label>
        {password ? (
          <div className="auth-password">
            {input}
            <button
              type="button"
              aria-label={
                t(visible[key] ? "Скрыть пароль" : "Показать пароль") +
                ": " +
                t(label)
              }
              aria-pressed={!!visible[key]}
              onClick={() =>
                setVisible((current) => ({ ...current, [key]: !current[key] }))
              }
            >
              {t(visible[key] ? "Скрыть" : "Показать")}
            </button>
          </div>
        ) : (
          input
        )}
        {errors[key] && (
          <p className="auth-error" id={`register-${key}-error`}>
            {t(errors[key])}
          </p>
        )}
        {password && key === "password" && !errors[key] && (
          <small id="register-password-hint">
            {t("Не менее 8 символов, буквы и цифры")}
          </small>
        )}
      </div>
    );
  };
  return (
    <AuthLayout
      title="Регистрация"
      description="Создайте аккаунт и начните свой следующий проект."
    >
      <div className="auth-roles" role="group" aria-label={t("Тип аккаунта")}>
        {[
          ["buyer", "Покупатель"],
          ["seller", "Продавец"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={role === value}
            onClick={() => {
              setRole(value);
              setErrors({});
              setMessage("");
            }}
          >
            {t(label)}
          </button>
        ))}
      </div>
      <p className="auth-description auth-role-description">
        {t(
          "Покупатель — заказы и избранное. Продавец — товары, услуги и заявки. Роль можно дополнить позже.",
        )}
      </p>
      <form
        className="auth-form"
        aria-label={t("Регистрация")}
        noValidate
        onSubmit={async (event) => {
          event.preventDefault();
          if(busy) return;
          const next = validateRegistration(form, role);
          setErrors(next);
          setMessage("");
          const first = Object.keys(next)[0];
          if (first) {
            event.currentTarget.elements.namedItem(first)?.focus();
            return;
          }
          setBusy(true);
          try {
            const {user}=await api("/auth/register",{method:"POST",body:{...form,role}});
            navigate(user.role === "seller" ? "/seller" : "/account");
          } catch(error) {setMessage(error.message);} finally {setBusy(false);}
        }}
      >
        {field("name", "Ваше имя *", "Введите имя", "text", "name")}
        {role === "seller" &&
          field(
            "storeName",
            "Название магазина *",
            "Введите название",
            "text",
            "organization",
          )}
        <div className="auth-field-row">
          {field("phone", "Телефон *", "+998 XX XXX XX XX", "tel", "tel")}
          {field("email", "Email *", "Введите email", "email", "email")}
        </div>
        {field(
          "password",
          "Пароль *",
          "Введите пароль",
          "password",
          "new-password",
        )}
        {field(
          "confirmPassword",
          "Повторите пароль *",
          "Введите пароль ещё раз",
          "password",
          "new-password",
        )}
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
                errors.consent ? "register-consent-error" : undefined
              }
            />
            {t(
              "Я согласен с условиями использования и политикой конфиденциальности",
            )}
          </label>
          {errors.consent && (
            <p className="auth-error" id="register-consent-error">
              {t(errors.consent)}
            </p>
          )}
        </div>
        <Button type="submit" disabled={busy}>
          {t("Создать аккаунт")}
          <Icon name="arrow" />
        </Button>
        <p className="auth-status" role="status">
          {t(message)}
        </p>
        <p className="auth-register">
          {t("Уже зарегистрированы?")}{" "}
          <Link className="auth-link" to="/login">
            {t("Войти →")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
