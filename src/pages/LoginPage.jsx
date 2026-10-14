import { Link } from "react-router";
import { useState } from "react";
import materialsImg from "../assets/home/hero.png";

export default function LoginPage() {
  const [role, setRole] = useState("buyer");
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  return (
    <div className="min-h-screen bg-[#f5f6f7] p-4 md:p-8 ">
      <div className="mx-auto w-full max-w-[1360px] grid grid-cols-1 lg:grid-cols-[1.05fr_1.25fr] gap-6">
        {/* LEFT - bir xil register bilan */}
        <div className="bg-[#1e2f3c] rounded-[16px] p-10 flex flex-col justify-between min-h-[700px]">
          <div>
            <div className="text-[#e9a227] text-[11px] tracking-widest uppercase font-medium">
              STROY UZ / ВАШ ПРОЕКТ
            </div>
            <h1 className="text-white text-[40px] leading-[1.05] font-bold mt-10">
              Одна основа.
              <br />
              Много возможностей.
            </h1>
            <p className="text-[#a8b3be] text-[15px] mt-6 max-w-[360px] leading-[1.5]">
              Покупайте материалы, находите услуги и управляйте своим делом.
            </p>
          </div>
          <img
            src={materialsImg}
            alt="ref"
            className="w-full object-contain my-8"
          />
          <div className="text-[#7b8a96] text-[11px]">
            Визуальный референс материалов, не 3D-модель.
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white rounded-[16px] p-10">
          <Link to="/" className="text-[13px] text-[#6b7280]">
            ← Главная
          </Link>
          <h2 className="text-[38px] font-bold mt-6 text-[#111827]">Вход</h2>
          <p className="text-[#6b7280] text-[14px] mt-2">
            Вернитесь к своему проекту. Один аккаунт для покупок и продаж.
          </p>

          <div className="flex gap-2 mt-8">
            <button
              onClick={() => setRole("buyer")}
              className={`px-4 py-2 rounded-[10px] text-[13px] font-medium ${role === "buyer" ? "bg-[#111e2a] text-white" : "bg-[#f2f3f5] text-[#111827]"}`}
            >
              Покупатель
            </button>
            <button
              onClick={() => setRole("seller")}
              className={`px-4 py-2 rounded-[10px] text-[13px] font-medium ${role === "seller" ? "bg-[#111e2a] text-white" : "bg-[#f2f3f5] text-[#111827]"}`}
            >
              Продавец
            </button>
          </div>

          <form className="mt-8 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="border border-[#e5e7eb] rounded-[12px] px-4 py-3.5">
              <label className="text-[12px] text-[#6b7280]">Email *</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Введите email"
                className="w-full outline-none text-[14px] mt-1"
              />
              <div className="text-[11px] text-[#9ca3af] mt-2">
                Например, name@example.com
              </div>
            </div>

            <div className="border border-[#e5e7eb] rounded-[12px] px-4 py-3.5">
              <label className="text-[12px] text-[#6b7280]">Пароль *</label>
              <div className="flex items-center gap-2">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  placeholder="Введите пароль"
                  className="w-full outline-none text-[14px] mt-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-[12px] text-[#6b7280]"
                >
                  · показать
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                className="accent-[#111e2a]"
                id="remember"
              />
              <label htmlFor="remember" className="text-[12px] text-[#6b7280]">
                Запомнить меня на этом устройстве
              </label>
            </div>

            <Link
              to="/reset-password"
              className="block text-[13px] font-medium text-[#111827] hover:underline"
            >
              Забыли пароль?
            </Link>

            <label className="flex gap-2 text-[12px] text-[#6b7280] cursor-pointer">
              <input type="checkbox" className="accent-[#111e2a] mt-0.5" />Я
              согласен с условиями использования и политикой конфиденциальности
            </label>

            <button className="w-full bg-[#f59e0b] hover:bg-[#e89a0c] text-[#111827] font-medium rounded-[12px] py-4 text-[14px] flex justify-center items-center gap-2 mt-2">
              Войти <span>→</span>
            </button>

            <div className="text-[13px] pt-2">
              Нет аккаунта?{" "}
              <Link
                to="/register"
                className="font-medium text-[#111827] hover:underline"
              >
                Зарегистрироваться →
              </Link>
            </div>

            <div className="text-[11px] text-[#9ca3af] leading-[1.4] pt-4">
              Обязательные поля отмечены *. Ошибки показываем рядом с полем,
              данные сохраним при повторе.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
