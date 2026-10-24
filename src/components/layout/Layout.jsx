import "../ui/storefront.css";
import { useLanguage } from "../../i18n/useLanguage.js";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import ShopDialog from "./ShopDialog.jsx";
import { useShop } from "../../context/ShopContext.jsx";
import "../../pages/HomePage.css";

export default function Layout() {
  const { t } = useLanguage();

  const navigate = useNavigate();
  const location = useLocation();
  const shop = useShop();
  const [query, setQuery] = useState(
    () => new URLSearchParams(location.search).get("q") || "",
  );
  const [filter, setFilter] = useState("all");
  const [announcement, setAnnouncement] = useState("");
  const chooseGroup = (group) => {
    setFilter(group);
    setQuery("");
    navigate("/#products");
  };
  const add = (product) => {
    shop.addToCart(product);
    setAnnouncement(`${product.name} добавлен в корзину`);
  };
  useEffect(() => {
    const id = location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [location.pathname, location.hash, location.key]);

  return (
    <div className="shop-shell min-h-screen bg-[#f5f6f7] flex flex-col">
      <Navbar
        query={query}
        onSearch={(value) => {
          setQuery(value);
          setFilter("all");
        }}
        onSearchSubmit={() => {
          setFilter("all");
          navigate(`/catalog?q=${encodeURIComponent(query.trim())}`);
        }}
        cartCount={shop.cartCount}
        favoriteCount={shop.favorites.length}
        onCart={() => navigate("/cart")}
        onFavorites={() => navigate("/favorites")}
        onInfo={shop.openInfo}
      />
      <main id="main" className="flex-1">
        <Outlet
          context={{
            query,
            filter,
            setFilter,
            setQuery,
            favorites: shop.favorites,
            favorite: shop.toggleFavorite,
            add,
            info: shop.openInfo,
            chooseGroup,
          }}
        />
      </main>
      <Footer onInfo={shop.openInfo} />
      <p className="home-sr-only" role="status">
        {t(announcement)}
      </p>
      <ShopDialog />
    </div>
  );
}
