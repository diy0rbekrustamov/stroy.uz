import { useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { LanguageContext } from "./LanguageContext.js";
import { translate } from "./translate.js";

const titles = {
  ru: "STROY UZ — маркетплейс строительных материалов",
  uz: "STROY UZ — qurilish materiallari marketpleysi",
  en: "STROY UZ — building materials marketplace",
};

export default function LanguageProvider({ children }) {
  const [language, updateLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem("stroy-uz-language");
      return Object.hasOwn(titles, saved) ? saved : "ru";
    } catch {
      return "ru";
    }
  });
  const transition = useRef(null);
  const requestedLanguage = useRef(language);
  const setLanguage = useCallback(
    (next, origin) => {
      if (!Object.hasOwn(titles, next) || next === requestedLanguage.current) return;
      requestedLanguage.current = next;
      transition.current?.skipTransition();
      if (
        !document.startViewTransition ||
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      ) {
        updateLanguage(next);
        return;
      }
      document.documentElement.style.setProperty(
        "--locale-x",
        (origin?.x ?? window.innerWidth / 2) + "px",
      );
      document.documentElement.style.setProperty(
        "--locale-y",
        (origin?.y ?? 0) + "px",
      );
      try {
        const active = document.startViewTransition(() =>
          flushSync(() => updateLanguage(requestedLanguage.current)),
        );
        transition.current = active;
        active.finished
          .catch(() => {})
          .finally(() => {
            if (transition.current === active) transition.current = null;
          });
      } catch {
        updateLanguage(next);
      }
    },
    [],
  );
  useEffect(() => () => transition.current?.skipTransition(), []);
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = titles[language];
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
