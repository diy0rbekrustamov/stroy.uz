import React from "react";
import SellerSidebar from "./SellerSidebar";
import { Outlet } from "react-router";
import { useSession } from "../../api/useSession.js";
import { useLanguage } from "../../i18n/useLanguage.js";
import Button from "../ui/Button.jsx";

function Layout() {
  const { user, loading, error } = useSession(),
    { t } = useLanguage();
  if (!loading && !error && !user)
    return (
      <section className="auth-panel">
        <h1>{t("Кабинет продавца")}</h1>
        <p>{t("Войдите в аккаунт, чтобы продолжить.")}</p>
        <Button to="/login">{t("Войти")}</Button>
      </section>
    );
  if (user && user.role !== "seller")
    return (
      <section className="auth-panel">
        <h1>{t("Кабинет продавца")}</h1>
        <p>{t("Для этого действия нужен аккаунт продавца.")}</p>
        <Button to="/account">{t("Личный кабинет")}</Button>
      </section>
    );
  return (
    <>
      <div className="min-h-screen bg-[#F6F7F9] font-sans">
        <div className="p-4 md:p-6 max-w-[1400px] mx-auto flex flex-col md:flex-row gap-4 md:gap-6 items-start">
          <SellerSidebar />
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
