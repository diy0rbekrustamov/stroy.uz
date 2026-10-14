import { useShop } from "../../context/ShopContext.jsx";
import Brand from "./Brand.jsx";

const columns = [
  [
    "Каталог",
    [
      ["Стройматериалы", "/#categories"],
      ["Инструменты", "/#products"],
      ["Отделка", "/#categories"],
      ["Сантехника", "/#categories"],
    ],
  ],
  [
    "Покупателям",
    [
      ["Доставка и оплата", "/#services"],
      ["Возврат товара", null],
      ["Частые вопросы", null],
      ["Личный кабинет", null],
    ],
  ],
  [
    "Для бизнеса",
    [
      ["Оптовые поставки", "/#business"],
      ["Коммерческое предложение", "/#business"],
      ["Партнёрство", "/#business"],
      ["О компании", null],
    ],
  ],
];

export default function Footer({ onInfo }) {
  const { openInfo } = useShop();
  const info = (title) =>
    (onInfo || openInfo)(
      title,
      "STROY UZ — концепция маркетплейса строительных материалов. Этот раздел будет доступен после подключения соответствующей страницы командой.",
    );
  return (
    <footer
      className="bg-[#192b38] text-white py-[72px] max-[767px]:py-10"
      id="footer"
    >
      <div className="w-[min(100%-144px,1296px)] max-[1199px]:w-[calc(100%-64px)] max-[767px]:w-[calc(100%-32px)] mx-auto">
        {/*.home-footer-grid */}
        <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-16 max-[1199px]:gap-7 max-[767px]:grid-cols-[1fr_1fr] max-[767px]:gap-x-5 max-[767px]:gap-y-8">
          <div className="max-[767px]:col-span-full">
            <Brand dark />

            <p className="text-[#aab2bd] text-[16px] mt-7 max-[767px]:mt-4">
              Материалы для больших идей.
              <br />
              Строительство. Ремонт. Результат.
            </p>
            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={() => info("Telegram")}
                className="text-inherit bg-transparent p-0 text-left border-0 cursor-pointer"
              >
                Telegram ↗
              </button>
              <button
                type="button"
                onClick={() => info("Instagram")}
                className="text-inherit bg-transparent p-0 text-left border-0 cursor-pointer"
              >
                Instagram ↗
              </button>
            </div>
          </div>
          {columns.map(([title, links]) => (
            <div key={title}>
              <h3 className="text-[16px] font-semibold mb-5 max-[767px]:text-[14px]">
                {title}
              </h3>
              <ul className="list-none p-0 m-0 grid gap-4 text-[#aab2bd] max-[767px]:text-[12px]">
                {links.map(([label, href]) => (
                  <li key={label}>
                    {href ? (
                      <a href={href} className="text-inherit no-underline">
                        {label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => info(label)}
                        className="text-inherit bg-transparent p-0 text-left border-0 cursor-pointer"
                      >
                        {label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/*.home-footer-bottom */}
        <div className="flex justify-between gap-6 border-t border-[#3a4450] mt-10 pt-[44px] text-[11px] text-[#aab2bd] max-[767px]:flex-col max-[767px]:pt-6">
          <span>© STROY UZ. Концепция интернет-магазина.</span>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => info("Конфиденциальность")}
              className="bg-transparent p-0 text-left border-0 cursor-pointer text-inherit"
            >
              Конфиденциальность
            </button>
            <button
              type="button"
              onClick={() => info("Условия использования")}
              className="bg-transparent p-0 text-left border-0 cursor-pointer text-inherit"
            >
              Условия использования
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
