import { createBrowserRouter, RouterProvider } from "react-router";
import { ShopProvider } from "./context/ShopContext.jsx";
import Layout from "./components/layout/Layout.jsx";
import LayoutSeller from "./components/seller/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import ProductsPage from "./pages/Seller/product/ProductsPage.jsx";
import AddProductPage from "./pages/Seller/product/AddProductPage.jsx";
import ServicesPage from "./pages/Seller/service/ServicesPage.jsx";
import OrdersPage from "./pages/Seller/order/OrdersPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "catalog", element: <CatalogPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "favorites", element: <FavoritesPage /> },
      { path: "product", element: <ProductPage /> },
      { path: "product/:productId", element: <ProductPage /> },
      { path: "cart", element: <CartPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "reset-password", element: <ResetPasswordPage /> },
      {
        path: "seller",
        element: <LayoutSeller />,
        children: [
          { index: true, element: <ProductsPage /> },
          { path: "add-product", element: <AddProductPage /> },
          { path: "services", element: <ServicesPage /> },
          { path: "orders", element: <OrdersPage /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <ShopProvider>
      <RouterProvider router={router} />
    </ShopProvider>
  );
}

export default App;
