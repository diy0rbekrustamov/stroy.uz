import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLanguage } from "../../i18n/useLanguage.js";
import { useSession } from "../../api/useSession.js";
import { api } from "../../api/client.js";
import { uploadImage } from "../../api/upload.js";
import { equipmentTypes } from "../../data/rentalCatalog.js";
import ApiListings from "../../components/seller/ApiListings.jsx";
import Button from "../../components/ui/Button.jsx";

export default function SellerRentalsPage() {
  const { t } = useLanguage();
  const { user } = useSession();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState(0);
   const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "", 
      equipmentType: "crane",
      capacity: "",
      city: "",
      price: "",
      minDays: 1,
      description: "",
      operatorIncluded: false,
      deliveryAvailable: false,
      published: false,
    },
  });
  if (!user)
    return (
      <section className="auth-panel">
        <h1>{t("Моя техника")}</h1>
        <Button to="/login">{t("Войти")}</Button>
      </section>
    );
  return (
    <div style={{ width: "100%", minWidth: 0 }}>
      <section className="auth-panel" id="rental-create">
        <h1>{t("Добавить технику")}</h1>
        <p>
          {t(
            "Одна карточка — одна машина. Указывайте реальную цену за сутки и условия работы.",
          )}
        </p>
       <form
  className="auth-form"
  onSubmit={handleSubmit(async (data) => {
    if (busy) return;

    setBusy(true);
    setMessage("");

    try {
      const equipmentType = data.equipmentType;
      const file = data.image?.[0];
      const image = file ? await uploadImage(file) : "";

      await api("/seller/rentals", {
        method: "POST",
        body: {
          name: data.name,
          equipmentType,
          category: equipmentTypes[equipmentType],
          categoryId: equipmentType,
          description: data.description,
          capacity: data.capacity,
          city: data.city,
          price: data.price,
          minDays: data.minDays,
          unit: "сутки",
          operatorIncluded: data.operatorIncluded,
          deliveryAvailable: data.deliveryAvailable,
          image,
          published: data.published,
        },
      });

      reset();
      setVersion((value) => value + 1);
      window.dispatchEvent(new Event("stroy-catalog"));
      setMessage("Изменения сохранены.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  })}
>
          <label className="auth-field">
            {t("Название")}
            <input
  {...register("name", {
    required: "Введите название техники",
    maxLength: {
      value: 150,
      message: "Максимум 150 символов",
    },
  })}
  maxLength="150"
/>
{errors.name && <p role="alert">{errors.name.message}</p>}
          </label>
          <label className="auth-field">
            {t("Тип техники")}
          <select {...register("equipmentType", { required: true })}>
  {Object.entries(equipmentTypes).map(([id, label]) => (
    <option value={id} key={id}>
      {t(label)}
    </option>
  ))}
</select>
          </label>
          <label className="auth-field">
            {t("Характеристики")}
            <input
  {...register("capacity", {
    required: "Укажите характеристики",
    maxLength: {
      value: 100,
      message: "Максимум 100 символов",
    },
  })}
/>
{errors.capacity && (
  <p role="alert">{errors.capacity.message}</p>
)}
          </label>
          <label className="auth-field">
            {t("Город")}
           <input
  {...register("city", {
    required: "Укажите город",
    maxLength: {
      value: 100,
      message: "Максимум 100 символов",
    },
  })}
/>
{errors.city && <p role="alert">{errors.city.message}</p>}
          </label>
          <label className="auth-field">
            {t("Цена за сутки, сум")}
           <input
  type="number"
  {...register("price", {
    required: "Укажите цену",
    valueAsNumber: true,
    min: {
      value: 1,
      message: "Цена должна быть больше 0",
    },
    max: 1000000000,
  })}
  min="1"
  max="1000000000"
  step="1"
/>
{errors.price && (
  <p role="alert">{errors.price.message}</p>
)}
          </label>
          <label className="auth-field">
            {t("Минимум суток")}
            <input
  type="number"
  {...register("minDays", {
    required: "Укажите минимальный срок",
    valueAsNumber: true,
    min: {
      value: 1,
      message: "Минимум 1 сутки",
    },
    max: 365,
  })}
  min="1"
  max="365"
  step="1"
/>
{errors.minDays && (
  <p role="alert">{errors.minDays.message}</p>
)}
          </label>
          <label className="auth-field">
            {t("Описание")}
            <textarea
  {...register("description", {
    maxLength: {
      value: 4000,
      message: "Максимум 4000 символов",
    },
  })}
  maxLength="4000"
  rows="4"
/>
{errors.description && (
  <p role="alert">{errors.description.message}</p>
)}
          </label>
          <label className="auth-field">
            {t("Фото")}
           <input
  type="file"
  accept="image/png,image/jpeg,image/webp"
  {...register("image")}
/>
          </label>
          <label className="auth-checkbox">
            <input type="checkbox" {...register("operatorIncluded")} />
            {t("С оператором")}
          </label>
          <label className="auth-checkbox">
            <input type="checkbox" {...register("deliveryAvailable")} />
            {t("Доступна подача техники")}
          </label>
          <label className="auth-checkbox">
            <input type="checkbox" {...register("published")} />
            {t("Опубликовать")}
          </label>
          <Button type="submit" disabled={busy}>
            {t(busy ? "Сохранение…" : "Сохранить")}
          </Button>
          <p role="status">{t(message)}</p>
        </form>
      </section>
      <ApiListings kind="rentals" key={version} />
    </div>
  );
}
