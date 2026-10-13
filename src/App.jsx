import { Children } from "react";
import Layout from "./components/layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import AddProductPage from "./pages/Seller/product/AddProductPage.jsx";
import ProductsPage from "./pages/Seller/product/ProductsPage.jsx";
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
          path: "add-product",
          element: <AddProductPage />,
        },
        {
          path: "my-product",
          element: <ProductsPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
