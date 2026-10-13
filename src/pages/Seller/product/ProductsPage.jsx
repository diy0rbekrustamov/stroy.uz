import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Дрель-шуруповёрт 18V",
    sku: "SU-SK10 - ДЕМО",
    price: "890 000",
    stock: "12 шт.",
    status: "Опубликован",
    img: "🔧",
  },
  {
    id: 2,
    name: "Цемент М400 - 50 кг",
    sku: "SU-CM400 - ДЕМО",
    price: "62 000",
    stock: "80 мешков",
    status: "Опубликован",
    img: "📦",
  },
  {
    id: 3,
    name: "Кирпич керамический",
    sku: "SU-BR10 - ДЕМО",
    price: "2 800",
    stock: "1 200 шт.",
    status: "Опубликован",
    img: "🧱",
  },
  {
    id: 4,
    name: "Краска интерьерная - 10 л",
    sku: "SU-PT10 - ДЕМО",
    price: "235 000",
    stock: "0 ведер",
    status: "Черновик",
    img: "🎨",
  },
];

export default function ProductsPage() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="min-h-screen bg-[#F6F7F9] font-sans">
      <div className="p-4 md:p-6 max-w-[1400px] mx-auto flex flex-col md:flex-row gap-4 md:gap-6 items-start">
        <aside className="w-full md:w-[200px] shrink-0 md:sticky md:top-6">
          <div className="bg-[#111D32] rounded-xl p-4">
            <div className="text-white font-bold text-[13px] mb-1">
              Кабинет продавца
            </div>
            <div className="text-[#F59E0B] text-[9px] mb-4 md:mb-5">
              ДЕМО / *Основное
            </div>

            <div className="flex md:flex-col gap-2">
              <div className="bg-[#F59E0B] text-black rounded-lg px-3 py-2 md:py-2.5 text-[13px] font-semibold">
                Товары
              </div>
              <div className="text-gray-400 px-3 py-2 text-[13px]">Услуги</div>
              <div className="text-gray-400 px-3 py-2 text-[13px]">Заказы</div>
            </div>

            <div className="text-gray-500 px-1 md:px-3 py-2 text-[10px] mt-3 md:mt-12 border-t border-white/10 pt-3 md:pt-4">
              Профиль • Настройки • Выйти
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 w-full">
          <h1 className="text-[22px] md:text-[26px] font-bold">Мои товары</h1>
          <p className="text-[12px] md:text-sm text-gray-500 mb-3">
            Ассортимент, остатки и публикации в одном месте.
          </p>
          <div className="bg-[#FEF3C7] text-[10px] md:text-[11px] p-2.5 rounded-lg mb-4">
            ДЕМО • Данные, количество, цены и заказы вымышлены. Не подтверждает
            факты о бизнесе.
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm mb-4 border border-gray-100">
              <div className="text-[20px] font-bold">4</div>
              <div className="text-[10px] md:text-[11px] text-gray-500">
                Всего товаров
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm mb-4 border border-gray-100">
              <div className="text-[20px] font-bold">3</div>
              <div className="text-[10px] md:text-[11px] text-gray-500">
                Опубликовано
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 md:p-4 shadow-sm mb-4 border border-gray-100">
              <div className="text-[20px] font-bold">1</div>
              <div className="text-[10px] md:text-[11px] text-gray-500">
                Черновиков
              </div>
            </div>
          </div>

          {/* Search + Button */}
          <div className="bg-white  rounded-xl p-3 shadow-sm mb-4 border border-gray-100  flex flex-col md:flex-row gap-3 mb-4">
            <div className="flex-1">
              <div className="text-[10px] text-gray-400">Поиск</div>
              <input
                placeholder="Название или артикул"
                className="w-full text-sm outline-none placeholder:text-gray-400"
              />
            </div>
            <button className="bg-[#F59E0B] text-black text-[12px] font-semibold px-5 py-2.5 rounded-lg md:self-end w-full md:w-auto">
              Добавить товар →
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto">
            <button
              onClick={() => setFilter("all")}
              className={`text-[12px] px-3 py-1.5 rounded-full border whitespace-nowrap ${filter === "all" ? "bg-[#111D32] text-white" : "bg-white text-gray-600"}`}
            >
              Все - 4
            </button>
            <button
              onClick={() => setFilter("pub")}
              className={`text-[12px] px-3 py-1.5 rounded-full border whitespace-nowrap ${filter === "pub" ? "bg-[#111D32] text-white" : "bg-white text-gray-600"}`}
            >
              Опубликованы - 3
            </button>
            <button
              onClick={() => setFilter("draft")}
              className={`text-[12px] px-3 py-1.5 rounded-full border whitespace-nowrap ${filter === "draft" ? "bg-[#111D32] text-white" : "bg-white text-gray-600"}`}
            >
              Черновики - 1
            </button>
          </div>

          {/* TABLE  */}
          <div className="hidden md:block bg-white rounded-xl border overflow-hidden shadow-sm mb-4 border border-gray-100 ">
            <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-4 px-4 py-2.5 bg-[#F8FAFC] text-[10px] text-gray-400 uppercase font-semibold">
              <div>Товар</div>
              <div>Цена, сум</div>
              <div>Остаток</div>
              <div>Статус / действие</div>
            </div>
            {products.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[2fr_1fr_1fr_1.5fr] gap-4 px-4 py-3 border-t items-center text-[13px]"
              >
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                    {p.img}
                  </div>
                  <div>
                    <div className="font-medium text-[13px]">{p.name}</div>
                    <div className="text-[10px] text-gray-400">{p.sku}</div>
                  </div>
                </div>
                <div className="font-semibold">{p.price}</div>
                <div>{p.stock}</div>
                <div>
                  <div
                    className={`text-[10px] ${p.status === "Черновик" ? "text-gray-500" : "text-[#059669]"}`}
                  >
                    {p.status}
                  </div>
                  <div className="text-[12px] text-[#111D32] underline cursor-pointer">
                    Редактировать →
                  </div>
                  <div className="text-[10px] text-gray-400">
                    Снять с публикации
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CARDS - Mobile */}
          <div className="md:hidden space-y-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border p-3 flex gap-3"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl shrink-0">
                  {p.img}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[13px] leading-tight">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-gray-400 mb-2">{p.sku}</div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-[11px] text-gray-400">Цена</div>
                      <div className="font-bold text-[13px]">{p.price}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400">Остаток</div>
                      <div className="text-[12px]">{p.stock}</div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-[10px] px-2 py-0.5 rounded-full ${p.status === "Черновик" ? "bg-gray-100 text-gray-600" : "bg-green-50 text-green-700"}`}
                      >
                        {p.status}
                      </div>
                      <div className="text-[11px] text-[#111D32] mt-1 underline">
                        Редактировать →
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-gray-400 mt-4">
            Показано 4 из 4 - Страница 1
          </div>

          <div className="bg-white rounded-xl border p-4 mt-4 shadow-sm mb-4 border border-gray-100">
            <div className="font-semibold text-[13px]">
              Держите остатки актуальными
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              Карточка с нулевым остатком не доступна для заказа. Проверьте
              цену, фотографии и условия доставки перед публикацией.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
