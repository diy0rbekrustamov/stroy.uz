import { Link } from "react-router";
import { useLanguage } from "../../i18n/useLanguage.js";
import materials from "../../assets/optimized/hero-clean.webp";
import "./AuthLayout.css";

export default function AuthLayout({ title, description, children }) {
  const { t } = useLanguage();
  return (
    <div className="auth-page">
      <div className="auth-layout">
        <aside className="auth-intro" aria-labelledby="auth-intro-title">
          <p className="auth-eyebrow">{t("STROY UZ / ВАШ ПРОЕКТ")}</p>
          <h2 id="auth-intro-title">
            {t("Одна основа.")}
            <br />
            {t("Много возможностей.")}
          </h2>
          <p>
            {t(
              "Покупайте материалы, находите услуги и управляйте своим делом.",
            )}
          </p>
          <div className="auth-art">
            <img
              src={materials}
              alt={t("Композиция из бетона, кирпича, металла и дерева")}
              width="728"
              height="720"
            />
          </div>
        </aside>
        <section className="auth-panel" aria-labelledby="auth-title">
          <Link className="auth-back" to="/">
            {t("← Главная")}
          </Link>
          <h1 id="auth-title">{t(title)}</h1>
          <p className="auth-description">{t(description)}</p>
          {children}
        </section>
      </div>
    </div>
  );
}
