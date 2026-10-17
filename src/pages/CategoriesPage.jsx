import { productCount } from "../i18n/translate.js";
import { useLanguage } from "../i18n/useLanguage.js";
import { useEffect } from "react";
import { Link } from "react-router";
import Icon from "../components/home/Icon.jsx";
import {
  catalogCategories,
  catalogCategoryPath,
  catalogProducts,
} from "../data/catalogData.js";
import { CatalogBreadcrumbs } from "./CatalogPage.jsx";
import "./CatalogPage.css";

export default function CategoriesPage() {
  const { t, language } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="market-page market-categories-page">
      <div className="market-container">
        <CatalogBreadcrumbs last="Все категории" />
        <header className="market-categories-heading">
          <p className="market-overline">{t("СТРОИТЕЛЬНЫЙ МАРКЕТПЛЕЙС")}</p>
          <h1>{t("Все категории")}</h1>
          <p>
            {t(
              "Выберите нужный раздел — мы покажем все товары этой категории.",
            )}
          </p>
        </header>
        <div className="market-categories-toprow">
          <h2>{t("Категории товаров")}</h2>
          <Link to="/catalog">
            {t("Все товары ")}
            <Icon name="arrow" />
          </Link>
        </div>
        <div className="market-categories-grid">
          {catalogCategories.map((category, index) => {
            const count = catalogProducts.filter(
              (product) => product.categoryId === category.id,
            ).length;
            return (
              <Link
                className="market-category-tile"
                to={catalogCategoryPath(category.id)}
                key={category.id}
              >
                <div className="market-tile-copy">
                  <span className="market-tile-number">
                    0{t(index + 1)}
                    {t(" / КАТЕГОРИЯ")}
                  </span>
                  <h3>{t(category.name)}</h3>
                  <p>{t(category.description)}</p>
                  <span className="market-tile-bottom">
                    <span>{productCount(count, language)}</span>
                    <span className="market-tile-arrow">
                      <Icon name="arrow" />
                    </span>
                  </span>
                </div>
                <img src={category.image} alt="" loading="lazy" />
              </Link>
            );
          })}
        </div>
        <Link to="/catalog" className="market-explore-all">
          <div>
            <span>{t("ЕЩЁ НЕ ОПРЕДЕЛИЛИСЬ С КАТЕГОРИЕЙ?")}</span>
            <strong>{t("Смотрите весь ассортимент STROY UZ")}</strong>
          </div>
          <span className="market-explore-cta">
            {t("Открыть каталог ")}
            <Icon name="arrow" />
          </span>
        </Link>
      </div>
    </div>
  );
}
