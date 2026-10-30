import { ShopProvider } from "./context/ShopContext.jsx";
import LanguageProvider from "./i18n/LanguageProvider.jsx";
import Layout from "./components/layout/Layout.jsx";
import LayoutSeller from "./components/seller/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { lazy, Suspense } from "react";
import {
  PageLoading,
  PageNotFound,
  RouteFailure,
} from "./components/ui/PageState.jsx";

const page = (loader) => {
  const Component = lazy(loader);
  return (
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteFailure />,
    children: [
      {
        path: "rentals",
        element: page(() => import("./pages/RentalsPage.jsx")),
      },
      {
        path: "rentals/:rentalId",
        element: page(() => import("./pages/RentalPage.jsx")),
      },
      { path: "cart", element: page(() => import("./pages/CartPage.jsx")) },
      {
        path: "checkout",
        element: page(() => import("./pages/CheckoutPage.jsx")),
      },
      {
        path: "account",
        element: page(() => import("./pages/AccountPage.jsx")),
      },
      {
        path: "services",
        element: page(() => import("./pages/ServicesPage.jsx")),
      },
      {
        path: "services/:serviceId",
        element: page(() => import("./pages/ServicePage.jsx")),
      },
      {
        path: "product/:productId",
        element: page(() => import("./pages/ProductPage.jsx")),
      },
      {
        path: "product",
        element: page(() => import("./pages/ProductPage.jsx")),
      },
      {
        index: true,
        element: <HomePage />,
      },
      { path: "*", element: <PageNotFound /> },
      {
        path: "register",
        element: page(() => import("./pages/RegisterPage.jsx")),
      },
      {
        path: "catalog",
        element: page(() => import("./pages/CatalogPage.jsx")),
      },
      {
        path: "categories",
        element: page(() => import("./pages/CategoriesPage.jsx")),
      },
      {
        path: "login",
        element: page(() => import("./pages/LoginPage.jsx")),
      },
      {
        path: "reset-password",
        element: page(() => import("./pages/ResetPasswordPage.jsx")),
      },
      {
        path: "favorites",
        element: page(() => import("./pages/FavoritesPage.jsx")),
      },
      {
        path: "seller",
        element: <LayoutSeller />,
        children: [
          {
            path: "rentals",
            element: page(() => import("./pages/Seller/RentalsPage.jsx")),
          },
          {
            index: true,
            element: page(
              () => import("./pages/Seller/product/ProductsPage.jsx"),
            ),
          },
          {
            path: "add-product",
            element: page(
              () => import("./pages/Seller/product/AddProductPage.jsx"),
            ),
          },
          {
            path: "services",
            element: page(
              () => import("./pages/Seller/service/ServicesPage.jsx"),
            ),
          },
          {
            path: "add-service",
            element: page(
              () => import("./pages/Seller/service/AddServicePage.jsx"),
            ),
          },
          {
            path: "orders",
            element: page(() => import("./pages/Seller/order/OrdersPage.jsx")),
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
