import { useContext } from "react";
import { LanguageContext } from "./LanguageContext.js";

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage requires LanguageProvider");
  return value;
}
