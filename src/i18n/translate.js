import { uz } from "./uz.js";

const normalize = (value) => value.replace(/\s+/g, " ").trim();
const phrases = Object.keys(uz).sort((a, b) => b.length - a.length);
const pattern = new RegExp(
  phrases
    .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|"),
  "g",
);

export const normalizeSearch = (value) =>
  value
    .toLowerCase()
    .replace(/[‘’ʻʼ`´]/g, "'")
    .trim();

// Numbers, React nodes, form values, IDs and product data retain their original type.
export function translate(value, language) {
  if (language !== "uz" || typeof value !== "string") return value;
  const key = normalize(value);
  if (Object.hasOwn(uz, key)) {
    return value.match(/^\s*/)[0] + uz[key] + value.match(/\s*$/)[0];
  }
  return value.replace(pattern, (phrase) => uz[phrase]);
}
