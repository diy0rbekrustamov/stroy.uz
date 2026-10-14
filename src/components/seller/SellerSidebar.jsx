import { NavLink, Outlet, useLocation } from "react-router";

export default function LayoutSeller() {
  const menu = [
    { label: "Товары", path: "/seller", end: true }, // index uchun end:true
    { label: "Услуги", path: "/seller/services" },
    { label: "Заказы", path: "/seller/orders" },
  ];

  return (
    <div className="min-h-screen bg-[#F6F7F9] p-4 md:p-6 flex flex-col md:flex-row gap-6 max-w- mx-auto">
      {/* SIDEBAR - chetda */}
      <aside className="w-full md:w- shrink-0 md:sticky md:top-6">
        <div className="bg-[#111D32] rounded-xl p-4">
          <div className="text-white font-bold text- mb-1">
            Кабинет продавца
          </div>
          <div className="text-[#F59E0B] text- mb-4 md:mb-5">
            ДЕМО / *Основное
          </div>

          <div className="flex md:flex-col gap-2">
            {menu.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 md:py-2.5 text- font-medium transition ${
                    isActive
                      ? "bg-[#F59E0B] text-black font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="text-gray-500 px-1 md:px-3 py-2 text- mt-3 md:mt-12 border-t border-white/10 pt-3 md:pt-4">
            Профиль · Настройки · Выйти
          </div>
        </div>
      </aside>

      {/* ASOSIY CONTENT - shu joyda children chiqadi */}
    </div>
  );
}
