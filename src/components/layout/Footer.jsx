import Brand from "./Brand.jsx";
const columns = [
  [
    "Каталог",
    [
      ["Стройматериалы", "#categories"],
      ["Инструменты", "#products"],
      ["Отделка", "#categories"],
      ["Сантехника", "#categories"],
    ],
  ],
  [
    "Покупателям",
    [
      ["Доставка и оплата", "#services"],
      ["Возврат товара", null],
      ["Частые вопросы", null],
      ["Личный кабинет", null],
    ],
  ],
  [
    "Для бизнеса",
    [
      ["Оптовые поставки", "#business"],
      ["Коммерческое предложение", "#business"],
      ["Партнёрство", "#business"],
      ["О компании", null],
    ],
  ],
];
export default function Footer({ onInfo }) {
  const info = (title) =>
    onInfo(
      title,
      "STROY UZ — концепция маркетплейса строительных материалов. Этот раздел будет доступен после подключения соответствующей страницы командой.",
    );
  return (
    <footer className="home-footer" id="footer">
      <div className="home-container">
        <div className="home-footer-grid">
          <div>
            <Brand />
            <p>
              Материалы для больших идей.
              <br />
              Строительство. Ремонт. Результат.
            </p>
            <div className="home-social">
              <button type="button" onClick={() => info("Telegram")}>
                Telegram ↗
              </button>
              <button type="button" onClick={() => info("Instagram")}>
                Instagram ↗
              </button>
            </div>
          </div>
          {columns.map(([title, links]) => (
            <div key={title}>
              <h3>{title}</h3>
              <ul>
                {links.map(([label, href]) => (
                  <li key={label}>
                    {href ? (
                      <a href={href}>{label}</a>
                    ) : (
                      <button type="button" onClick={() => info(label)}>
                        {label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="home-footer-bottom">
          <span>© STROY UZ. Концепция интернет-магазина.</span>
          <div>
            <button type="button" onClick={() => info("Конфиденциальность")}>
              Конфиденциальность
            </button>
            <button type="button" onClick={() => info("Условия использования")}>
              Условия использования
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
