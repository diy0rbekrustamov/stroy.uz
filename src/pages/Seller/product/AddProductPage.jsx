import { useLanguage } from "../../../i18n/useLanguage.js";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router";
import { api } from "../../../api/client.js";
import { uploadImage } from "../../../api/upload.js";

// === SELECT OPTIONS ===
const categoryOptions = [
  { value: "tools", label: "Инструменты" },
  { value: "materials", label: "Стройматериалы" },
  { value: "electric", label: "Электрика" },
];
const typesByCategory = {
  tools: [
    "Перфоратор",
    "Дрель",
    "Шуруповерт",
    "Болгарка (УШМ)",
    "Лобзик",
    "Сварочный аппарат",
  ],
  materials: ["Цемент", "Кирпич", "Арматура"],
  electric: ["Кабель", "Розетка", "Автомат"],
};
const voltageOptions = ["12", "18", "20", "220", "380"];
const komplektOptions = [
  "Только инструмент",
  "С кейсом",
  "С аккумулятором и зарядкой",
  "2 аккумулятора + кейс",
  "Полный комплект",
];
const modesOptions = [
  "Сверление",
  "Сверление с ударом",
  "Долбление",
  "Сверление / Удар / Долбление",
];
const colorOptions = [
  "Черный",
  "Синий",
  "Красный",
  "Зеленый",
  "Желтый",
  "Оранжевый",
];

export default function AddProductPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      productName: "",
      category: "",
      article: "",
      description: "",
      photos: [],
      type: "",
      voltage: "",
      equipment: "",
      modes: "",
      color: "",
      price: "",
      unit: "",
      stock: "",
      minOrder: 1,
      city: "",
      deliveryUz: true,
      pickup: true,
      deliveryConditions: "",
      confirm: false,
      customCharacteristics: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customCharacteristics",
  });

  const photos = watch("photos");
  const productName = watch("productName");
  const category = watch("category");
  const availableTypes = category ? typesByCategory[category] || [] : [];

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("productName"));
      if (saved?.defaultName) setValue("productName", saved.defaultName);
    } catch {}
  }, [setValue]);

  const saveProduct = async (data, published) => {
    if (saving) return;
    setSaving(true);
    setSubmissionMessage("");
    try {
      const image = await uploadImage(data.photos[0]);
      await api("/seller/products", {
        method: "POST",
        body: {
          name: data.productName,
          description: data.description,
          category:
            categoryOptions.find((item) => item.value === data.category)
              ?.label || data.category,
          categoryId:
            { tools: "tools", materials: "mixes", electric: "plumbing" }[
              data.category
            ] || "",
          price: Number(data.price),
          stock: Number(data.stock),
          unit: data.unit === "sht" ? "шт." : "комплект",
          city:
            { Tashkent: "Ташкент", Samarkand: "Самарканд" }[data.city] ||
            data.city,
          image,
          published,
          details: [
            data.type,
            data.voltage,
            data.equipment,
            data.modes,
            data.color,
          ]
            .filter(Boolean)
            .join(" · "),
        },
      });
      window.dispatchEvent(new Event("stroy-catalog"));
      navigate("/seller");
    } catch (error) {
      setSubmissionMessage(error.message);
    } finally {
      setSaving(false);
    }
  };
  const onSubmit = (data) => saveProduct(data, true);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 8);
    setValue("photos", files, { shouldValidate: true });
  };

  return (
    <>
      <p role="status" className="text-sm text-amber-900 p-3">
        {t(submissionMessage)}
      </p>
      <main className="flex-1 min-w-0 w-full">
        <div className="text- text-gray-400 mb-1 hidden md:block">
          {t("← Мои товары")}
        </div>
        <h1 className="text- md:text- font-bold text-[#111827] tracking-tight">
          {t("Добавить товар")}
        </h1>
        <p className="text- md:text-sm text-gray-500 mb-3 mt-1">
          {t("Создайте понятную карточку для покупателя.")}
        </p>

        <div className="bg-[#FEF3C7] text- p-2.5 rounded-lg mb-4 text-[#92400E] leading-[1.4]">
          {t(
            "Заполните данные объявления. Поля * обязательны.",
          )}
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => setFilter("all")}
            className={`text- px-4 py-2 rounded-full md:rounded-lg font-medium whitespace-nowrap transition ${filter === "all" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-600"}`}
          >
            {t("1 · Основное")}
          </button>
          <button
            onClick={() => setFilter("pub")}
            className={`text- px-4 py-2 rounded-full md:rounded-lg font-medium whitespace-nowrap transition ${filter === "pub" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-500"}`}
          >
            {t("2 · Характеристики")}
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`text- px-4 py-2 rounded-full md:rounded-lg font-medium whitespace-nowrap transition ${filter === "draft" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-500"}`}
          >
            {t("3 · Продажа")}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* 01 */}
          <section className="bg-white rounded-xl p-4 md:p-5 shadow-sm mb-4 border border-gray-100">
            <h2 className="font-bold text- mb-4">
              {t("01 / Основная информация")}
            </h2>
            <div className="border border-gray-100 rounded-lg p-3 mb-3">
              <label className="text- font-semibold">
                {t("Название товара *")}
              </label>
              <input
                {...register("productName", {
                  required: "Введите название",
                  maxLength: { value: 120, message: "До 120 символов" },
                })}
                placeholder={t("Введите название товара")}
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
              {errors.productName && (
                <p className="text- text-red-500 mt-1">
                  {t(errors.productName.message)}
                </p>
              )}
              <p className="text- text-gray-400 mt-1">
                {t("До 120 символов. Укажите тип и ключевую характеристику.")}{" "}
                {productName?.length || 0}/120
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="border border-gray-100 rounded-lg p-3">
                <label className="text- font-semibold">
                  {t("Категория *")}
                </label>
                <select
                  {...register("category", {
                    required: "Выберите категорию",
                  })}
                  className="w-full text-sm mt-1 outline-none bg-white text-gray-800"
                >
                  <option value="">{t("Выберите категорию ∨")}</option>
                  {categoryOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {t(o.label)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text- text-red-500 mt-1">
                    {t(errors.category.message)}
                  </p>
                )}
              </div>
              <div className="border border-gray-100 rounded-lg p-3">
                <label className="text-">{t("Артикул")}</label>
                <input
                  {...register("article")}
                  placeholder={t("Введите артикул")}
                  className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
            <label className="text- font-bold">{t("Фотографии *")}</label>
            <div className="bg-[#F8FAFC] border border-dashed border-gray-200 rounded-lg p-6 mt-2 text-center">
              <div className="text-xl mb-2">↑</div>
              <p className="text-xs font-medium">
                {t("Перетащите фото или выберите файлы")}
              </p>
              <p className="text- text-gray-400 mt-1">
                {t("JPG, PNG, WebP - до 10 МБ, до 8 фото")}
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                id="photoInput"
              />
              <label
                htmlFor="photoInput"
                className="mt-3 w-full bg-white border rounded-md py-2 text-xs inline-block cursor-pointer"
              >
                {t("Выбрать фото →")}{" "}
                {photos?.length ? `(${photos.length})` : ""}
              </label>
              <input
                type="hidden"
                {...register("photos", {
                  required: "Добавьте хотя бы одно фото",
                  validate: (v) =>
                    v.length > 0 || "Добавьте хотя бы одно фото",
                })}
              />
              {errors.photos && (
                <p className="text- text-red-500 mt-2">
                  {t(errors.photos.message)}
                </p>
              )}
            </div>
            <div className="border border-gray-100 rounded-lg p-3 mt-4">
              <label className="text-">{t("Описание *")}</label>
              <textarea
                {...register("description", {
                  required: "Введите описание",
                  minLength: { value: 20, message: "Минимум 20 символов" },
                })}
                placeholder={t("Введите назначение товара...")}
                className="w-full text-sm mt-1 outline-none resize-none placeholder:text-gray-400"
                rows={3}
              />
              {errors.description && (
                <p className="text- text-red-500 mt-1">
                  {t(errors.description.message)}
                </p>
              )}
            </div>
          </section>

          {/* 02 */}
          <section className="bg-white rounded-xl p-5 shadow-sm mb-4 border border-gray-100">
            <h2 className="font-bold text- mb-4">{t("02 / Характеристики")}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gray-100 rounded-lg p-3">
                <label className="text- font-semibold">{t("Тип *")}</label>
                <select
                  {...register("type", { required: "Выберите тип" })}
                  className="w-full text-sm mt-1 outline-none bg-white text-gray-800"
                >
                  <option value="">{t("Выберите тип ∨")}</option>
                  {availableTypes.length === 0 ? (
                    <option disabled>{t("Сначала выберите категорию")}</option>
                  ) : (
                    availableTypes.map((v) => (
                      <option key={v} value={v}>
                        {t(v)}
                      </option>
                    ))
                  )}
                </select>
                {errors.type && (
                  <p className="text- text-red-500 mt-1">
                    {t(errors.type.message)}
                  </p>
                )}
              </div>
              <div className="border border-gray-100 rounded-lg p-3">
                <label className="text-">{t("Напряжение, В *")}</label>
                <input
                  list="voltages"
                  {...register("voltage", {
                    required: "Введите напряжение",
                  })}
                  placeholder={t("Введите напряжение")}
                  className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
                />
                <datalist id="voltages">
                  {voltageOptions.map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
                {errors.voltage && (
                  <p className="text- text-red-500 mt-1">
                    {t(errors.voltage.message)}
                  </p>
                )}
              </div>
              <div className="border border-gray-100 rounded-lg p-3 col-span-2">
                <label className="text- font-semibold">
                  {t("Комплектация *")}
                </label>
                <select
                  {...register("equipment", {
                    required: "Введите комплектацию",
                  })}
                  className="w-full text-sm mt-1 outline-none bg-white text-gray-800"
                >
                  <option value="">{t("Выберите комплектацию ∨")}</option>
                  {komplektOptions.map((v) => (
                    <option key={v} value={v}>
                      {t(v)}
                    </option>
                  ))}
                </select>
                {errors.equipment && (
                  <p className="text- text-red-500 mt-1">
                    {t(errors.equipment.message)}
                  </p>
                )}
              </div>
              <div className="border border-gray-100 rounded-lg p-3">
                <label className="text-">{t("Режимы")}</label>
                <select
                  {...register("modes")}
                  className="w-full text-sm mt-1 outline-none bg-white text-gray-800"
                >
                  <option value="">{t("Выберите режимы ∨")}</option>
                  {modesOptions.map((v) => (
                    <option key={v} value={v}>
                      {t(v)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="border border-gray-100 rounded-lg p-3">
                <label className="text-">{t("Цвет корпуса")}</label>
                <select
                  {...register("color")}
                  className="w-full text-sm mt-1 outline-none bg-white text-gray-800"
                >
                  <option value="">{t("Выберите цвет ∨")}</option>
                  {colorOptions.map((v) => (
                    <option key={v} value={v}>
                      {t(v)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-[1fr_1fr_32px] gap-3 mt-3"
              >
                <div className="border border-gray-100 rounded-lg p-3">
                  <input
                    {...register(`customCharacteristics.${index}.key`, {
                      required: true,
                    })}
                    placeholder={t("Название, напр. Вес")}
                    className="w-full text-sm outline-none"
                  />
                </div>
                <div className="border border-gray-100 rounded-lg p-3">
                  <input
                    {...register(`customCharacteristics.${index}.value`, {
                      required: true,
                    })}
                    placeholder={t("Значение, напр. 2.5 кг")}
                    className="w-full text-sm outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="bg-red-50 text-red-500 rounded-lg h-"
                >
                  ✕
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => append({ key: "", value: "" })}
              className="w-full mt-3 border rounded-lg py-2.5 text-xs hover:bg-gray-50"
            >
              {t("Добавить характеристику →")}
            </button>
          </section>

          {/* 03 */}
          <section className="bg-white rounded-xl p-5 shadow-sm mb-4 border border-gray-100">
            <h2 className="font-bold text- mb-4">{t("03 / Цена и наличие")}</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gray-100 rounded-lg p-3">
                <label className="text-">{t("Цена, сум *")}</label>
                <input
                  type="number"
                  {...register("price", {
                    required: "Введите цену",
                    min: { value: 1, message: "Часто больше нуля" },
                  })}
                  placeholder={t("Введите цену")}
                  className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
                />
                {errors.price && (
                  <p className="text- text-red-500 mt-1">
                    {t(errors.price.message)}
                  </p>
                )}
                {!errors.price && (
                  <p className="text- text-gray-400">
                    {t("Часто больше нуля")}
                  </p>
                )}
              </div>
              <div className="border border-gray-100 rounded-lg p-3">
                <label className="text-">{t("Единица продажи *")}</label>
                <select
                  {...register("unit", { required: "Выберите единицу" })}
                  className="w-full text-sm mt-1 outline-none bg-white text-gray-800"
                >
                  <option value="">{t("Выберите единицу ∨")}</option>
                  <option value="sht">{t("шт")}</option>
                  <option value="komplekt">{t("комплект")}</option>
                </select>
                {errors.unit && (
                  <p className="text- text-red-500 mt-1">
                    {t(errors.unit.message)}
                  </p>
                )}
              </div>
              <div className="border border-gray-100 rounded-lg p-3">
                <label className="text-">{t("Остаток *")}</label>
                <input
                  type="number"
                  {...register("stock", { required: "Введите количество" })}
                  placeholder={t("Введите количество")}
                  className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
                />
                {errors.stock && (
                  <p className="text- text-red-500 mt-1">
                    {t(errors.stock.message)}
                  </p>
                )}
              </div>
              <div className="border border-gray-100 rounded-lg p-3">
                <label className="text-">{t("Минимальный заказ")}</label>
                <input
                  type="number"
                  {...register("minOrder")}
                  className="w-full text-sm mt-1 outline-none text-"
                  defaultValue={1}
                />
              </div>
            </div>
            <p className="text- text-gray-400 mt-3">
              {t(
                "При остатке 0 товар недоступен для заказа. Цена в сум за выбранную единицу, доставка не включена.",
              )}
            </p>
          </section>

          {/* 04 */}
          <section className="bg-white rounded-xl p-5 shadow-sm mb-4 border border-gray-100">
            <h2 className="font-bold text- mb-4">
              {t("04 / Получение товара")}
            </h2>
            <div className="border border-gray-100 rounded-lg p-3 mb-3">
              <label className="text- font-semibold">
                {t("Город склада *")}
              </label>
              <select
                {...register("city", { required: "Выберите город" })}
                className="w-full text-sm mt-1 outline-none bg-white text-gray-800"
              >
                <option value="">{t("Выберите город ∨")}</option>
                <option value="Tashkent">{t("Ташкент")}</option>
                <option value="Samarkand">{t("Самарканд")}</option>
              </select>
              {errors.city && (
                <p className="text- text-red-500 mt-1">{t(errors.city.message)}</p>
              )}
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" {...register("deliveryUz")} />
                {t("Доставка по Узбекистану")}
              </label>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" {...register("pickup")} />
                {t("Самовывоз")}
              </label>
            </div>
            <div className="border border-gray-100 rounded-lg p-3 h-">
              <label className="text-">
                {t("Условия доставки и самовывоза *")}
              </label>
              <textarea
                {...register("deliveryConditions", {
                  required: "Введите условия",
                })}
                placeholder={t(
                  "Введите сроки, зону доставки и условия самовывоза",
                )}
                className="w-full text-sm mt-1 outline-none resize-none placeholder:text-gray-400"
              />
              {errors.deliveryConditions && (
                <p className="text- text-red-500 mt-1">
                  {t(errors.deliveryConditions.message)}
                </p>
              )}
            </div>
          </section>

          {/* Публикация */}
          <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h2 className="font-bold text- mb-3">{t("Публикация")}</h2>
            <label className="flex items-start gap-2 text- text-gray-500 mb-4">
              <input
                type="checkbox"
                {...register("confirm", {
                  required: "Подтвердите проверку данных",
                })}
                className="mt-0.5"
              />
              {t(
                "Подтверждаю, что информация и права на фотографии проверены перед публикацией",
              )}
            </label>
            {errors.confirm && (
              <p className="text- text-red-500 mb-3">
                {t(errors.confirm.message)}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="submit"
                className="bg-[#F59E0B] hover:bg-[#D97706] text-black text-xs font-semibold py-3 rounded-lg"
              >
                {t("Опубликовать товар →")}
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSubmit((data) => saveProduct(data, false))()
                }
                className="bg-white border text-xs py-3 rounded-lg"
              >
                {t("Сохранить черновик →")}
              </button>
            </div>
            <p className="text- text-gray-400 mt-3">
              {t(
                "Черновик не виден покупателям. Для публикации заполните обязательные поля и добавьте фото.",
              )}
            </p>
          </section>
        </form>
      </main>
    </>
  );
}
