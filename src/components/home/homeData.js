import cement from "../../assets/home/cement.png";
import bricks from "../../assets/home/bricks.png";
import drill from "../../assets/home/drill.png";
import paint from "../../assets/home/paint.png";
import build from "../../assets/home/project-build.png";
import renovate from "../../assets/home/project-renovate.png";
import tools from "../../assets/home/project-tools.png";
import journalCement from "../../assets/home/journal-cement.png";
import journalBricks from "../../assets/home/journal-bricks.png";
import journalTools from "../../assets/home/journal-tools.png";

export const categories = [
  ["Цемент и сухие смеси", "Для прочного основания", "build"],
  ["Кирпич и блоки", "Форма будущего здания", "build"],
  ["Металл и арматура", "Прочность в каждой детали", "build"],
  ["Инструменты", "Точность в ваших руках", "tools"],
  ["Краски и отделка", "Характер вашего интерьера", "renovate"],
  ["Сантехника и электрика", "Комфорт внутри", "renovate"],
];
export const products = [
  {
    id: "cement",
    name: "Цемент М400 · 50 кг",
    category: "Сухие смеси",
    details: "М400 · Д20 · 50 кг",
    price: 62000,
    unit: "мешок",
    badge: "ХИТ",
    group: "build",
    image: cement,
  },
  {
    id: "bricks",
    name: "Кирпич керамический",
    category: "Кирпич и блоки",
    details: "250 × 120 × 65 мм",
    price: 2800,
    unit: "шт.",
    badge: "ДЛЯ СТРОЙКИ",
    group: "build",
    image: bricks,
  },
  {
    id: "drill",
    name: "Дрель-шуруповёрт 18V",
    category: "Электроинструменты",
    details: "18 В · 2 АКБ · кейс",
    price: 890000,
    unit: "шт.",
    badge: "ВЫБОР МАСТЕРА",
    group: "tools",
    image: drill,
  },
  {
    id: "paint",
    name: "Краска интерьерная · 10 л",
    category: "Отделочные материалы",
    details: "Матовая · белая · 10 л",
    price: 235000,
    unit: "ведро",
    badge: "НОВИНКА",
    group: "renovate",
    image: paint,
  },
];
export const projects = [
  {
    title: "Строю с нуля",
    text: "Фундамент, стены, кровля",
    image: build,
    group: "build",
  },
  {
    title: "Делаю ремонт",
    text: "Смеси, краски, покрытия",
    image: renovate,
    group: "renovate",
  },
  {
    title: "Работаю профессионально",
    text: "Инструмент и оборудование",
    image: tools,
    group: "tools",
  },
];
export const articles = [
  {
    title: "Как выбрать цемент для фундамента",
    meta: "МАТЕРИАЛЫ / 5 МИН",
    image: journalCement,
    text: "При выборе цемента учитывайте проектную марку бетона, условия строительства и рекомендации проектировщика. Проверяйте дату производства, целостность упаковки и условия хранения.",
  },
  {
    title: "Кирпич или блок: сравниваем основу",
    meta: "ГИД / 7 МИН",
    image: journalBricks,
    text: "Сравнивайте прочность, теплопроводность, размеры и стоимость кладки. Выбор материала для несущих стен должен соответствовать проекту здания.",
  },
  {
    title: "Инструмент, который работает на результат",
    meta: "ИНСТРУМЕНТ / 4 МИН",
    image: journalTools,
    text: "Подбирайте инструмент под задачи и частоту использования. Обратите внимание на мощность, совместимость аккумуляторов, комплектацию и доступность обслуживания.",
  },
];
export const formatPrice = (price) =>
  new Intl.NumberFormat("ru-RU").format(price);
