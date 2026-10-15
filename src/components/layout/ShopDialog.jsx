import { useLanguage } from "../../i18n/useLanguage.js";
import { useEffect } from "react";
import { Link } from "react-router";
import { products, formatPrice } from "../home/homeData.js";
import { useShop } from "../../context/ShopContext.jsx";
import "./ShopDialog.css";

export default function ShopDialog() {
  const { t } = useLanguage();

  const {
    dialog,
    closeDialog,
    cart,
    favorites,
    changeQuantity,
    toggleFavorite,
  } = useShop();
  useEffect(() => {
    if (!dialog) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeDialog();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dialog, closeDialog]);
  if (!dialog) return null;
  const entries = products.filter((product) =>
    dialog.type === "cart" ? cart[product.id] : favorites.includes(product.id),
  );
  const total = products.reduce(
    (sum, product) => sum + product.price * (cart[product.id] || 0),
    0,
  );
  return (
    <div
      className="shop-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
    >
      <section
        className="shop-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shop-modal-title"
      >
        <div className="shop-modal-head">
          <h2 id="shop-modal-title">{t(dialog.title)}</h2>
          <button onClick={closeDialog} aria-label={t("Закрыть")}>
            ×
          </button>
        </div>
        {t(
          dialog.type === "info" ? (
            <p className="shop-modal-info">{t(dialog.text)}</p>
          ) : entries.length ? (
            <>
              <div className="shop-modal-products">
                {entries.map((product) => (
                  <div className="shop-modal-item" key={product.id}>
                    <Link to={`/product/${product.id}`} onClick={closeDialog}>
                      <img src={product.image} alt="" />
                    </Link>
                    <div className="shop-modal-item-content">
                      <Link to={`/product/${product.id}`} onClick={closeDialog}>
                        {t(product.name)}
                      </Link>
                      <strong>
                        {t(formatPrice(product.price))}
                        {t(" сум")}
                      </strong>
                      {t(
                        dialog.type === "cart" ? (
                          <div className="shop-modal-qty">
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
                        ) : (
                          <button
                            className="shop-modal-remove"
                            onClick={() => toggleFavorite(product.id)}
                          >
                            {t("Убрать из избранного")}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {t(
                dialog.type === "cart" && (
                  <div className="shop-modal-total">
                    <span>{t("Итого")}</span>
                    <strong>
                      {t(formatPrice(total))}
                      {t(" сум")}
                    </strong>
                  </div>
                ),
              )}
            </>
          ) : (
            <p className="shop-modal-info">
              {t(
                dialog.type === "cart"
                  ? "Корзина пока пуста. Добавьте товары из каталога."
                  : "В избранном пока нет товаров.",
              )}
            </p>
          ),
        )}
      </section>
    </div>
  );
}
