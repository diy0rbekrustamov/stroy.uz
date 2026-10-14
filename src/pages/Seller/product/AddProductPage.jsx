import { useState } from "react";

export default function AddProductPage() {
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState("all");

  return (
    <>
      {/* MAIN CONTENT */}
      <main className="flex-1 min-w-0 w-full">
        <div className="text-[11px] text-gray-400 mb-1 hidden md:block">
          ← Мои товары
        </div>
        <h1 className="text-[28px] md:text-[36px] font-bold text-[#111827] tracking-tight">
          Добавить товар
        </h1>
        <p className="text-[13px] md:text-sm text-gray-500 mb-3 mt-1">
          Создайте понятную карточку для покупателя.
        </p>

        <div className="bg-[#FEF3C7] text-[11px] p-2.5 rounded-lg mb-4 text-[#92400E] leading-[1.4]">
          ДЕМО • Товар и данные продавца приведены для макета. Поля *
          обязательны.
        </div>

        {/* Steps - Mobileda 2 qatorda */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setFilter("all")}
            className={`text-[13px] px-4 py-2 rounded-full md:rounded-lg font-medium whitespace-nowrap transition ${filter === "all" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-600"}`}
          >
            1 · Основное
          </button>
          <button
            onClick={() => setFilter("pub")}
            className={`text-[13px] px-4 py-2 rounded-full md:rounded-lg font-medium whitespace-nowrap transition ${filter === "pub" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-500"}`}
          >
            2 · Характеристики
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`text-[13px] px-4 py-2 rounded-full md:rounded-lg font-medium whitespace-nowrap transition ${filter === "draft" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-500"}`}
          >
            3 · Продажа
          </button>
        </div>

        {/* 01 */}
        <section className="bg-white rounded-xl p-4 md:p-5 shadow-sm mb-4 border border-gray-100">
          <h2 className="font-bold text-[15px] mb-4">
            01 / Основная информация
          </h2>
          <div className="border border-gray-100 rounded-lg p-3 mb-3">
            <label className="text-[11px] font-semibold">
              Название товара *
            </label>
            <input
              placeholder="Введите название товара"
              className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              До 120 символов. Укажите тип и ключевую характеристику.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px] font-semibold">Категория *</label>
              <div className="text-sm text-gray-400 mt-1">
                Выберите категорию ∨
              </div>
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">Артикул</label>
              <input
                placeholder="Введите артикул"
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
          <label className="text-[11px] font-bold">Фотографии *</label>
          <div className="bg-[#F8FAFC] border border-dashed border-gray-200 rounded-lg p-6 mt-2 text-center">
            <div className="text-xl mb-2">↑</div>
            <p className="text-xs font-medium">
              Перетащите фото или выберите файлы
            </p>
            <p className="text-[10px] text-gray-400 mt-1">
              JPG, PNG, WebP - до 10 МБ, до 8 фото
            </p>
            <button className="mt-3 w-full bg-white border rounded-md py-2 text-xs">
              Выбрать фото →
            </button>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 mt-4">
            <label className="text-[11px]">Описание *</label>
            <textarea
              placeholder="Введите назначение товара..."
              className="w-full text-sm mt-1 outline-none resize-none placeholder:text-gray-400"
              rows={3}
            />
          </div>
        </section>

        {/* 02 */}
        <section className="bg-white rounded-xl p-5 shadow-sm mb-4 border border-gray-100">
          <h2 className="font-bold text-[15px] mb-4">02 / Характеристики</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px] font-semibold">Тип *</label>
              <div className="text-sm text-gray-400 mt-1">Выберите тип ∨</div>
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">Напряжение, В *</label>
              <input
                placeholder="Введите напряжение"
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="border border-gray-100 rounded-lg p-3 col-span-2">
              <label className="text-[11px] font-semibold">
                Комплектация *
              </label>
              <input
                placeholder="Введите комплектацию"
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">Режимы</label>
              <input
                placeholder="Введите режимы"
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">Цвет корпуса</label>
              <input
                placeholder="Введите цвет"
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
          <button className="w-full mt-3 border rounded-lg py-2.5 text-xs">
            Добавить характеристику →
          </button>
        </section>

        {/* 03 */}
        <section className="bg-white rounded-xl p-5 shadow-sm mb-4 border border-gray-100">
          <h2 className="font-bold text-[15px] mb-4">03 / Цена и наличие</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">Цена, сум *</label>
              <input
                placeholder="Введите цену"
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
              <p className="text-[9px] text-gray-400">Часто больше нуля</p>
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">Единица продажи *</label>
              <div className="text-sm text-gray-400 mt-1">
                Выберите единицу ∨
              </div>
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">Остаток *</label>
              <input
                placeholder="Введите количество"
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-[11px]">Минимальный заказ</label>
              <div className="text-sm mt-1">1</div>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-3">
            При остатке 0 товар недоступен для заказа. Цена в сум за выбранную
            единицу, доставка не включена.
          </p>
        </section>

        {/* 04 */}
        <section className="bg-white rounded-xl p-5 shadow-sm mb-4 border border-gray-100">
          <h2 className="font-bold text-[15px] mb-4">04 / Получение товара</h2>
          <div className="border border-gray-100 rounded-lg p-3 mb-3">
            <label className="text-[11px] font-semibold">Город склада *</label>
            <div className="text-sm text-gray-400 mt-1">Выберите город ∨</div>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" defaultChecked /> Доставка по Узбекистану
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" defaultChecked /> Самовывоз
            </label>
          </div>
          <div className="border border-gray-100 rounded-lg p-3 h-[90px]">
            <label className="text-[11px]">
              Условия доставки и самовывоза *
            </label>
            <textarea
              placeholder="Введите сроки, зону доставки и условия самовывоза"
              className="w-full text-sm mt-1 outline-none resize-none placeholder:text-gray-400"
            />
          </div>
        </section>

        {/* Публикация */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-[15px] mb-3">Публикация</h2>
          <label className="flex items-start gap-2 text-[11px] text-gray-500 mb-4">
            <input type="checkbox" className="mt-0.5" /> Подтверждаю, что
            информация и права на фотографии проверены перед публикацией
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-[#F59E0B] hover:bg-[#D97706] text-black text-xs font-semibold py-3 rounded-lg">
              Опубликовать товар →
            </button>
            <button className="bg-white border text-xs py-3 rounded-lg">
              Сохранить черновик →
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-3">
            Черновик не виден покупателям. Для публикации заполните обязательные
            поля и добавьте фото.
          </p>
        </section>
      </main>
    </>
  );
}
