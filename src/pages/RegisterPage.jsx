import { useState } from "react";
import materialsImg from "../assets/home/hero.png"; // sen crop qilgan rasm
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function RegisterPage() {
  const [role, setRole] = useState("seller"); // buyer | seller
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const isSeller = role === "seller";

  return (
    <>
      <div className="min-h-screen bg-[#f5f6f7] p-4 md:p-6 lg:p-8 font-[Inter,system-ui]">
        <div className="mx-auto max-w-[1360px] grid grid-cols-1 lg:grid-cols-[1.05fr_1.35fr] gap-6">
          {/* LEFT DARK CARD */}
          <div className="bg-[#1e2f3c] rounded-[16px] p-8 md:p-10 flex flex-col justify-between min-h-[760px]">
            <div>
              <div className="text-[#e9a227] text-[12px] tracking-[0.08em] font-medium uppercase mb-10">
                STROY UZ / ВАШ ПРОЕКТ
              </div>
              <h1 className="text-white text-[44px] md:text-[48px] leading-[0.95] font-bold tracking-tight">
                Одна основа.
                <br />
                Много возможностей.
              </h1>
              <p className="text-[#a8b3be] text-[16px] leading-[1.5] mt-6 max-w-[400px]">
                Покупайте материалы, находите услуги и управляйте своим делом.
              </p>
            </div>

            <div className="my-8 -mx-2">
              <img
                src={materialsImg}
                alt="materials ref"
                className="w-full h-auto object-contain select-none"
              />
            </div>

            <div className="text-[#7b8a96] text-[12px]">
              Визуальный референс материалов, не 3D-модель.
            </div>
          </div>

          {/* RIGHT FORM CARD */}
          <div className="bg-white rounded-[16px] p-8 md:p-10 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            <a href="/" className="text-[13px] text-[#6b7280] hover:text-black">
              ← Главная
            </a>

            <h2 className="text-[42px] font-bold tracking-tight text-[#111827] mt-6">
              Регистрация
            </h2>
            <p className="text-[#6b7280] text-[16px] mt-3">
              Создайте аккаунт и начните свой следующий проект.
            </p>

            {/* Role Toggle */}
            <div className="flex gap-2 mt-8">
              <button
                onClick={() => setRole("buyer")}
                className={`px-5 py-2.5 rounded-[10px] text-[14px] font-medium transition ${role === "buyer" ? "bg-[#111e2a] text-white" : "bg-[#f2f3f5] text-[#111827] hover:bg-[#e9eaec]"}`}
              >
                Покупатель
              </button>
              <button
                onClick={() => setRole("seller")}
                className={`px-5 py-2.5 rounded-[10px] text-[14px] font-medium transition ${role === "seller" ? "bg-[#111e2a] text-white" : "bg-[#f2f3f5] text-[#111827] hover:bg-[#e9eaec]"}`}
              >
                Продавец
              </button>
            </div>

            <p className="text-[13px] text-[#6b7280] leading-[1.5] mt-5">
              Покупатель — заказы и избранное. Продавец — товары, услуги и
              заявки. Роль можно дополнить позже.
            </p>

            <form className="mt-8 space-y-5">
              {/* Name */}
              <div className="border border-[#e5e7eb] rounded-[12px] px-4 py-3 focus-within:ring-2 focus-within:ring-amber-400/30 focus-within:border-amber-400">
                <label className="text-[12px] text-[#6b7280]">Ваше имя *</label>
                <input
                  placeholder="Введите имя"
                  className="w-full outline-none  text-[15px] mt-1 placeholder:text-[#9ca3af]"
                />
              </div>

              {/* Shop name */}
              {isSeller && (
                <div className="border border-[#e5e7eb] rounded-[12px] px-4 py-3 focus-within:ring-2 focus-within:ring-amber-400/30 focus-within:border-amber-400">
                  <label className="text-[12px] text-[#6b7280]">
                    Название магазина *
                  </label>
                  <input
                    placeholder="Введите название"
                    className="w-full outline-none text-[15px] mt-1 placeholder:text-[#9ca3af]"
                  />
                  <div className="text-[11px] text-[#9ca3af] mt-3">
                    Для роли «Продавец»; у покупателя поле скрыто.
                  </div>
                </div>
              )}

              {/* Phone + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="border border-[#e5e7eb] rounded-[12px] px-4 py-3 focus-within:ring-2 focus-within:ring-amber-400/30">
                  <label className="text-[12px] text-[#6b7280]">
                    Телефон *
                  </label>
                  <input
                    placeholder="+998 ___ ___ __ __"
                    className="w-full outline-none text-[15px] mt-1 font-medium"
                  />
                </div>
                <div className="border border-[#e5e7eb] rounded-[12px] px-4 py-3 focus-within:ring-2 focus-within:ring-amber-400/30">
                  <label className="text-[12px] text-[#6b7280]">Email *</label>
                  <input
                    placeholder="Введите email"
                    className="w-full outline-none text-[15px] mt-1 placeholder:text-[#9ca3af]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="border border-[#e5e7eb] rounded-[12px] px-4 py-3 focus-within:ring-2 focus-within:ring-amber-400/30">
                <label className="text-[12px] text-[#6b7280]">Пароль *</label>
                <div className="flex gap-2 items-center">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="Введите пароль"
                    className="w-full outline-none text-[15px] mt-1 placeholder:text-[#9ca3af]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-[13px] text-[#6b7280] whitespace-nowrap"
                  >
                    · показать
                  </button>
                </div>
                <div className="text-[11px] text-[#9ca3af] mt-3">
                  Не менее 8 символов, буквы и цифры
                </div>
              </div>

              <div className="border border-[#e5e7eb] rounded-[12px] px-4 py-3 focus-within:ring-2 focus-within:ring-amber-400/30">
                <label className="text-[12px] text-[#6b7280]">
                  Повторите пароль *
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type={showPass2 ? "text" : "password"}
                    placeholder="Введите пароль ещё раз"
                    className="w-full outline-none text-[15px] mt-1 placeholder:text-[#9ca3af]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass2(!showPass2)}
                    className="text-[13px] text-[#6b7280] whitespace-nowrap"
                  >
                    · показать
                  </button>
                </div>
              </div>

              <label className="flex gap-2 text-[13px] text-[#6b7280] cursor-pointer pt-2">
                <input type="checkbox" className="mt-0.5 accent-[#111e2a]" />Я
                согласен с условиями использования и политикой
                конфиденциальности
              </label>

              <button className="w-full bg-[#f5a524] hover:bg-[#f0a01e] text-[#111827] font-medium rounded-[12px] py-[16px] text-[15px] flex justify-center items-center gap-2 transition mt-2">
                Создать аккаунт <span className="text-[18px]">→</span>
              </button>

              <div className="text-[14px] text-[#111827] pt-2">
                Уже зарегистрированы?{" "}
                <a href="/login" className="font-medium hover:underline">
                  Войти →
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
