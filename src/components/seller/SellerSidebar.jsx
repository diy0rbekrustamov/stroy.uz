import { useLanguage } from "../../i18n/useLanguage.js";
import { NavLink } from "react-router";
import { useSession } from "../../api/useSession.js";

export default function LayoutSeller() {
  const { t } = useLanguage();
  const { user } = useSession();

  const menu = [
    { label: "Товары", path: "/seller", end: true }, // index uchun end:true
    { label: "Услуги", path: "/seller/services" },
    { label: "Аренда техники", path: "/seller/rentals" },
    { label: "Заказы", path: "/seller/orders" },
  ];

  return (
    <div className="w-full min-w-0 md:w-[220px] shrink-0 bg-[#F6F7F9] flex flex-col gap-6">
      {/* SIDEBAR - chetda */}
      <aside className="w-full min-w-0 shrink-0 md:sticky md:top-6">
        <div className="bg-[#111D32] rounded-xl p-4">
          <div className="text-white font-bold text- mb-1">
            {t("Кабинет продавца")}
          </div>
          <div className="text-[#F59E0B] text- mb-4 md:mb-5">
            {user ? user.storeName : t("ДЕМО / *Основное")}
          </div>

          <div className="flex flex-wrap md:flex-col gap-2">
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
                {t(item.label)}
              </NavLink>
            ))}
          </div>

          <div className="text-gray-500 px-1 md:px-3 py-2 text- mt-3 md:mt-12 border-t border-white/10 pt-3 md:pt-4">
            <NavLink to="/account">{t("Личный кабинет")}</NavLink>
          </div>
        </div>
      </aside>

      {/* ASOSIY CONTENT - shu joyda children chiqadi */}
    </div>
  );
}
