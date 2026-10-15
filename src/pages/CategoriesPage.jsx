import { useEffect } from "react";
import { Link } from "react-router";
import Icon from "../components/home/Icon.jsx";
import { catalogCategories, catalogCategoryPath, catalogProducts } from "../data/catalogData.js";
import { CatalogBreadcrumbs } from "./CatalogPage.jsx";
import "./CatalogPage.css";

export default function CategoriesPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="market-page market-categories-page">
      <div className="market-container">
        <CatalogBreadcrumbs last="Все категории" />
        <header className="market-categories-heading">
          <p className="market-overline">СТРОИТЕЛЬНЫЙ МАРКЕТПЛЕЙС</p>
          <h1>Все категории</h1>
          <p>Выберите нужный раздел — мы покажем все товары этой категории.</p>
        </header>
        <div className="market-categories-toprow"><h2>Категории товаров</h2><Link to="/catalog">Все товары <Icon name="arrow" /></Link></div>
        <div className="market-categories-grid">
          {catalogCategories.map((category, index) => {
            const count = catalogProducts.filter((product) => product.categoryId === category.id).length;
            return (
              <Link className="market-category-tile" to={catalogCategoryPath(category.id)} key={category.id}>
                <div className="market-tile-copy">
                  <span className="market-tile-number">0{index + 1} / КАТЕГОРИЯ</span>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="market-tile-bottom"><span>{count} {count === 1 ? "товар" : count < 5 ? "товара" : "товаров"}</span><span className="market-tile-arrow"><Icon name="arrow" /></span></span>
                </div>
                <img src={category.image} alt="" loading="lazy" />
              </Link>
            );
          })}
        </div>
        <Link to="/catalog" className="market-explore-all"><div><span>ЕЩЁ НЕ ОПРЕДЕЛИЛИСЬ С КАТЕГОРИЕЙ?</span><strong>Смотрите весь ассортимент STROY UZ</strong></div><span className="market-explore-cta">Открыть каталог <Icon name="arrow" /></span></Link>
      </div>
    </div>
  );
}
