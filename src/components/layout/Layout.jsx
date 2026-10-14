import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import HomeDialog from "../home/HomeDialog.jsx";
import { products, formatPrice } from "../home/homeData.js";
import "../../pages/HomePage.css";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState({});
  const [dialog, setDialog] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const info = (title, text) => setDialog({ title, text });
  const chooseGroup = (group) => {
    setFilter(group);
    setQuery("");
    navigate("/#products");
  };
  const add = (product) => {
    setCart((current) => ({
      ...current,
      [product.id]: (current[product.id] || 0) + 1,
    }));
    setAnnouncement(`${product.name} добавлен в корзину`);
  };
  const favorite = (id) =>
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  const changeQuantity = (id, delta) =>
    setCart((current) => {
      const next = {
        ...current,
        [id]: Math.max(0, (current[id] || 0) + delta),
      };
      if (!next[id]) delete next[id];
      return next;
    });
  useEffect(() => {
    const id = location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [location.pathname, location.hash, location.key]);

  return (
    <div className="min-h-screen bg-[#f5f6f7] flex flex-col homepage">
      <Navbar
        query={query}
        onSearch={(value) => {
          setQuery(value);
          setFilter("all");
        }}
        onSearchSubmit={() => {
          setFilter("all");
          navigate("/#products");
        }}
        cartCount={cartCount}
        favoriteCount={favorites.length}
        onCart={() => setDialog({ title: "Корзина", type: "cart" })}
        onFavorites={() => chooseGroup("favorites")}
        onInfo={info}
      />
      <main id="main" className="flex-1">
        <Outlet
          context={{
            query,
            filter,
            setFilter,
            setQuery,
            favorites,
            favorite,
            add,
            info,
            chooseGroup,
          }}
        />
      </main>
      <Footer onInfo={info} />
      <p className="home-sr-only" role="status">
        {announcement}
      </p>
      <HomeDialog dialog={dialog} onClose={() => setDialog(null)}>
        {dialog?.type === "cart" ? (
          <>
            <p className="home-muted">
              Демонстрационная корзина. Оформление заказа пока не подключено.
            </p>
            {cartCount ? (
              <>
                <ul className="home-cart-list">
                  {products
                    .filter((product) => cart[product.id])
                    .map((product) => (
                      <li key={product.id}>
                        <img src={product.image} alt="" />
                        <div>
                          <h3>{product.name}</h3>
                          <p>
                            {formatPrice(product.price * cart[product.id])} сум
                          </p>
                          <div className="home-quantity">
                            <button
                              type="button"
                              aria-label={`Уменьшить количество: ${product.name}`}
                              onClick={() => changeQuantity(product.id, -1)}
                            >
                              −
                            </button>
                            <span>{cart[product.id]}</span>
                            <button
                              type="button"
                              aria-label={`Увеличить количество: ${product.name}`}
                              onClick={() => changeQuantity(product.id, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
                <p className="home-cart-total">
                  Итого:{" "}
                  {formatPrice(
                    products.reduce(
                      (sum, product) =>
                        sum + product.price * (cart[product.id] || 0),
                      0,
                    ),
                  )}{" "}
                  сум
                </p>
              </>
            ) : (
              <p className="home-empty">
                Корзина пока пуста. Добавьте материалы для вашего проекта.
              </p>
            )}
          </>
        ) : (
          <p>{dialog?.text}</p>
        )}
      </HomeDialog>
    </div>
  );
}
