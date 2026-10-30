
import { useCatalog } from "../api/useCatalog.js";
import { useLanguage } from "../i18n/useLanguage.js";
import { Link } from "react-router";
import { formatPrice } from "../components/home/homeData.js";
import { useShop } from "../context/ShopContext.jsx";
import { useState } from "react";

export default function CartPage() {
  const { items: products } = useCatalog();
  const { t } = useLanguage();
  const { cart, changeQuantity } = useShop();
  const [view, setView] = useState("list");

  const entries = products.filter((p) => cart[p.id]);
  const total = products.reduce(
    (sum, p) => sum + p.price * (cart[p.id] || 0),
    0,
  );

  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);

  if (entries.length === 0) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center px-5 py-20 bg-white">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#F8F8F8] flex items-center justify-center mb-6">
            <span className="text-4xl">🛒</span>
          </div>

          <h2 className="text-[25px] font-extrabold tracking-tight text-[#111]">
            {t("Корзина пуста")}
          </h2>

          <p className="text-[14px] text-[#8A94A0] mt-3 leading-relaxed">
            {t("Вы ещё не выбрали строительные материалы")}
          </p>

          <Link
            to="/"
            className="inline-flex mt-7 h-12 px-8 bg-[#111] hover:bg-[#333] text-white rounded-xl text-[14px] font-semibold items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
          >
            {t("Вернуться в каталог")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-7 md:py-10 bg-white min-h-screen">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF] mb-8">
        <Link to="/" className="hover:text-black transition-colors">
          {t("Главная")}
        </Link>
        <span className="text-[#D1D5DB]">/</span>
        <span className="text-[#111] font-semibold">
          {t("Корзина")}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-9">

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[29px] sm:text-[34px] md:text-[38px] font-extrabold tracking-[-0.04em] text-[#111]">
              {t("Моя корзина (")}
              {totalQty})
            </h1>
          </div>

          <p className="text-[14px] text-[#9299A3] mt-2">
            {t("Выбранные вами строительные материалы")}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-[#EEEEEE] bg-[#F8F8F8] self-start">

          <button
            onClick={() => setView("list")}
            className={`h-10 px-4 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-all duration-200 ${
              view === "list"
                ? "bg-[#111] text-white shadow-sm"
                : "text-[#8A94A0] hover:text-black"
            }`}
          >
            <span>☰</span>
            {t("Список")}
          </button>

          <button
            onClick={() => setView("grid")}
            className={`h-10 px-4 rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-all duration-200 ${
              view === "grid"
                ? "bg-[#111] text-white shadow-sm"
                : "text-[#8A94A0] hover:text-black"
            }`}
          >
            <span>⊞</span>
            {t("Карточки")}
          </button>

        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_370px] gap-6 lg:gap-7 items-start">

        {/* Products */}
        <div className="bg-white rounded-2xl border border-[#EEEEEE] overflow-hidden shadow-[0_3px_20px_rgba(0,0,0,0.025)]">

          {view === "list" ? (

            <div className="divide-y divide-[#F0F0F0]">

              {entries.map((product) => (
                <div
                  key={product.id}
                  className="p-4 sm:p-5 md:p-6 flex flex-wrap sm:flex-nowrap gap-4 sm:gap-5 hover:bg-[#FCFCFC] transition-colors duration-200 group"
                >

                  {/* Product Image */}
                  <Link
                    to={`/product/${product.id}`}
                    className="w-[88px] h-[88px] sm:w-[105px] sm:h-[105px] rounded-2xl bg-[#F7F7F7] border border-[#F0F0F0] flex items-center justify-center shrink-0 overflow-hidden group-hover:border-[#E0E0E0] transition-all"
                  >
                    <img
                      src={product.image}
                      alt=""
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-[130px] flex flex-col justify-center">

                    <Link
                      to={`/product/${product.id}`}
                      className="font-bold text-[14px] sm:text-[15px] leading-snug text-[#171717] hover:text-[#777] transition-colors line-clamp-2"
                    >
                      {t(product.name)}
                    </Link>

                    <div className="text-[12px] text-[#9CA3AF] mt-1.5">
                      {t(product.brand || "Samarqand Qurilish")}
                    </div>

                    {/* Quantity */}
                    <div className="mt-4 inline-flex items-center border border-[#EAEAEA] bg-white rounded-xl h-10 w-fit p-1 shadow-sm">

                      <button
                        onClick={() => changeQuantity(product.id, -1)}
                        className="w-8 h-8 rounded-lg text-[#555] hover:bg-[#F2F2F2] hover:text-black flex items-center justify-center text-[19px] transition-colors"
                      >
                        −
                      </button>

                      <span className="w-9 text-center text-[14px] font-bold text-[#111]">
                        {t(cart[product.id])}
                      </span>

                      <button
                        onClick={() => changeQuantity(product.id, 1)}
                        className="w-8 h-8 rounded-lg text-[#555] hover:bg-[#F2F2F2] hover:text-black flex items-center justify-center text-[19px] transition-colors"
                      >
                        +
                      </button>

                    </div>
                  </div>

                  {/* Price and Delete */}
                  <div className="ml-auto text-right shrink-0 flex flex-col items-end justify-between min-h-[100px]">

                    <button
                      onClick={() =>
                        changeQuantity(product.id, -cart[product.id])
                      }
                      className="w-9 h-9 rounded-xl text-[#B5B5B5] hover:bg-[#FFF1F1] hover:text-red-500 flex items-center justify-center transition-all"
                      title={t("Удалить")}
                    >
                      <span className="text-[18px]">🗑</span>
                    </button>

                    <div>
                      <div className="font-extrabold text-[14px] sm:text-[16px] text-[#111] whitespace-nowrap">
                        {formatPrice(product.price)}
                        {t("сум")}
                      </div>

                      <div className="text-[11px] text-[#A0A0A0] mt-1 whitespace-nowrap">
                        {formatPrice(product.price)}
                        {t(" сум /")}
                        {t(product.unit || "шт.")}
                      </div>
                    </div>

                  </div>

                </div>
              ))}

            </div>

          ) : (

            /* Grid View */
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 p-3 sm:p-5">

              {entries.map((product) => (
                <div
                  key={product.id}
                  className="home-product-card cart-product-card group"
                >

                  <div className="home-product-image">

                    <Link
                      to={`/product/${product.id}`}
                      className="home-product-link"
                      aria-label={t(`Открыть товар: ${product.name}`)}
                    >
                      <img
                        src={product.image}
                        alt={t(product.name)}
                        loading="lazy"
                        width="1254"
                        height="1254"
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>

                    <span className="home-product-badge">
                      {t(product.badge)}
                    </span>

                    <button
                      className="home-favorite"
                      type="button"
                      aria-label={t(`Убрать: ${product.name}`)}
                      onClick={() =>
                        changeQuantity(product.id, -cart[product.id])
                      }
                    >
                      ×
                    </button>

                  </div>

                  <p className="home-muted">
                    {t(product.category)}
                  </p>

                  <h3>
                    <Link to={`/product/${product.id}`}>
                      {t(product.name)}
                    </Link>
                  </h3>

                  <p className="home-muted">
                    {t(product.brand || product.details)}
                  </p>

                  <p className="home-product-price">
                    <strong>{formatPrice(product.price)}</strong>
                    <span>
                      {t("сум / ")}
                      {t(product.unit)}
                    </span>
                  </p>

                  <div className="home-product-bottom">

                    <div className="shop-modal-qty cart-qty">
                      <button
                        onClick={() => changeQuantity(product.id, -1)}
                        aria-label={t("Уменьшить")}
                      >
                        −
                      </button>

                      <span>{t(cart[product.id])}</span>

                      <button
                        onClick={() => changeQuantity(product.id, 1)}
                        aria-label={t("Увеличить")}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="home-button home-button--danger"
                      onClick={() =>
                        changeQuantity(product.id, -cart[product.id])
                      }
                    >
                      {t("Удалить")}
                    </button>

                  </div>

                </div>
              ))}

            </div>

          )}

        </div>

        {/* Order Summary */}
        <div className="bg-[#FAFAFA] rounded-2xl p-5 sm:p-6 border border-[#EEEEEE] lg:sticky lg:top-6 shadow-[0_3px_20px_rgba(0,0,0,0.025)]">

          <div className="flex items-center justify-between">
            <div className="font-extrabold text-[17px] text-[#111]">
              {t("Состав заказа")}
            </div>

            <span className="text-[11px] font-semibold text-[#929292] bg-white border border-[#EEEEEE] rounded-full px-3 py-1">
              {totalQty} {t("тов.")}
            </span>
          </div>

          {/* Summary Details */}
          <div className="mt-6 space-y-4">

            <div className="flex justify-between items-center gap-3 text-[13px]">
              <span className="text-[#9299A3]">
                {t("Товары (")}
                {totalQty})
              </span>

              <span className="font-bold text-[#111] text-right">
                {formatPrice(total)}
                {t("сум")}
              </span>
            </div>

            <div className="flex justify-between items-center gap-3 text-[13px]">
              <span className="text-[#9299A3]">
                {t("Доставка")}
              </span>

              <span className="text-[#111] font-semibold text-right">
                {t("По согласованию")}
              </span>
            </div>

          </div>

          {/* Total */}
          <div className="mt-6 pt-5 border-t border-[#E8E8E8]">

            <div className="flex justify-between items-center gap-3">

              <span className="font-bold text-[14px] text-[#555]">
                {t("Итого")}
              </span>

              <span className="font-extrabold text-[21px] sm:text-[23px] tracking-tight text-[#111] text-right">
                {formatPrice(total)}
                {t("сум")}
              </span>

            </div>

          </div>

          {/* Checkout Button */}
          <Link
            to="/checkout"
            className="w-full mt-6 h-[52px] bg-[#FFC107] hover:bg-[#FFB300] active:scale-[0.98] rounded-xl font-bold text-[14px] flex items-center justify-center gap-3 text-black transition-all duration-200 shadow-[0_4px_12px_rgba(255,193,7,0.16)] hover:shadow-[0_6px_18px_rgba(255,193,7,0.25)]"
          >
            {t("Оформить заказ")}
            <span className="text-[19px] transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>

          {/* Security Info */}
          <div className="mt-5 flex gap-3 items-start p-3 rounded-xl bg-white border border-[#F0F0F0]">

            <span className="text-[19px] shrink-0 mt-0.5">
              🛡️
            </span>

            <span className="text-[11px] text-[#9299A3] leading-[1.6]">
              {t(
                "Перед подтверждением заказа вы сможете проверить все данные.",
              )}
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}
