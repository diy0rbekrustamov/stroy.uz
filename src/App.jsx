import { ShopProvider } from "./context/ShopContext.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import CategoriesPage from "./pages/CategoriesPage.jsx";
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
import CartPage from "./pages/CartPage.jsx";
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <HomePage />,
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
          path: "register",
          element: <RegisterPage />,
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
          path: "cart",
          element: <CartPage />,
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
              element: <ServicesPage />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <ShopProvider>
      <RouterProvider router={router} />
    </ShopProvider>
  );
}

export default App;
