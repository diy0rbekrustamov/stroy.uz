// src/components/layout/Layout.jsx
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#f5f6f7] flex flex-col homepage">
      <Navbar />
      <main className="flex-1">
        <Outlet /> {/* shu yerga page lar tushadi */}
      </main>
      <Footer />
    </div>
  );
}
