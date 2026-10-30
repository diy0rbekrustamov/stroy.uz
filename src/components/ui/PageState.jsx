import { Link } from "react-router";
import { useLanguage } from "../../i18n/useLanguage.js";
import Button from "./Button.jsx";
import "./PageState.css";

export function PageLoading() {
  const {t}=useLanguage();
  return <section className="page-state page-state--loading" role="status" aria-live="polite">
    <span className="page-state__mark" aria-hidden="true">S</span>
    <p>{t("Загрузка…")}</p>
    <div className="page-state__skeleton" aria-hidden="true"><i/><i/><i/></div>
  </section>;
}
export function PageNotFound() {
  const {t}=useLanguage();
  return <section className="page-state"><p className="page-state__code">404</p><h1>{t("Страница не найдена")}</h1>
    <p>{t("Проверьте адрес или вернитесь в каталог.")}</p><Button to="/catalog">{t("Открыть каталог")}</Button>{" "}<Link to="/">{t("Главная")}</Link></section>;
}
export function RouteFailure() {
  const {t}=useLanguage();
  return <section className="page-state" role="alert"><h1>{t("Не удалось открыть страницу")}</h1>
    <p>{t("Проверьте подключение и повторите попытку.")}</p><Button onClick={()=>window.location.reload()}>{t("Повторить")}</Button>{" "}<Link to="/">{t("Главная")}</Link></section>;
}
export function CatalogNotice({error,loading}) {
  const {t}=useLanguage();
  if(!error || loading)return null;
  return <p className="catalog-notice" role="status">{t("Сейчас показан демонстрационный каталог. Подключение к серверу недоступно.")}</p>;
}
