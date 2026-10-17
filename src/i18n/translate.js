import { uz } from "./uz.js";
import { en } from "./en.js";
const dictionaries = { uz, en };

const normalize = (value) => value.replace(/\s+/g, " ").trim();
const patterns = Object.fromEntries(
  Object.entries(dictionaries).map(([language, dictionary]) => {
    const phrases = Object.keys(dictionary).sort((a, b) => b.length - a.length);
    return [
      language,
      new RegExp(
        "(?<![\\p{L}])(?:" +
          phrases
            .map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join("|") +
          ")(?![\\p{L}])",
        "gu",
      ),
    ];
  }),
);

export const normalizeSearch = (value) =>
  value
    .toLowerCase()
    .replace(/[‘’ʻʼ`´]/g, "'")
    .trim();

// Numbers, React nodes, form values, IDs and product data retain their original type.
export function translate(value, language) {
  const dictionary = dictionaries[language];
  if (!dictionary || typeof value !== "string") return value;
  const key = normalize(value);
  if (Object.hasOwn(dictionary, key)) {
    return value.match(/^\s*/)[0] + dictionary[key] + value.match(/\s*$/)[0];
  }
  return value.replace(patterns[language], (phrase) => dictionary[phrase]);
}

export function matchesProduct(product, query) {
  const source = [
    product.name,
    product.category,
    product.details,
    product.brand || "",
  ].join(" ");
  return normalizeSearch(
    [source, translate(source, "uz"), translate(source, "en")].join(" "),
  ).includes(normalizeSearch(query));
}
export function productCount(count, language) {
  if (language === "uz") return count + " ta mahsulot";
  if (language === "en")
    return count + (count === 1 ? " product" : " products");
  return (
    count +
    " " +
    { one: "товар", few: "товара", many: "товаров", other: "товара" }[
      new Intl.PluralRules("ru").select(count)
    ]
  );
}
