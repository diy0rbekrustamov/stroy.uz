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
const router = createBrowserRouter([
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
