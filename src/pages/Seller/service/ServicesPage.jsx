import { useState } from "react";

const services = [
  {
    id: 1,
    title: "Штукатурка стен под маяк",
    price: "от 45 000 сум / м²",
    location: "Бухара · до 20 км · Пн-Сб, 09:00–18:00",
    desc: "Ориентир для сметы / ДЕМО",
    status: "Опубликована",
    заявок: "2 новые заявки",
    img: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=250&fit=crop",
    action: "Приостановить",
  },
  {
    id: 2,
    title: "Укладка керамической плитки",
    price: "от 80 000 сум / м²",
    location: "Бухара · По согласованию",
    desc: "Ориентир для сметы / ДЕМО",
    status: "Опубликована",
    заявок: "1 новая заявка",
    img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=250&fit=crop",
    action: "Приостановить",
  },
  {
    id: 3,
    title: "Покраска стен и потолков",
    price: "от 25 000 сум / м²",
    location: "Бухара · Не задано",
    desc: "Ориентир для сметы / ДЕМО",
    status: "Черновик",
    заявок: "Нет заявок",
    img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=250&fit=crop",
    action: "Опубликовать",
  },
];

export default function MyServicesPage() {
  const [filter, setFilter] = useState("all");

  const filtered = services.filter((s) => {
    if (filter === "all") return true;
    if (filter === "pub") return s.status === "Опубликована";
    if (filter === "draft") return s.status === "Черновик";
    return true;
  });

  return (
    <>
      {/* MAIN */}
      <main className="flex-1 min-w-0 w-full">
        <div className="text-[11px] text-gray-400 mb-2 hidden md:block">
          ← Кабинет продавца
        </div>
        <h1 className="text-[28px] md:text-[36px] font-bold text-[#111827] tracking-tight">
          Мои услуги
        </h1>
        <p className="text-[14px] md:text-[14px] text-gray-500 mt-1 mb-4 leading-snug">
          Ваши работы, доступные даты и входящие заявки.
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
              Услуги
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
              Новые заявки
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

        {/* Service Cards */}
        <div className="space-y-4">
          {filtered.map((s) => (
            <div
              key={s.id}
              className="bg-white rounded-xl md:rounded-[14px] border border-gray-100 shadow-sm p-3 md:p-4 flex flex-col md:flex-row gap-4"
            >
              {/* Image - Desktop 160x110, Mobile full width 16:9 */}
              <div className="w-full md:w-[160px] h-[200px] md:h-[110px] rounded-lg md:rounded-[10px] overflow-hidden shrink-0">
                <img
                  src={s.img}
                  alt={s.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 px-1 md:px-0">
                <h3 className="font-bold text-[18px] md:text-[18px] leading-tight text-[#111827]">
                  {s.title}
                </h3>
                <div className="font-bold text-[14px] mt-2">{s.price}</div>
                <div className="text-[12px] text-gray-400 md:text-gray-500 mt-2 md:mt-3">
                  {s.location}
                </div>
                <div className="text-[12px] text-gray-600 mt-2">{s.desc}</div>
              </div>

              {/* Right side */}
              <div className="w-full md:w-[200px] shrink-0 flex flex-col gap-2 px-1 md:px-0 pb-1 md:pb-0">
                <div
                  className={`text-[13px] font-medium ${s.status === "Опубликована" ? "text-[#2E7D6F]" : "text-gray-500"}`}
                >
                  {s.status}
                </div>
                <div className="text-[13px] text-gray-800 mb-1">{s.заявок}</div>
                <button className="w-full border border-gray-200 rounded-lg py-3 text-[13px] font-medium flex items-center justify-center gap-2 hover:bg-gray-50">
                  Редактировать <span>→</span>
                </button>
                <button className="text-[12px] text-gray-600 text-left px-1 hover:text-black">
                  {s.action}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 mt-6">
          <div className="font-bold text-[18px] mb-3">
            Цена — отправная точка
          </div>
          <div className="text-[13px] text-gray-500 leading-relaxed">
            Для каждого заказа согласуйте объём и итоговую стоимость. Обновляйте
            доступность, чтобы покупатель мог выбрать подходящее время.
          </div>
        </div>
      </main>
    </>
  );
}
