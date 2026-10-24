import { useState } from "react";
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
          onSubmit={async (event) => {
            event.preventDefault();
            if (busy) return;
            const form = event.currentTarget;
            const data = new FormData(form);
            setBusy(true);
            setMessage("");
            try {
              const equipmentType = data.get("equipmentType");
              const file = data.get("image");
              const image = file?.size ? await uploadImage(file) : "";
              await api("/seller/rentals", {
                method: "POST",
                body: {
                  name: data.get("name"),
                  equipmentType,
                  category: equipmentTypes[equipmentType],
                  categoryId: equipmentType,
                  description: data.get("description"),
                  capacity: data.get("capacity"),
                  city: data.get("city"),
                  price: Number(data.get("price")),
                  minDays: Number(data.get("minDays")),
                  unit: "сутки",
                  operatorIncluded: data.has("operatorIncluded"),
                  deliveryAvailable: data.has("deliveryAvailable"),
                  image,
                  published: data.has("published"),
                },
              });
              form.reset();
              setVersion((value) => value + 1);
              window.dispatchEvent(new Event("stroy-catalog"));
              setMessage("Изменения сохранены.");
            } catch (error) {
              setMessage(error.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="auth-field">
            {t("Название")}
            <input name="name" required maxLength="150" />
          </label>
          <label className="auth-field">
            {t("Тип техники")}
            <select name="equipmentType">
              {Object.entries(equipmentTypes).map(([id, label]) => (
                <option value={id} key={id}>
                  {t(label)}
                </option>
              ))}
            </select>
          </label>
          <label className="auth-field">
            {t("Характеристики")}
            <input name="capacity" required maxLength="100" />
          </label>
          <label className="auth-field">
            {t("Город")}
            <input name="city" required maxLength="100" />
          </label>
          <label className="auth-field">
            {t("Цена за сутки, сум")}
            <input
              name="price"
              type="number"
              required
              min="1"
              max="1000000000"
              step="1"
            />
          </label>
          <label className="auth-field">
            {t("Минимум суток")}
            <input
              name="minDays"
              type="number"
              required
              min="1"
              max="365"
              step="1"
              defaultValue="1"
            />
          </label>
          <label className="auth-field">
            {t("Описание")}
            <textarea name="description" maxLength="4000" rows="4" />
          </label>
          <label className="auth-field">
            {t("Фото")}
            <input
              name="image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
            />
          </label>
          <label className="auth-checkbox">
            <input type="checkbox" name="operatorIncluded" />
            {t("С оператором")}
          </label>
          <label className="auth-checkbox">
            <input type="checkbox" name="deliveryAvailable" />
            {t("Доступна подача техники")}
          </label>
          <label className="auth-checkbox">
            <input type="checkbox" name="published" />
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
