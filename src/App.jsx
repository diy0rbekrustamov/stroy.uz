import CartPage from "./pages/CartPage.jsx";
import { ShopProvider } from "./context/ShopContext.jsx";
import LanguageProvider from "./i18n/LanguageProvider.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Layout from "./components/layout/Layout.jsx";
import LayoutSeller from "./components/seller/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import AddProductPage from "./pages/Seller/product/AddProductPage.jsx";
import ProductsPage from "./pages/Seller/product/ProductsPage.jsx";
import ServicesPage from "./pages/Seller/service/ServicesPage.jsx";
import OrdersPage from "./pages/Seller/order/OrdersPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";

import CatalogPage from "./pages/CatalogPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "cart", element: <CartPage /> },
      { path: "product/:productId", element: <ProductPage /> },
      { path: "product", element: <ProductPage /> },
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "catalog",
        element: <CatalogPage />,
      },
      {
        path: "categories",
        element: <CategoriesPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "reset-password",
        element: <ResetPasswordPage />,
      },
      {
        path: "favorites",
        element: <FavoritesPage />,
      },
      {
        path: "product/:productId",
        element: <ProductPage />,
      },
      {
        path: "product",
        element: <ProductPage />,
      },
      {
        path: "seller",
        element: <LayoutSeller />,
        children: [
          {
            index: true,
            element: <ProductsPage />,
          },
          {
            path: "add-product",
            element: <AddProductPage />,
          },
          {
            path: "services",
            element: <ServicesPage />,
          },
          {
            path: "orders",
            element: <OrdersPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <LanguageProvider>
      <ShopProvider>
        <RouterProvider router={router} />
      </ShopProvider>
    </LanguageProvider>
  );
}

export default App;
