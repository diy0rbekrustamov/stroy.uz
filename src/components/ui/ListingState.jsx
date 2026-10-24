import { useLanguage } from "../../i18n/useLanguage.js";
import Button from "./Button.jsx";
import "./PageState.css";
export function ListingState({loading,error,empty}) {
  const {t}=useLanguage();
  if (loading) return <p role="status" className="catalog-notice">{t("Загрузка объявлений…")}</p>;
  if (error) return <div role="alert" className="catalog-notice"><p>{t("Не удалось загрузить объявления. Проверьте подключение и повторите попытку.")}</p><Button variant="secondary" onClick={()=>window.dispatchEvent(new Event("stroy-catalog"))}>{t("Повторить")}</Button></div>;
  if (!empty) return null;
  return <section className="listing-empty"><h2>{t("Объявлений пока нет")}</h2><p>{t("Здесь появятся опубликованные предложения продавцов.")}</p><Button to="/seller">{t("Разместить объявление")}</Button></section>;
}
export function DemoNotice({items}) {
  const {t}=useLanguage();
  if (!items?.some(item=>item.demo)) return null;
  return <p className="catalog-notice">{t("Цены и ассортимент показаны для демонстрации макета.")}</p>;
}
