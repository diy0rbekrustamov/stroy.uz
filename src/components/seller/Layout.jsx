import React from "react";
import SellerSidebar from "./SellerSidebar";
import { Outlet } from "react-router";

function Layout() {
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
