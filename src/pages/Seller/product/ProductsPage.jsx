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
    <>
      <main className="flex-1 min-w-0 w-full">
        <div className="text-[11px] text-gray-400 mb-2 hidden md:block">
          ← Кабинет продавца
        </div>
        <h1 className="text-[28px] md:text-[36px] font-bold text-[#111827] tracking-tight">
          Мои товары
        </h1>

        <p className="text-[14px] md:text-[14px] text-gray-500 mt-1 mb-4 leading-snug">
          Ассортимент, остатки и публикации в одном месте.
        </p>

        <div className="bg-[#FFF7E0] md:bg-[#FEF3C7]/70 text-[11px] md:text-[11px] p-3 rounded-lg mb-5 text-[#7A5A20] md:text-[#92400E]">
          ДЕМО • Данные, исполнители, цены и заказы вымышлены. Не подтверждённые
          факты о бизнесе.
        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-5">
          <div className="bg-white rounded-xl md:rounded-[14px] p-4 md:p-5 border border-gray-100 shadow-sm">
            <div className="text-[28px] font-bold leading-none">3</div>
            <div className="text-[13px] text-gray-500 mt-6 md:mt-10">
              Всего товаров
            </div>
          </div>
          <div className="bg-white rounded-xl md:rounded-[14px] p-4 md:p-5 border border-gray-100 shadow-sm">
            <div className="text-[28px] font-bold leading-none">2</div>
            <div className="text-[13px] text-gray-500 mt-6 md:mt-10">
              Опубликованы
            </div>
          </div>
          <div className="bg-white rounded-xl md:rounded-[14px] p-4 md:p-5 border border-gray-100 shadow-sm">
            <div className="text-[28px] font-bold leading-none">3</div>
            <div className="text-[13px] text-gray-500 mt-6 md:mt-10">
              Черновиков
            </div>
          </div>
        </div>

        {/* Search + Button */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="text-[11px] text-gray-400">Поиск</div>
            <input
              placeholder="Название услуги"
              className="w-full text-[14px] outline-none placeholder:text-gray-900 mt-1 font-medium"
              defaultValue="Название услуги"
            />
          </div>
          <button className="bg-[#F59E0B] hover:bg-[#E68A00] text-black text-[14px] font-semibold px-6 py-4 md:py-0 rounded-xl md:self-stretch flex items-center justify-center gap-2 w-full md:w-auto md:min-w-[200px]">
            Добавить услугу <span className="text-[16px]">→</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setFilter("all")}
            className={`text-[13px] px-4 py-2 rounded-full md:rounded-lg font-medium whitespace-nowrap transition ${filter === "all" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-600"}`}
          >
            Все · 3
          </button>
          <button
            onClick={() => setFilter("pub")}
            className={`text-[13px] px-4 py-2 rounded-full md:rounded-lg font-medium whitespace-nowrap transition ${filter === "pub" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-500"}`}
          >
            Опубликованы · 2
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`text-[13px] px-4 py-2 rounded-full md:rounded-lg font-medium whitespace-nowrap transition ${filter === "draft" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-500"}`}
          >
            Черновики · 1
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
            Карточка с нулевым остатком не доступна для заказа. Проверьте цену,
            фотографии и условия доставки перед публикацией.
          </div>
        </div>
      </main>
    </>
  );
}
