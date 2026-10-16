import { useEffect } from "react";
import { Link } from "react-router";
import { formatPrice } from "../home/homeData.js";
import { catalogProducts as products } from "../../data/catalogData.js";
import { useShop } from "../../context/ShopContext.jsx";
import "./ShopDialog.css";

export default function ShopDialog() {
  const { dialog, closeDialog, cart, changeQuantity } = useShop();
  useEffect(() => {
    if (!dialog) return;
    const onKeyDown = (event) => { if (event.key === "Escape") closeDialog(); };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dialog, closeDialog]);
  if (!dialog) return null;
  const entries = products.filter((product) => Boolean(cart[product.id]));
  const total = products.reduce((sum, product) => sum + product.price * (cart[product.id] || 0), 0);
  return (
    <div className="shop-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDialog(); }}>
      <section className="shop-modal" role="dialog" aria-modal="true" aria-labelledby="shop-modal-title">
        <div className="shop-modal-head"><h2 id="shop-modal-title">{dialog.title}</h2><button onClick={closeDialog} aria-label="Закрыть">×</button></div>
        {dialog.type === "info" ? <p className="shop-modal-info">{dialog.text}</p> : entries.length ? (
          <>
            <div className="shop-modal-products">{entries.map((product) => <div className="shop-modal-item" key={product.id}>
              <Link to={`/product/${product.id}`} onClick={closeDialog}><img src={product.image} alt="" /></Link>
              <div className="shop-modal-item-content">
                <Link to={`/product/${product.id}`} onClick={closeDialog}>{product.name}</Link>
                <strong>{formatPrice(product.price)} сум</strong>
                <div className="shop-modal-qty"><button onClick={() => changeQuantity(product.id, -1)} aria-label="Уменьшить">−</button><span>{cart[product.id]}</span><button onClick={() => changeQuantity(product.id, 1)} aria-label="Увеличить">+</button></div>
              </div>
            </div>)}</div>
            <div className="shop-modal-total"><span>Итого</span><strong>{formatPrice(total)} сум</strong></div>
          </>
        ) : <p className="shop-modal-info">Корзина пока пуста. Добавьте товары из каталога.</p>}
      </section>
    </div>
  );
}
