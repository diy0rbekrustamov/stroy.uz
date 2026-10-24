import { ListingState } from "../components/ui/ListingState.jsx";
import { useCatalog } from "../api/useCatalog.js";
import { useLanguage } from "../i18n/useLanguage.js";
import { Link } from "react-router";
import { formatPrice } from "../components/home/homeData.js";
import { useShop } from "../context/ShopContext.jsx";
import { useState } from "react";

export default function CartPage() {
  const { items: products, loading, error } = useCatalog();
  const { t } = useLanguage();
  const { cart, changeQuantity } = useShop();
  const [view, setView] = useState("list"); // list | grid

  const entries = products.filter((p) => cart[p.id]);
  const total = products.reduce(
    (sum, p) => sum + p.price * (cart[p.id] || 0),
    0,
  );

  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);

  if (loading || error) return <ListingState loading={loading} error={error}/>;
  if (entries.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-6 py-20 text-center">
        <div className="text-[18px] font-bold">{t("Корзина пуста")}</div>
        <p className="text-[14px] text-[#8A94A0] mt-2">
          {t("Вы ещё не выбрали строительные материалы")}
        </p>
        <Link
          to="/"
          className="inline-flex mt-6 h-11 px-6 bg-[#111] text-white rounded-full text-[14px] font-semibold items-center"
        >
          {t("Вернуться в каталог")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-10 py-6 md:py-8 bg-[#FFF]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[12px] text-[#8A94A0] mb-6">
        <Link to="/" className="hover:text-black">
          {t("Главная")}
        </Link>
        <span>›</span>
        <span className="text-black">{t("Корзина")}</span>
      </div>

      {/* Header + Toggle */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[30px] md:text-[32px] font-extrabold tracking-[-0.02em]">
            {t("Моя корзина (")}
            {totalQty})
          </h1>
          <p className="text-[14px] text-[#8A94A0] mt-1">
            {t("Выбранные вами строительные материалы")}
          </p>
        </div>

        <div className="flex items-center gap-1 p-[5px] rounded-full border border-[#F0F0F0] bg-white shadow-sm self-start">
          <button
            onClick={() => setView("list")}
            className={`h-9 px-4 rounded-full text-[13px] font-semibold flex items-center gap-2 transition ${view === "list" ? "bg-black text-white" : "text-[#8A94A0] hover:text-black"}`}
          >
            {t("☰ Список")}
          </button>
          <button
            onClick={() => setView("grid")}
            className={`h-9 px-4 rounded-full text-[13px] font-semibold flex items-center gap-2 transition ${view === "grid" ? "bg-black text-white" : "text-[#8A94A0] hover:text-black"}`}
          >
            {t("⊞ Карточки")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        {/* Items - view toggle */}
        <div className="bg-white rounded-[16px] border border-[#F0F0F0] overflow-hidden">
          {view === "list" ? (
            <div className="divide-y divide-[#F0F0F0]">
              {entries.map((product) => (
                <div key={product.id} className="p-5 flex gap-4">
                  <Link
                    to={`/product/${product.id}`}
                    className="w-[80px] h-[80px] rounded-[14px] bg-[#F9FAFB] border border-[#F0F0F0] flex items-center justify-center shrink-0 overflow-hidden"
                  >
                    <img
                      src={product.image}
                      alt=""
                      className="w-full h-full object-contain p-1"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/product/${product.id}`}
                      className="font-bold text-[14px] leading-tight hover:underline line-clamp-2"
                    >
                      {t(product.name)}
                    </Link>
                    <div className="text-[11px] text-[#8A94A0] mt-1">
                      {t(product.brand || "Samarqand Qurilish")}
                    </div>
                    <div className="mt-3 inline-flex items-center border border-[#E9EAEC] rounded-full h-9 px-1">
                      <button
                        onClick={() => changeQuantity(product.id, -1)}
                        className="w-7 h-7 rounded-full hover:bg-[#F5F6F7] flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-[14px] font-semibold">
                        {t(cart[product.id])}
                      </span>
                      <button
                        onClick={() => changeQuantity(product.id, 1)}
                        className="w-7 h-7 rounded-full hover:bg-[#F5F6F7] flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col items-end">
                    <button
                      onClick={() =>
                        changeQuantity(product.id, -cart[product.id])
                      }
                      className="text-[#D0D3D6] hover:text-black text-[16px]"
                    >
                      🗑️
                    </button>
                    <div className="font-bold text-[14px] mt-auto">
                      {formatPrice(product.price)}
                      {t("сум")}
                    </div>
                    <div className="text-[11px] text-[#8A94A0]">
                      {formatPrice(product.price)}
                      {t(" сум /")} {t(product.unit || "шт.")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 p-4">
              {entries.map((product) => (
                <div
                  key={product.id}
                  className="home-product-card cart-product-card"
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

                  <p className="home-muted">{t(product.category)}</p>

                  <h3>
                    <Link to={`/product/${product.id}`}>{t(product.name)}</Link>
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
                    {/* Counter - list dagi kabi */}
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

                    {/* Удалить - Корзинаga o'rniga */}
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

        {/* Состав заказа - rasmga 1 ga 1 */}
        <div className="bg-[#F9FAFB] rounded-[16px] p-6 border border-[#F0F0F0] sticky top-6">
          <div className="font-bold text-[16px]">{t("Состав заказа")}</div>
          <div className="mt-5 space-y-3">
            <div className="flex justify-between text-[13px] text-[#8A94A0]">
              <span>
                {t("Товары (")}
                {totalQty})
              </span>
              <span className="font-semibold text-[#111]">
                {formatPrice(total)}
                {t("сум")}
              </span>
            </div>
            <div className="flex justify-between text-[13px] text-[#8A94A0]">
              <span>{t("Доставка")}</span>
              <span className="text-[#111] font-medium">
                {t("По согласованию")}
              </span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-[#EDEEF0] flex justify-between items-center">
            <span className="font-bold text-[14px]">{t("Итого")}</span>
            <span className="font-extrabold text-[20px] tracking-tight">
              {formatPrice(total)}
              {t("сум")}
            </span>
          </div>
          <Link
            to="/checkout"
            className="w-full mt-5 h-[48px] bg-[#FFC107] hover:bg-[#FFB300] rounded-[12px] font-bold text-[14px] flex items-center justify-center gap-2 text-black transition"
          >
            {t("Оформить заказ")}
            <span>→</span>
          </Link>
          <div className="mt-4 flex gap-2 text-[11px] text-[#8A94A0] leading-snug">
            <span className="mt-0.5">🛡️</span>
            <span>
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
