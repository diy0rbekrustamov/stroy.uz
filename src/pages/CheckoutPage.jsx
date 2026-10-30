
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useShop } from "../context/ShopContext.jsx";
import { useSession } from "../api/useSession.js";
import { useCatalog } from "../api/useCatalog.js";
import { api } from "../api/client.js";
import { useLanguage } from "../i18n/useLanguage.js";
import Button from "../components/ui/Button.jsx";
import "../components/auth/AuthLayout.css";

export default function CheckoutPage() {
  const { t } = useLanguage(),
    { cart, clearCart } = useShop(),
    { user, loading } = useSession(),
    { items } = useCatalog(),
    navigate = useNavigate();

  const [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");

  const submission = useRef(null);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-[#EEEEEE] border-t-[#FFC107] rounded-full animate-spin" />
          <p className="text-[13px] text-[#9299A3] font-medium">
            {t("Загрузка…")}
          </p>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-[65vh] bg-white flex items-center justify-center px-5 py-16">
        <div className="max-w-md w-full text-center bg-white border border-[#EEEEEE] rounded-[24px] p-8 sm:p-10 shadow-[0_5px_30px_rgba(0,0,0,0.03)]">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-[#F8F8F8] flex items-center justify-center mb-6">
            <svg
              width="34"
              height="34"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          <h1 className="text-[25px] font-extrabold tracking-tight text-[#111]">
            {t("Оформление заказа")}
          </h1>

          <p className="text-[14px] text-[#9299A3] mt-3 leading-relaxed">
            {t("Войдите в аккаунт, чтобы продолжить.")}
          </p>

          <div className="mt-7">
            <Button to="/login">{t("Войти")}</Button>
          </div>
        </div>
      </div>
    );

  if (!Object.keys(cart).length)
    return (
      <div className="min-h-[65vh] bg-white flex items-center justify-center px-5 py-16">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#F8F8F8] flex items-center justify-center mb-6">
            <span className="text-4xl">🛒</span>
          </div>

          <h2 className="text-[25px] font-extrabold text-[#111]">
            {t("Корзина пуста")}
          </h2>

          <p className="text-[14px] text-[#9299A3] mt-3">
            {t("Вы ещё не выбрали строительные материалы")}
          </p>

          <Link
            to="/catalog"
            className="inline-flex mt-7 h-12 px-8 items-center justify-center rounded-xl bg-[#111] text-white text-[14px] font-bold hover:bg-[#333] transition-all"
          >
            {t("Открыть каталог")}
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-10 py-7 md:py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[12px] text-[#9CA3AF] mb-8">
          <Link to="/" className="hover:text-black transition-colors">
            {t("Главная")}
          </Link>

          <span className="text-[#D1D5DB]">/</span>

          <Link
            to="/cart"
            className="hover:text-black transition-colors"
          >
            {t("Корзина")}
          </Link>

          <span className="text-[#D1D5DB]">/</span>

          <span className="text-[#111] font-semibold">
            {t("Оформление заказа")}
          </span>
        </div>

        {/* Page Header */}
        <div className="mb-9">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-[29px] sm:text-[34px] md:text-[38px] font-extrabold tracking-[-0.04em] text-[#111]">
              {t("Оформление заказа")}
            </h1>
          </div>

          <p className="text-[14px] text-[#9299A3]">
            {t("Укажите адрес доставки и контактные данные")}
          </p>
        </div>

        {/* Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-6 lg:gap-8 items-start">

          {/* Main Form */}
          <section className="bg-white border border-[#E5E5E5] rounded-2xl overflow-hidden max-shadow hover:shadow-[0_25px_85px_rgba(0,0,0,0.28)] transition-shadow duration-300">

            {/* Section Header */}
            <div className="px-5 sm:px-7 py-5 border-b border-[#F0F0F0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF8E5] text-[#B88600] flex items-center justify-center">
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                    <circle cx="12" cy="10" r="2.5" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-[16px] font-extrabold text-[#111]">
                    {t("Контактные данные")}
                  </h2>
                  <p className="text-[12px] text-[#9CA3AF] mt-0.5">
                    {t("Информация для оформления доставки")}
                  </p>
                </div>
              </div>
            </div>

            <form
              className="p-5 sm:p-7"
              onSubmit={async (event) => {
                event.preventDefault();
                if (busy) return;

                const data = new FormData(event.currentTarget);
                const fingerprint = JSON.stringify(cart);

                if (
                  !submission.current ||
                  submission.current.fingerprint !== fingerprint
                )
                  submission.current = {
                    fingerprint,
                    key: crypto.randomUUID(),
                  };

                setBusy(true);
                setMessage("");

                try {
                  await api("/orders", {
                    method: "POST",
                    body: {
                      idempotencyKey: submission.current.key,
                      address: data.get("address"),
                      phone: data.get("phone"),
                      consent: data.has("consent"),
                      items: Object.entries(cart).map(([id, quantity]) => ({
                        id,
                        quantity,
                      })),
                    },
                  });

                  clearCart();
                  navigate("/account");
                } catch (error) {
                  setMessage(error.message);
                } finally {
                  setBusy(false);
                }
              }}
            >

              {/* Address */}
              <div className="mb-6">
                <label
                  htmlFor="checkout-address"
                  className="block text-[13px] font-bold text-[#222] mb-2.5"
                >
                  {t("Город и адрес объекта *")}
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]">
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>
                  </span>

                  <input
                    id="checkout-address"
                    name="address"
                    required
                    autoComplete="street-address"
                    maxLength="300"
                    placeholder={t("Введите город и полный адрес")}
                    className="w-full h-[52px] pl-12 pr-4 rounded-xl border border-[#EAEAEA] bg-[#FCFCFC] text-[14px] text-[#111] outline-none transition-all placeholder:text-[#B5B5B5] hover:border-[#D5D5D5] focus:border-[#FFC107] focus:bg-white focus:ring-4 focus:ring-[#FFC107]/10"
                  />
                </div>

                <p className="text-[11px] text-[#A0A0A0] mt-2">
                  {t("Укажите точный адрес строительного объекта")}
                </p>
              </div>

              {/* Phone */}
              <div className="mb-7">
                <label
                  htmlFor="checkout-phone"
                  className="block text-[13px] font-bold text-[#222] mb-2.5"
                >
                  {t("Телефон *")}
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]">
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.09 3.18 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.11L8.06 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.84.58 2.8.7a2 2 0 0 1 1.76 2.03Z" />
                    </svg>
                  </span>

                  <input
                    id="checkout-phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    defaultValue={user.phone}
                    placeholder="+998 XX XXX XX XX"
                    className="w-full h-[52px] pl-12 pr-4 rounded-xl border border-[#EAEAEA] bg-[#FCFCFC] text-[14px] text-[#111] outline-none transition-all placeholder:text-[#B5B5B5] hover:border-[#D5D5D5] focus:border-[#FFC107] focus:bg-white focus:ring-4 focus:ring-[#FFC107]/10"
                  />
                </div>

                <p className="text-[11px] text-[#A0A0A0] mt-2">
                  {t("Для связи по поводу вашего заказа")}
                </p>
              </div>

              {/* Consent */}
              <label className="flex items-start gap-3 p-4 rounded-xl bg-[#FAFAFA] border border-[#EEEEEE] cursor-pointer group hover:border-[#E0E0E0] transition-colors">
                <input
                  name="consent"
                  type="checkbox"
                  required
                  className="w-[17px] h-[17px] mt-0.5 shrink-0 accent-[#FFC107] cursor-pointer"
                />

                <span className="text-[12px] sm:text-[13px] text-[#555] leading-relaxed group-hover:text-[#111] transition-colors">
                  {t("Подтверждаю состав заказа и контактные данные.")}
                </span>
              </label>

              {/* Delivery Info */}
              <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-[#FFF9E9] border border-[#F5E9C7]">
                <span className="text-[#B88600] mt-0.5 shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </span>

                <div>
                  <p className="text-[12px] font-bold text-[#765A13]">
                    {t("Информация о доставке и оплате")}
                  </p>

                  <p className="text-[11px] sm:text-[12px] text-[#917B42] leading-relaxed mt-1">
                    {t(
                      "Стоимость доставки согласуется отдельно. Онлайн-оплата не выполняется.",
                    )}
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {message && (
                <div
                  role="alert"
                  className="mt-5 p-4 rounded-xl bg-[#FFF1F1] border border-[#FFDADA] text-[13px] text-red-600"
                >
                  {t(message)}
                </div>
              )}

              {/* Submit */}
              <div className="mt-7">
                <Button type="submit" disabled={busy}>
                  {busy
                    ? t("Загрузка…")
                    : t("Подтвердить заказ")}
                </Button>
              </div>

              <p role="status" className="auth-status mt-3">
                {t(message)}
              </p>

            </form>
          </section>

          {/* Right Side Information */}
          <aside className="space-y-5 lg:sticky lg:top-6">

            {/* Order Products */}
            <div className="bg-[#FAFAFA] rounded-2xl border border-[#EEEEEE] p-5 sm:p-6 shadow-[0_3px_20px_rgba(0,0,0,0.025)]">

              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[16px] font-extrabold text-[#111]">
                  {t("Состав заказа")}
                </h2>

                <span className="text-[11px] font-semibold text-[#888] bg-white border border-[#EEEEEE] rounded-full px-3 py-1">
                  {Object.values(cart).reduce((a, b) => a + b, 0)} {t("тов.")}
                </span>
              </div>

              <div className="space-y-4">

                {Object.entries(cart).map(([id, quantity]) => {
                  const product = items.find((item) => item.id === id);

                  return (
                    <div
                      key={id}
                      className="flex items-center gap-3 pb-4 border-b border-[#EEEEEE] last:border-0 last:pb-0"
                    >
                      <div className="w-[55px] h-[55px] rounded-xl bg-white border border-[#EEEEEE] flex items-center justify-center shrink-0 overflow-hidden">
                        {product?.image ? (
                          <img
                            src={product.image}
                            alt=""
                            className="w-full h-full object-contain p-1.5"
                          />
                        ) : (
                          <span className="text-xl">📦</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-[#222] line-clamp-2">
                          {t(product?.name || id)}
                        </p>

                        <p className="text-[11px] text-[#9299A3] mt-1">
                          {t("Количество")}: {quantity}
                        </p>
                      </div>

                      <span className="text-[12px] font-bold text-[#111] shrink-0">
                        × {quantity}
                      </span>
                    </div>
                  );
                })}

              </div>

              <div className="mt-5 pt-4 border-t border-[#E8E8E8]">
                <Link
                  to="/cart"
                  className="text-[12px] font-semibold text-[#777] hover:text-black transition-colors inline-flex items-center gap-2"
                >
                  <span>←</span>
                  {t("Вернуться в корзину")}
                </Link>
              </div>
            </div>

            {/* Delivery Card */}
            <div className="bg-white rounded-2xl border border-[#EEEEEE] p-5 sm:p-6">

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#F7F7F7] flex items-center justify-center text-[#555]">
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 7h11v11H3z" />
                    <path d="M14 11h4l3 3v4h-7z" />
                    <circle cx="7.5" cy="18.5" r="1.5" />
                    <circle cx="17.5" cy="18.5" r="1.5" />
                  </svg>
                </div>

                <h3 className="text-[14px] font-extrabold text-[#111]">
                  {t("Доставка")}
                </h3>
              </div>

              <p className="text-[12px] text-[#9299A3] leading-relaxed">
                {t(
                  "Стоимость доставки согласуется отдельно. Онлайн-оплата не выполняется.",
                )}
              </p>

              <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-[#777]">
                <span className="w-2 h-2 rounded-full bg-[#FFC107]" />
                {t("По согласованию")}
              </div>

            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}
