import { useEffect, useState } from "react";
import { LanguageContext } from "./LanguageContext.js";
import { translate } from "./translate.js";

export default function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("stroy-uz-language") === "uz" ? "uz" : "ru";
    } catch {
      return "ru";
    }
  });
  useEffect(() => {
    document.documentElement.lang = language;
    document.title =
      language === "uz"
        ? "STROY UZ — qurilish materiallari marketpleysi"
        : "STROY UZ — маркетплейс строительных материалов";
    try {
      localStorage.setItem("stroy-uz-language", language);
    } catch {
      /* Storage may be disabled. */
    }
  }, [language]);
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: (value) => translate(value, language),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
