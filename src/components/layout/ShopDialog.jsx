import { useCatalog } from "../../api/useCatalog.js";
import { useLanguage } from "../../i18n/useLanguage.js";
import { useEffect,useRef } from "react";
import { Link } from "react-router";
import { formatPrice } from "../home/homeData.js";
import { useShop } from "../../context/ShopContext.jsx";
import "./ShopDialog.css";

export default function ShopDialog() {
  const {items:products} = useCatalog();
  const panel=useRef(null);
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
    const previous=document.activeElement;
    const overflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    panel.current?.querySelector("button")?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeDialog();
      if(event.key === "Tab") {
        const controls=[...panel.current.querySelectorAll('a[href],button:not([disabled]),input,select,textarea,[tabindex="0"]')];
        const first=controls[0],last=controls.at(-1);
        if(event.shiftKey && document.activeElement===first){event.preventDefault();last?.focus();}
        if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus();}
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow=overflow;
      previous?.focus();
    };
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
        ref={panel}
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
