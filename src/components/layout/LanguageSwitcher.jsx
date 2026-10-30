import { useLanguage } from "../../i18n/useLanguage.js";
import "./LanguageSwitcher.css";

const languages = [
  ["ru", "Русский"],
  ["uz", "O‘zbekcha"],
  ["en", "English"],
];

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();
  const index = languages.findIndex(([code]) => code === language);
  return (
    <div
      className="locale-deck"
      role="group"
      aria-label={t("Язык интерфейса")}
      style={{ "--locale-index": index }}
    >
      <span className="locale-orbit" aria-hidden="true">
        <span key={language}>{String(index + 1).padStart(2, "0")}</span>
      </span>
      <div className="locale-track">
        <span className="locale-slider" aria-hidden="true" />
        {languages.map(([code, name]) => (
          <button
            key={code}
            type="button"
            lang={code}
            aria-label={name}
            title={name}
            aria-pressed={language === code}
            onClick={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              setLanguage(code, {
                x: rect.x + rect.width / 2,
                y: rect.y + rect.height / 2,
              });
            }}
          >
            <span>{code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
