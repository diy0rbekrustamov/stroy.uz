import { useLanguage } from "../../../i18n/useLanguage.js";
import { useState } from "react";
import { useSession } from "../../../api/useSession.js";
import ApiOrders from "../../../components/seller/ApiOrders.jsx";

const orders = [
  {
    id: "DEMO-1040",
    date: "09 окт · 16:40",
    title: "Цемент М400 · 10 мешков",
    buyer: "Покупатель В · Бухара",
    price: "620 000 сум",
    note: "Доставка отдельно · стоимость уточняется",
    status: "В сборке",
    type: "Товары",
    action: "Отметить отправку",
    primary: true,
  },
  {
    id: "DEMO-1039",
    date: "08 окт · 12:00",
    title: "Кирпич керамический · 100 шт.",
    buyer: "Покупатель Г · Бухара",
    price: "280 000 сум",
    note: "Доставка отдельно · стоимость уточняется",
    status: "Завершён",
    type: "Товары",
    action: "Открыть заказ",
    primary: false,
  },
  {
    id: "DEMO-1038",
    date: "07 окт · 10:20",
    title: "Штукатурка стен под маяк · 60 м²",
    buyer: "Заказчик А · Бухара",
    price: "2 700 000 сум",
    note: "Смета на уточнении",
    status: "Смета на уточнении",
    type: "Услуги",
    action: "Согласовать смету",
    primary: true,
  },
  {
    id: "DEMO-1037",
    date: "06 окт · 09:15",
    title: "Укладка плитки · 25 м²",
    buyer: "Заказчик Б · Бухара",
    price: "2 000 000 сум",
    note: "Новый заказ",
    status: "Новый заказ",
    type: "Услуги",
    action: "Принять заявку",
    primary: true,
  },
];

export default function OrdersPage() {
  const { t } = useLanguage();
  const {user} = useSession();

  const [filter, setFilter] = useState("Все");
  const [query, setQuery] = useState("");

  const filtered = orders.filter((o) => {
    if (filter === "Товары" && o.type !== "Товары") return false;
    if (filter === "Услуги" && o.type !== "Услуги") return false;
    if (filter === "Завершена" && o.status !== "Завершён") return false;
    if (
      query &&
      !`${o.id} ${o.title}`.toLowerCase().includes(query.toLowerCase())
    )
      return false;
    return true;
  });

  if(user) return <ApiOrders />;
  return (
    <div className="bg-[#F4F5F7] flex-1 min-w-0 w-full">
      <div className="text-[11px] text-gray-400 mb-2 hidden md:block">
        {t("← Кабинет продавца")}
      </div>
      <h1 className="text-[28px] md:text-[36px] font-bold">
        {t("Заказы и заявки")}
      </h1>
      <p className="text-[14px] text-gray-500 mt-1">
        {t("Обрабатывайте покупки и согласуйте сметы на услуги.")}
      </p>
      <div className="bg-[#FFF7E0] text-[11px] p-3 rounded-lg my-4">
        {t("ДЕМО • Данные, исполнители, цены и заказы вымышлены.")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-[28px] font-bold">1</div>
          <div className="text-[13px] mt-8">{t("Новый заказ")}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-[28px] font-bold">1</div>
          <div className="text-[13px] mt-8">{t("Смета на уточнении")}</div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <div className="text-[28px] font-bold">1</div>
          <div className="text-[13px] mt-8">{t("В сборке")}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
        <div className="text-[11px] text-gray-400">{t("Поиск заказа")}</div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("Номер, товар или услуга")}
          className="w-full outline-none font-medium mt-1"
        />
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto">
        {["Все · 4", "Товары · 3", "Услуги · 1", "Завершена · 1"].map((l) => {
          const label = l.split(" ·")[0];
          return (
            <button
              key={l}
              onClick={() => setFilter(label)}
              className={`px-4 py-2 rounded-full md:rounded-lg text-[13px] whitespace-nowrap ${filter === label ? "bg-[#1C2E42] text-white" : "text-gray-600"}`}
            >
              {t(l)}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        {filtered.map((o) => (
          <div
            key={o.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-5 flex flex-col md:flex-row gap-4"
          >
            <div className="md:w-[160px] shrink-0">
              <div className="font-bold text-[15px]">{t(o.id)}</div>
              <div className="text-[12px] text-gray-400 mt-1">{t(o.date)}</div>
              <div className="text-[12px] mt-2">{t("ДЕМО")}</div>
            </div>
            <div className="flex-1">
              <div className="font-bold">{t(o.title)}</div>
              <div className="text-[13px] text-gray-400 mt-1">{t(o.buyer)}</div>
              <div className="font-bold mt-2">{t(o.price)}</div>
              <div className="text-[12px] text-gray-400 mt-2">{t(o.note)}</div>
            </div>
            <div className="md:w-[200px] shrink-0 flex flex-col gap-2">
              <div
                className={`text-[13px] ${o.status === "Завершён" ? "text-[#2E7D6F]" : ""}`}
              >
                {t(o.status)}
              </div>
              <button
                className={`w-full rounded-lg py-3 text-[13px] font-medium ${o.primary ? "bg-[#F59E0B]" : "border"}`}
              >
                {t(o.action)} →
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mt-6">
        <div className="font-bold text-[18px]">
          {t("Не смешивайте заявку и заказ")}
        </div>
        <div className="text-[13px] text-gray-500 mt-3">
          {t("Услуга начинается с уточнения сметы, а не с оплаты.")}
        </div>
      </div>
    </div>
  );
}
