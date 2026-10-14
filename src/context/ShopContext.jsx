import { createContext, useContext, useMemo, useState } from "react";

const ShopContext = createContext(null);
const readStored = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => readStored("stroy-uz-cart", {}));
  const [favorites, setFavorites] = useState(() => readStored("stroy-uz-favorites", []));
  const [dialog, setDialog] = useState(null);
  const updateCart = (updater) => setCart((current) => {
    const next = updater(current);
    try { localStorage.setItem("stroy-uz-cart", JSON.stringify(next)); } catch { /* Storage can be disabled. */ }
    return next;
  });
  const toggleFavorite = (id) => setFavorites((current) => {
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    try { localStorage.setItem("stroy-uz-favorites", JSON.stringify(next)); } catch { /* Storage can be disabled. */ }
    return next;
  });
  const addToCart = (product, quantity = 1) => updateCart((current) => ({
    ...current,
    [product.id]: (current[product.id] || 0) + Math.max(1, quantity),
  }));
  const changeQuantity = (id, delta) => updateCart((current) => {
    const next = { ...current, [id]: Math.max(0, (current[id] || 0) + delta) };
    if (!next[id]) delete next[id];
    return next;
  });
  const cartCount = Object.values(cart).reduce((sum, amount) => sum + amount, 0);
  const value = useMemo(() => ({
    cart, favorites, cartCount, addToCart, changeQuantity, toggleFavorite,
    dialog, closeDialog: () => setDialog(null),
    openCart: () => setDialog({ type: "cart", title: "Корзина" }),
    openFavorites: () => setDialog({ type: "favorites", title: "Избранное" }),
    openInfo: (title, text = "Этот раздел пока готовится.") => setDialog({ type: "info", title, text }),
  }), [cart, favorites, cartCount, dialog]);
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be inside ShopProvider");
  return context;
}
