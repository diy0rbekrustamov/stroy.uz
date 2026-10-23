import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { uploadImage } from "../../api/upload.js";
import { useLanguage } from "../../i18n/useLanguage.js";
import { matchesProduct } from "../../i18n/translate.js";
import Button from "../ui/Button.jsx";
import "../auth/AuthLayout.css";
export default function ApiListings({ kind }) {
  const { t } = useLanguage(),
    [items, setItems] = useState([]),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("all"),
    [editing, setEditing] = useState(null),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const reload = () =>
    api("/seller/" + kind).then((data) => setItems(data.items));
  useEffect(() => {
    api("/seller/" + kind)
      .then((data) => setItems(data.items))
      .catch((error) => setMessage(error.message));
  }, [kind]);
  const save = async (item, changes) => {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      await api("/seller/" + kind + "/" + item.id, {
        method: "PUT",
        body: { ...item, ...changes },
      });
      await reload();
      setEditing(null);
      window.dispatchEvent(new Event("stroy-catalog"));
      setMessage("Изменения сохранены.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };
  const filtered = items.filter(
    (item) =>
      (filter === "all" || item.published === (filter === "published")) &&
      matchesProduct(item, query),
  );
  return (
    <section className="auth-panel" style={{ width: "100%" }}>
      <h1>{t(kind === "products" ? "Мои товары" : "Мои услуги")}</h1>
      <Button
        to={kind === "products" ? "/seller/add-product" : "/seller/add-service"}
      >
        {t(kind === "products" ? "Добавить товар" : "Добавить услугу")}
      </Button>
      <div className="auth-form">
        <label className="auth-field">
          {t("Поиск")}
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <label>
          {t("Статус")}{" "}
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">{t("Все")}</option>
            <option value="published">{t("Опубликованы")}</option>
            <option value="draft">{t("Черновики")}</option>
          </select>
        </label>
      </div>
      <p role="status">{t(message)}</p>
      {!filtered.length && <p>{t("Пока пусто")}</p>}
      {filtered.map((item) => (
        <article className="auth-info" key={item.id} style={{ marginTop: 16 }}>
          <h2>{item.name}</h2>
          <p>
            {item.price} {t("сум")} / {t(item.unit)} ·{" "}
            {t(item.published ? "Опубликован" : "Черновик")} · {t("Остаток")}:{" "}
            {item.stock}
          </p>
          <Button
            variant="secondary"
            disabled={busy}
            onClick={() => setEditing(editing === item.id ? null : item.id)}
          >
            {t("Редактировать")}
          </Button>{" "}
          <Button
            disabled={busy}
            onClick={() => save(item, { published: !item.published })}
          >
            {t(item.published ? "Снять с публикации" : "Опубликовать")}
          </Button>
          {editing === item.id && (
            <form
              className="auth-form"
              onSubmit={async (event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                let image = item.image;
                try {
                  if (data.get("image")?.size)
                    image = await uploadImage(data.get("image"));
                } catch (error) {
                  setMessage(error.message);
                  return;
                }
                save(item, {
                  name: data.get("name"),
                  description: data.get("description"),
                  price: Number(data.get("price")),
                  stock: Number(data.get("stock")),
                  image,
                });
              }}
            >
              <label className="auth-field">
                {t("Название")}
                <input
                  name="name"
                  required
                  defaultValue={item.name}
                  maxLength="150"
                />
              </label>
              <label className="auth-field">
                {t("Описание")}
                <input
                  name="description"
                  defaultValue={item.description}
                  maxLength="4000"
                />
              </label>
              <label className="auth-field">
                {t("Цена, сум")}
                <input
                  name="price"
                  type="number"
                  required
                  min="0"
                  max="1000000000"
                  defaultValue={item.price}
                />
              </label>
              <label className="auth-field">
                {t("Остаток")}
                <input
                  name="stock"
                  type="number"
                  required
                  min="0"
                  max="1000000"
                  defaultValue={item.stock}
                />
              </label>
              <label className="auth-field">
                {t("Фото")}
                <input
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                />
              </label>
              <Button type="submit" disabled={busy}>
                {t("Сохранить")}
              </Button>
            </form>
          )}
        </article>
      ))}
    </section>
  );
}
