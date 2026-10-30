import { useLanguage } from "../../../i18n/useLanguage.js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { api } from "../../../api/client.js";
import { uploadImage } from "../../../api/upload.js";

const serviceCategories = [
  "Ремонт квартир",
  "Электрика",
  "Сантехника",
  "Отделочные работы",
  "Кровельные работы",
  "Сварочные работы",
  "Грузоперевозки",
  "Уборка",
];
const priceTypes = ["от", "за объём", "по смете", "фиксированная"];
const unitOptions = ["м²", "м.п.", "шт", "час", "день", "объект", "точка"];
const cityOptions = ["Tashkent", "Samarkand", "Bukhara", "Andijan", "Fergana"];
const daysOptions = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export default function AddServicePage() {
  const { t } = useLanguage();
  const [step, setStep] = useState("service");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      serviceName: "",
      category: "",
      photos: [],
      description: "",
      priceType: "",
      unit: "",
      price: "",
      priceFactors: "",
      city: "",
      serviceZone: "",
      workDays: [],
      startTime: "",
      endTime: "",
      flexibleDate: false,
      executorName: "",
      phone: "",
      email: "",
      confirm: false,
    },
  });

  const photos = watch("photos");
  const workDays = watch("workDays") || [];

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("serviceName"));
      if (saved?.defaultName) setValue("serviceName", saved.defaultName);
    } catch {}
  }, [setValue]);

  const saveService = async (data, published) => {
    if (saving) return;
    setSaving(true);
    setSubmissionMessage("");
    try {
      const image = await uploadImage(data.photos[0]);
      await api("/seller/services", {
        method: "POST",
        body: {
          name: data.serviceName,
          description: data.description,
          category: data.category,
          price: Number(data.price),
          stock: 0,
          unit: data.unit,
          city:
            {
              Tashkent: "Ташкент",
              Samarkand: "Самарканд",
              Bukhara: "Бухара",
              Andijan: "Андижан",
              Fergana: "Фергана",
            }[data.city] || data.city,
          image,
          published,
        },
      });
      window.dispatchEvent(new Event("stroy-catalog"));
      navigate("/seller/services");
    } catch (error) {
      setSubmissionMessage(error.message);
    } finally {
      setSaving(false);
    }
  };
  const onSubmit = (data) => saveService(data, true);

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 8);
    setValue("photos", files, { shouldValidate: true });
  };

  const toggleDay = (day) => {
    const current = watch("workDays") || [];
    const newDays = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    setValue("workDays", newDays, { shouldValidate: true });
  };

  return (
    <main className="flex-1 min-w-0 w-full max-w-">
      <p role="status" className="text-sm text-amber-900 p-3">
        {t(submissionMessage)}
      </p>
      <div className="text- text-gray-400 mb-1 hidden md:block">
        {t("Мои услуги")}
      </div>
      <h1 className="text- md:text- font-bold text-[#111827] tracking-tight">
        {t("Добавить услугу")}
      </h1>
      <p className="text- md:text-sm text-gray-500 mb-3 mt-1">
        {t("Помогите покупателю понять работу и запросить смету.")}
      </p>

      <div className="bg-[#FEF3C7] text- p-2.5 rounded-lg mb-4 text-[#92400E] leading-[1.4]">
        {t("ДЕМО • Услуга и исполнитель иллюстративны. Поля * обязательны.")}
      </div>

      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setStep("service")}
          className={`text- px-4 py-2 rounded-lg font-medium ${step === "service" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-500"}`}
        >
          1 · {t("Услуга")}
        </button>
        <button
          onClick={() => setStep("cost")}
          className={`text- px-4 py-2 rounded-lg font-medium ${step === "cost" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-500"}`}
        >
          2 · {t("Стоимость")}
        </button>
        <button
          onClick={() => setStep("avail")}
          className={`text- px-4 py-2 rounded-lg font-medium ${step === "avail" ? "bg-[#1C2E42] text-white" : "bg-transparent text-gray-500"}`}
        >
          3 · {t("Доступность")}
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* 01 / О вашей работе */}
        <section className="bg-white rounded-xl p-5 shadow-sm mb-4 border border-gray-100">
          <h2 className="font-bold text- mb-4">{t("01 / О вашей работе")}</h2>

          <div className="border border-gray-100 rounded-lg p-3 mb-3">
            <label className="text- font-semibold">
              {t("Название услуги *")}
            </label>
            <input
              {...register("serviceName", {
                required: t("Введите название услуги"),
              })}
              placeholder={t("Введите название услуги")}
              className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
            />
            {errors.serviceName && (
              <p className="text- text-red-500 mt-1">
                {errors.serviceName.message}
              </p>
            )}
            <p className="text- text-gray-400 mt-1">
              {t("Укажите конкретную работу, без рекламных обещаний")}
            </p>
          </div>

          <div className="border border-gray-100 rounded-lg p-3 mb-3">
            <label className="text- font-semibold">{t("Категория *")}</label>
            <select
              {...register("category", { required: t("Выберите категорию") })}
              className="w-full text-sm mt-1 outline-none bg-white text-gray-800"
            >
              <option value="">{t("Выберите категорию ∨")}</option>
              {serviceCategories.map((c) => (
                <option key={c} value={c}>
                  {t(c)}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text- text-red-500 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <label className="text- font-bold">{t("Фотографии работ *")}</label>
          <div className="bg-[#F8FAFC] border border-dashed border-gray-200 rounded-lg p-6 mt-2 text-center">
            <div className="text-lg mb-2">↑</div>
            <p className="text-xs font-medium">
              {t("Перетащите фото или выберите файлы")}
            </p>
            <p className="text- text-gray-400 mt-1">
              JPG, PNG, WebP - до 10 МБ, до 8 фото
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
              id="servicePhotoInput"
            />
            <label
              htmlFor="servicePhotoInput"
              className="mt-3 w-full bg-white border rounded-md py-2 text-xs inline-block cursor-pointer text-center"
            >
              {t("Выбрать фото →")} {photos?.length ? `(${photos.length})` : ""}
            </label>
            <input
              type="hidden"
              {...register("photos", {
                required: t("Добавьте фото работ"),
                validate: (v) => v.length > 0 || t("Добавьте фото"),
              })}
            />
            {errors.photos && (
              <p className="text- text-red-500 mt-2">{errors.photos.message}</p>
            )}
          </div>

          <div className="border border-gray-100 rounded-lg p-3 mt-4">
            <label className="text- font-semibold">
              {t("Описание услуги *")}
            </label>
            <textarea
              {...register("description", {
                required: t("Введите состав работ"),
                minLength: { value: 30, message: t("Минимум 30 символов") },
              })}
              placeholder={t(
                "Введите состав работ, ограничения и что оплачивается отдельно",
              )}
              className="w-full text-sm mt-1 outline-none resize-none placeholder:text-gray-400"
              rows={3}
            />
            {errors.description && (
              <p className="text- text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </section>

        {/* 02 / Основа расчёта */}
        <section className="bg-white rounded-xl p-5 shadow-sm mb-4 border border-gray-100">
          <h2 className="font-bold text- mb-4">{t("02 / Основа расчёта")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text- font-semibold">{t("Тип цены *")}</label>
              <select
                {...register("priceType", { required: t("Выберите тип цены") })}
                className="w-full text-sm mt-1 outline-none bg-white text-gray-800"
              >
                <option value="">
                  {t("Выберите: от / за объём / по смете ∨")}
                </option>
                {priceTypes.map((p) => (
                  <option key={p} value={p}>
                    {t(p)}
                  </option>
                ))}
              </select>
              {errors.priceType && (
                <p className="text- text-red-500 mt-1">
                  {errors.priceType.message}
                </p>
              )}
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text- font-semibold">
                {t("Единица расчёта *")}
              </label>
              <select
                {...register("unit", { required: t("Выберите единицу") })}
                className="w-full text-sm mt-1 outline-none bg-white text-gray-800"
              >
                <option value="">{t("Выберите единицу ∨")}</option>
                {unitOptions.map((u) => (
                  <option key={u} value={u}>
                    {t(u)}
                  </option>
                ))}
              </select>
              {errors.unit && (
                <p className="text- text-red-500 mt-1">{errors.unit.message}</p>
              )}
            </div>
          </div>

          <div className="border border-gray-100 rounded-lg p-3 mb-3">
            <label className="text- font-semibold">
              {t("Ориентировочная цена, сум *")}
            </label>
            <input
              type="number"
              {...register("price", { required: t("Введите сумму") })}
              placeholder={t("Введите сумму")}
              className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
            />
            {errors.price && (
              <p className="text- text-red-500 mt-1">{errors.price.message}</p>
            )}
            <p className="text- text-gray-400 mt-1">
              {t("Оценка, а не гарантия итоговой стоимости")}
            </p>
          </div>

          <div className="border border-gray-100 rounded-lg p-3">
            <label className="text- font-semibold">
              {t("Что влияет на смету *")}
            </label>
            <textarea
              {...register("priceFactors", { required: t("Введите условия") })}
              placeholder={t("Введите условия и дополнительные расходы")}
              className="w-full text-sm mt-1 outline-none resize-none placeholder:text-gray-400"
              rows={2}
            />
            {errors.priceFactors && (
              <p className="text- text-red-500 mt-1">
                {errors.priceFactors.message}
              </p>
            )}
          </div>
        </section>

        {/* 03 / Где и когда вы работаете */}
        <section className="bg-white rounded-xl p-5 shadow-sm mb-4 border border-gray-100">
          <h2 className="font-bold text- mb-4">
            {t("03 / Где и когда вы работаете")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text- font-semibold">{t("Город *")}</label>
              <select
                {...register("city", { required: t("Выберите город") })}
                className="w-full text-sm mt-1 outline-none bg-white text-gray-800"
              >
                <option value="">{t("Выберите город ∨")}</option>
                {cityOptions.map((c) => (
                  <option key={c} value={c}>
                    {t(c)}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text- text-red-500 mt-1">{errors.city.message}</p>
              )}
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text- font-semibold">
                {t("Зона обслуживания *")}
              </label>
              <input
                {...register("serviceZone", { required: t("Введите зону") })}
                placeholder={t("Введите районы или радиус")}
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
              {errors.serviceZone && (
                <p className="text- text-red-500 mt-1">
                  {errors.serviceZone.message}
                </p>
              )}
            </div>
          </div>

          <div className="border border-gray-100 rounded-lg p-3 mb-3">
            <label className="text- font-semibold">{t("Дни работы *")}</label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {daysOptions.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-full text- border ${workDays.includes(day) ? "bg-[#1C2E42] text-white border-[#1C2E42]" : "bg-white text-gray-600 border-gray-200"}`}
                >
                  {t(day)}
                </button>
              ))}
            </div>
            <input
              type="hidden"
              {...register("workDays", {
                required: t("Выберите дни"),
                validate: (v) => v.length > 0 || t("Выберите дни"),
              })}
            />
            {errors.workDays && (
              <p className="text- text-red-500 mt-1">
                {errors.workDays.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-">{t("Начало")}</label>
              <input
                type="time"
                {...register("startTime")}
                className="w-full text-sm mt-1 outline-none"
              />
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text-">{t("Окончание")}</label>
              <input
                type="time"
                {...register("endTime")}
                className="w-full text-sm mt-1 outline-none"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text- text-gray-500 mt-2">
            <input type="checkbox" {...register("flexibleDate")} />{" "}
            {t("Дата выезда по согласованию, не мгновенная бронь.")}
          </label>
        </section>

        {/* 04 / Контакты для заявок */}
        <section className="bg-white rounded-xl p-5 shadow-sm mb-4 border border-gray-100">
          <h2 className="font-bold text- mb-4">
            {t("04 / Контакты для заявок")}
          </h2>
          <div className="border border-gray-100 rounded-lg p-3 mb-3">
            <label className="text- font-semibold">
              {t("Имя или название исполнителя *")}
            </label>
            <input
              {...register("executorName", {
                required: t("Введите название исполнителя"),
              })}
              placeholder={t("Введите название исполнителя")}
              className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
            />
            {errors.executorName && (
              <p className="text- text-red-500 mt-1">
                {errors.executorName.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text- font-semibold">{t("Телефон *")}</label>
              <input
                {...register("phone", {
                  required: t("Введите телефон"),
                  pattern: {
                    value: /^\+998\d{9}$/,
                    message: "+998 XX XXX XX XX",
                  },
                })}
                placeholder="+998 __ ___ __ __"
                defaultValue="+998 "
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
              {errors.phone && (
                <p className="text- text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
              <p className="text- text-gray-400 mt-1">
                {t("Заменить действительным номером перед запуском")}
              </p>
            </div>
            <div className="border border-gray-100 rounded-lg p-3">
              <label className="text- font-semibold">{t("Email *")}</label>
              <input
                type="email"
                {...register("email", {
                  required: t("Введите email"),
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                placeholder={t("Введите email")}
                className="w-full text-sm mt-1 outline-none placeholder:text-gray-400"
              />
              {errors.email && (
                <p className="text- text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Публикация */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text- mb-3">{t("Публикация")}</h2>
          <label className="flex items-start gap-2 text- text-gray-500 mb-4">
            <input
              type="checkbox"
              {...register("confirm", {
                required: t("Подтвердите право на фотографии"),
              })}
              className="mt-0.5"
            />
            {t(
              "Подтверждаю право на фотографии и корректность информации об услуге",
            )}
          </label>
          {errors.confirm && (
            <p className="text- text-red-500 mb-3">{errors.confirm.message}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              type="submit"
              className="bg-[#F59E0B] hover:bg-[#D97706] text-black text-xs font-semibold py-3 rounded-lg"
            >
              {t("Опубликовать услугу →")}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit((data) => saveService(data, false))()}
              className="bg-white border text-xs py-3 rounded-lg"
            >
              {t("Сохранить черновик →")}
            </button>
          </div>
          <p className="text- text-gray-400 mt-3">
            {t(
              "Черновик не виден в каталоге. Для публикации нужны обязательные поля, фото и действующие контакты.",
            )}
          </p>
        </section>
      </form>
    </main>
  );
}
