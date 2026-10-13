import { useState } from "react";
import materialsImg from "../assets/home/hero.png";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !agree) return;
    setSent(true);
    // API chaqiruv joyi: /auth/reset
    setTimeout(() => setSent(false), 60000);
  };

  return (
    <div className="min-h-screen bg-[#f5f6f7] p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-[1360px] grid grid-cols-1 lg:grid-cols-[1.05fr_1.25fr] gap-6">
        {/* LEFT */}
        <div className="bg-[#1e2f3c] rounded-[16px] p-10 flex flex-col justify-between min-h-[680px]">
          <div>
            <div className="text-[#e9a227] text-[11px] tracking-widest uppercase">
              STROY UZ / ВАШ ПРОЕКТ
            </div>
            <h1 className="text-white text-[40px] font-bold leading-[1.05] mt-10">
              Одна основа.
              <br />
              Много возможностей.
            </h1>
            <p className="text-[#a8b3be] text-[15px] mt-6 max-w-[360px]">
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
          <a href="/" className="text-[13px] text-[#6b7280]">
            ← Главная
          </a>
          <h2 className="text-[32px] md:text-[36px] font-bold mt-6 text-[#111827]">
            Восстановление пароля
          </h2>
          <p className="text-[#6b7280] text-[14px] mt-2">
            Укажите email, который использовали при регистрации.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="border border-[#e5e7eb] rounded-[12px] px-4 py-3.5 focus-within:ring-2 focus-within:ring-amber-400/30 focus-within:border-amber-400">
              <label className="text-[12px] text-[#6b7280]">Email *</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Введите email"
                type="email"
                className="w-full outline-none text-[14px] mt-1"
              />
              <div className="text-[11px] text-[#9ca3af] mt-2">
                Проверьте адрес перед отправкой
              </div>
            </div>

            <label className="flex items-start gap-2 text-[12px] text-[#6b7280] cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 accent-[#111e2a]"
              />
              Согласен на обработку email для восстановления доступа
            </label>

            <button
              disabled={!agree || !email || sent}
              className="w-full bg-[#f59e0b] disabled:bg-[#fcd58a] text-[#111827] font-medium rounded-[12px] py-4 text-[14px] flex justify-center items-center gap-2 transition"
            >
              {sent ? "Ссылка отправлена" : "Отправить ссылку"} <span>→</span>
            </button>

            <div className="bg-[#f8f9fa] rounded-[12px] p-4">
              <div className="text-[13px] font-semibold text-[#111827]">
                Без раскрытия данных аккаунта
              </div>
              <p className="text-[12px] text-[#6b7280] mt-1.5 leading-[1.4]">
                Если аккаунт с этим email существует, мы отправим ссылку. Ответ
                одинаков для любого адреса.
              </p>
            </div>

            <a
              href="/login"
              className="inline-block text-[13px] font-medium text-[#111827] hover:underline"
            >
              ← Вернуться ко входу
            </a>

            <div className="text-[11px] text-[#9ca3af] leading-[1.4] pt-2">
              Ссылка действует 30 минут. Не сообщайте её другим людям. Повторная
              отправка станет доступна через 60 секунд.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
