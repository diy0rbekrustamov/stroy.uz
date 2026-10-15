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
<<<<<<< HEAD
import OrdersPage from "./pages/Seller/order/OrdersPage.jsx";
<<<<<<< HEAD
=======
>>>>>>> feature/catalog-categories
import CartPage from "./pages/CartPage.jsx";
function App() {
  const router = createBrowserRouter([
=======
const router = createBrowserRouter([
>>>>>>> 17a860a4b294322dcdb344b98c34d65bad6bd269
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "product/:productId", element: <ProductPage /> },
        { path: "product", element: <ProductPage /> },
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
              element: <OrdersPage />,
            },
          ],
        },
      ],
    },
  ]);

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> feature/catalog-categories
  return (
    <ShopProvider>
      <RouterProvider router={router} />
    </ShopProvider>
  );
<<<<<<< HEAD
=======
function App() {
  return <ShopProvider><RouterProvider router={router} /></ShopProvider>;
>>>>>>> 17a860a4b294322dcdb344b98c34d65bad6bd269
=======
>>>>>>> feature/catalog-categories
}

export default App;

