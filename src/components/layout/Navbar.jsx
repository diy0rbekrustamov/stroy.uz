import { useLanguage } from "../../i18n/useLanguage.js";
import { Link } from "react-router";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useShop } from "../../context/ShopContext.jsx";
import Brand from "./Brand.jsx";
import Icon from "../home/Icon.jsx";

export default function Navbar({
  query,
  onSearch,
  onSearchSubmit,
  cartCount,
  favoriteCount,
  onCart,
  onFavorites,
  onInfo,
}) {
  const { t, language, setLanguage } = useLanguage();

  const [menuOpen, setMenuOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState("");
  const navigate = useNavigate();
  const shop = useShop();
  const handleSearch = onSearch || setInternalQuery;
  const handleInfo = onInfo || shop.openInfo;
  const handleFavorites = onFavorites || shop.openFavorites;
  const handleCart = onCart || (() => navigate("/cart"));
  const effectiveQuery = query ?? internalQuery;
  const effectiveCartCount = cartCount ?? shop.cartCount;
  const effectiveFavoriteCount = favoriteCount ?? shop.favorites.length;
  return (
    <header
      id="top"
      className="bg-white text-[#19232e] font-[Arial] text-[14px] leading-[1.5]"
    >
      {/*.home-topbar */}
      <div className="bg-[#f5f6f7] text-[12px]">
        <div className="w-[min(100%-144px,1296px)] max-[1199px]:w-[calc(100%-64px)] max-[767px]:w-[calc(100%-32px)] mx-auto flex items-center justify-between min-h-[36px] gap-5">
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-3 [&_.home-icon]:w-[14px] [&_.home-icon]:h-[14px]">
              <Icon name="pin" />
            </span>
            {t("Бухара")}
            {t(" ")}
            <span className="text-[#788694] max-[767px]:!hidden">
              {t("Доставка по Узбекистану")}
            </span>
          </span>
          <div className="flex items-center gap-3 max-[767px]:!hidden">
            <Link to="/#footer" className="text-[#788694]">
              {t("О компании")}
            </Link>
            <button
              type="button"
              onClick={() =>
                handleInfo(
                  "Помощь",
                  "Для подбора материалов используйте категории и поиск.",
                )
              }
              className="text-[#788694] bg-transparent p-0 border-0 cursor-pointer font-inherit"
            >
              {t("Помощь")}
            </button>
            <Link to="/#business" className="text-[#788694]">
              {t("Для бизнеса")}
            </Link>
          </div>
          <div
            className="flex items-center gap-1"
            role="group"
            aria-label={
              language === "ru" ? "Язык интерфейса" : "Interfeys tili"
            }
          >
            <button
              type="button"
              lang="ru"
              aria-label="Русский"
              aria-pressed={language === "ru"}
              onClick={() => setLanguage("ru")}
              className={`cursor-pointer rounded px-2 py-1 focus-visible:outline-2 focus-visible:outline-amber-600 ${language === "ru" ? "font-bold text-[#192b38] bg-white" : "text-[#788694]"}`}
            >
              RU
            </button>
            <span aria-hidden="true">/</span>
            <button
              type="button"
              lang="uz"
              aria-label="O‘zbekcha"
              aria-pressed={language === "uz"}
              onClick={() => setLanguage("uz")}
              className={`cursor-pointer rounded px-2 py-1 focus-visible:outline-2 focus-visible:outline-amber-600 ${language === "uz" ? "font-bold text-[#192b38] bg-white" : "text-[#788694]"}`}
            >
              UZ
            </button>
          </div>
        </div>
      </div>

      {/*.home-header-main */}
      <div className="w-[min(100%-144px,1296px)] max-[1199px]:w-[calc(100%-64px)] max-[767px]:w-[calc(100%-32px)] mx-auto flex items-center gap-[42px] max-[1199px]:gap-6 min-h-[94px] max-[991px]:flex-wrap max-[991px]:py-5 max-[767px]:flex-wrap max-[767px]:gap-4 max-[767px]:py-5">
        <Brand />
        <form
          className="flex items-center gap-3 bg-[#f5f6f7] py-2 px-4 rounded-lg flex-1 min-w-0 max-[991px]:order-3 max-[991px]:basis-full max-[767px]:order-4 max-[767px]:basis-full"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (onSearchSubmit) onSearchSubmit();
            else
              navigate(
                `/?q=${encodeURIComponent(effectiveQuery.trim())}#products`,
              );
            if (window.location.pathname === "/") {
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        >
          <button
            type="submit"
            aria-label={t("Найти товары")}
            className="bg-transparent p-[6px_0] flex border-0 cursor-pointer"
          >
            <Icon name="search" />
          </button>
          <input
            aria-label={t("Поиск")}
            placeholder={t("Найти материалы, инструмент или бренд")}
            value={effectiveQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="border-0 bg-transparent w-full min-w-0 h-8 text-[14px] outline-none font-inherit"
          />
          <span
            aria-hidden="true"
            className="text-[#788694] max-[767px]:!hidden"
          >
            ⌕
          </span>
        </form>
        <div className="flex items-center gap-[42px] max-[1199px]:gap-4 max-[991px]:ml-auto max-[767px]:ml-auto max-[767px]:gap-2">
          <button
            type="button"
            onClick={handleFavorites}
            className="flex flex-col items-center gap-1 bg-transparent text-[12px] p-1 min-w-[56px] max-[767px]:min-w-[30px] border-0 cursor-pointer font-inherit"
          >
            <Icon name="heart" />
            <span className="max-[767px]:text-[0px]">
              {t("Избранное")}
              {t(effectiveFavoriteCount ? ` (${effectiveFavoriteCount})` : "")}
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="flex flex-col items-center gap-1 bg-transparent text-[12px] p-1 min-w-[56px] max-[767px]:min-w-[30px] border-0 cursor-pointer font-inherit"
          >
            <Icon name="user" />
            <span className="max-[767px]:text-[0px]">{t("Войти")}</span>
          </button>
          <button
            type="button"
            onClick={handleCart}
            className="flex flex-col items-center gap-1 bg-transparent text-[12px] p-1 min-w-[56px] max-[767px]:min-w-[30px] border-0 cursor-pointer font-inherit"
          >
            <Icon name="cart" />
            <span className="max-[767px]:text-[0px]">
              {t("Корзина")}
              {t(effectiveCartCount ? ` (${effectiveCartCount})` : "")}
            </span>
          </button>
        </div>
        <button
          className="hidden max-[767px]:flex bg-transparent p-2 border-0 cursor-pointer"
          type="button"
          aria-label={t("Меню")}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name="menu" />
        </button>
      </div>

      {/*.home-navigation */}
      <nav
        id="home-navigation"
        className={`w-[min(100%-144px,1296px)] max-[1199px]:w-[calc(100%-64px)] max-[767px]:w-[calc(100%-32px)] mx-auto flex items-center gap-6 max-[1199px]:gap-4 max-[1199px]:text-[12px] max-[1199px]:flex-wrap max-[1199px]:py-3 min-h-[59px] pb-2 text-[14px] ${menuOpen ? "max-[767px]:flex max-[767px]:flex-col max-[767px]:items-stretch max-[767px]:gap-0 max-[767px]:pb-5" : "max-[767px]:hidden"}`}
      >
        <Link
          className="inline-flex items-center justify-center gap-5 min-h-[52px] max-[767px]:min-h-[48px] py-[14px] px-6 rounded-[7px] bg-[#192b38] text-white font-semibold text-[14px] mr-2 whitespace-nowrap hover:bg-[#344456] hover:-translate-y-px transition-all"
          to="/#categories"
          onClick={() => setMenuOpen(false)}
        >
          {t("Каталог товаров")}
          <Icon name="arrow" />
        </Link>
        {[
          ["Акции", "/#products"],
          ["Стройматериалы", "/#categories"],
          ["Инструменты", "/#products"],
          ["Отделка", "/#categories"],
          ["Доставка и оплата", "/#services"],
          ["Оптовым клиентам ↗", "/#business"],
        ].map(([label, href]) => (
          <Link
            key={label}
            to={href}
            onClick={() => setMenuOpen(false)}
            className="whitespace-nowrap max-[767px]:p-3 hover:text-[#192b38]"
          >
            {t(" ")}
            {t(label)}
            {t(" ")}
          </Link>
        ))}
      </nav>
    </header>
  );
}
