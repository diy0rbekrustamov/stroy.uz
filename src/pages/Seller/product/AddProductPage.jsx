import { useLanguage } from "../../../i18n/useLanguage.js";
import { useState } from "react";

export default function AddProductPage() {
  const { t } = useLanguage();

  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState("all");

  return (
    <>
      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 w-full">
        <div className="text-[11px] text-gray-400 mb-1 hidden md:block">
          {t("← Мои товары")}
        </div>
        <h1 className="text-[28px] md:text-[36px] font-bold text-[#111827] tracking-tight">
          {t("Добавить товар")}
        </h1>
        <p className="text-[13px] md:text-sm text-gray-500 mb-3 mt-1">
          {t("Создайте понятную карточку для покупателя.")}
        </p>

        <div className="bg-[#FEF3C7] text-[11px] p-2.5 rounded-lg mb-4 text-[#92400E] leading-[1.4]">
          {t(
            "ДЕМО • Товар и данные продавца приведены для макета. Поля * обязательны.",
          )}
        </div>

        {/* Steps - Mobileda 2 qatorda */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setFilter("all")}
            className={`text-[13px] px-4 py-2 rounded-full md:rounded-lg font-medium whitespace-nowrap transition ${filter === "all" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-600"}`}
          >
            {t("1 · Основное")}
          </button>
          <button
            onClick={() => setFilter("pub")}
            className={`text-[13px] px-4 py-2 rounded-full md:rounded-lg font-medium whitespace-nowrap transition ${filter === "pub" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-500"}`}
          >
            {t("2 · Характеристики")}
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`text-[13px] px-4 py-2 rounded-full md:rounded-lg font-medium whitespace-nowrap transition ${filter === "draft" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-500"}`}
          >
            {t("3 · Продажа")}
          </button>
        </div>

        {/* 01 */}
        <section className="bg-white rounded-xl p-4 md:p-5 shadow-sm mb-4 border border-gray-100">
          <h2 className="font-bold text-[15px] mb-4">
            {t("01 / Основная информация")}
          </h2>
          <div className="border border-gray-100 rounded-lg p-3 mb-3">
            <label className="text-[11px] font-semibold">
              {t("Название товара *")}
            </label>
            <input
              placeholder={t("Введите название товара")}
              className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              {t("До 120 символов. Укажите тип и ключевую характеристику.")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px] font-semibold">
                {t("Категория *")}
              </label>
              <div className="text-sm text-gray-400 mt-1">
                {t("Выберите категорию ∨")}
              </div>
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">{t("Артикул")}</label>
              <input
                placeholder={t("Введите артикул")}
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
          <label className="text-[11px] font-bold">{t("Фотографии *")}</label>
          <div className="bg-[#F8FAFC] border border-dashed border-gray-200 rounded-lg p-6 mt-2 text-center">
            <div className="text-xl mb-2">↑</div>
            <p className="text-xs font-medium">
              {t("Перетащите фото или выберите файлы")}
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              {t("JPG, PNG, WebP - до 10 МБ, до 8 фото")}
            </p>
            <button className="mt-3 w-full bg-white border rounded-md py-2 text-xs">
              {t("Выбрать фото →")}
            </button>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 mt-4">
            <label className="text-[11px]">{t("Описание *")}</label>
            <textarea
              placeholder={t("Введите назначение товара...")}
              className="w-full text-sm mt-1 outline-none resize-none placeholder:text-gray-400"
              rows={3}
            />
          </div>
        </section>

        {/* 02 */}
        <section className="bg-white rounded-xl p-5 shadow-sm mb-4 border border-gray-100">
          <h2 className="font-bold text-[15px] mb-4">
            {t("02 / Характеристики")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px] font-semibold">{t("Тип *")}</label>
              <div className="text-sm text-gray-400 mt-1">
                {t("Выберите тип ∨")}
              </div>
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">{t("Напряжение, В *")}</label>
              <input
                placeholder={t("Введите напряжение")}
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="border border-gray-100 rounded-lg p-3 col-span-2">
              <label className="text-[11px] font-semibold">
                {t("Комплектация *")}
              </label>
              <input
                placeholder={t("Введите комплектацию")}
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">{t("Режимы")}</label>
              <input
                placeholder={t("Введите режимы")}
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">{t("Цвет корпуса")}</label>
              <input
                placeholder={t("Введите цвет")}
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
          <button className="w-full mt-3 border rounded-lg py-2.5 text-xs">
            {t("Добавить характеристику →")}
          </button>
        </section>

        {/* 03 */}
        <section className="bg-white rounded-xl p-5 shadow-sm mb-4 border border-gray-100">
          <h2 className="font-bold text-[15px] mb-4">
            {t("03 / Цена и наличие")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">{t("Цена, сум *")}</label>
              <input
                placeholder={t("Введите цену")}
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
              <p className="text-[9px] text-gray-400">
                {t("Часто больше нуля")}
              </p>
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">{t("Единица продажи *")}</label>
              <div className="text-sm text-gray-400 mt-1">
                {t("Выберите единицу ∨")}
              </div>
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">{t("Остаток *")}</label>
              <input
                placeholder={t("Введите количество")}
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">{t("Минимальный заказ")}</label>
              <div className="text-sm mt-1">1</div>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-3">
            {t(
              "При остатке 0 товар недоступен для заказа. Цена в сум за выбранную единицу, доставка не включена.",
            )}
          </p>
        </section>

        {/* 04 */}
        <section className="bg-white rounded-xl p-5 shadow-sm mb-4 border border-gray-100">
          <h2 className="font-bold text-[15px] mb-4">
            {t("04 / Получение товара")}
          </h2>
          <div className="border border-gray-100 rounded-lg p-3 mb-3">
            <label className="text-[11px] font-semibold">
              {t("Город склада *")}
            </label>
            <div className="text-sm text-gray-400 mt-1">
              {t("Выберите город ∨")}
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" defaultChecked />
              {t("Доставка по Узбекистану")}
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" defaultChecked />
              {t("Самовывоз")}
            </label>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 h-[90px]">
            <label className="text-[11px]">
              {t("Условия доставки и самовывоза *")}
            </label>
            <textarea
              placeholder={t(
                "Введите сроки, зону доставки и условия самовывоза",
              )}
              className="w-full text-sm mt-1 outline-none resize-none placeholder:text-gray-400"
            />
          </div>
        </section>

        {/* Публикация */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-[15px] mb-3">{t("Публикация")}</h2>
          <label className="flex items-start gap-2 text-[11px] text-gray-500 mb-4">
            <input type="checkbox" className="mt-0.5" />
            {t(
              "Подтверждаю, что информация и права на фотографии проверены перед публикацией",
            )}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-[#F59E0B] hover:bg-[#D97706] text-black text-xs font-semibold py-3 rounded-lg">
              {t("Опубликовать товар →")}
            </button>
            <button className="bg-white border text-xs py-3 rounded-lg">
              {t("Сохранить черновик →")}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-3">
            {t(
              "Черновик не виден покупателям. Для публикации заполните обязательные поля и добавьте фото.",
            )}
          </p>
        </section>
      </main>
    </>
  );
}
