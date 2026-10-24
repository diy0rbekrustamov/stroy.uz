import crane from "../assets/optimized/rental-crane.webp";
import truck from "../assets/optimized/rental-truck.webp";
import excavator from "../assets/optimized/rental-excavator.webp";
export const equipmentTypes = {
  crane: "Автокраны",
  truck: "Самосвалы / КамАЗы",
  excavator: "Экскаваторы",
};
export const rentalCatalog = [
  {
    id: "rental-crane",
    name: "Автокран · 25 т",
    equipmentType: "crane",
    category: "Автокраны",
    capacity: "25 т",
    city: "Бухара",
    price: 2400000,
    minDays: 1,
    unit: "сутки",
    operatorIncluded: true,
    deliveryAvailable: true,
    image: crane,
    demo: true,
  },
  {
    id: "rental-truck",
    name: "Самосвал · 20 т",
    equipmentType: "truck",
    category: "Самосвалы / КамАЗы",
    capacity: "20 т",
    city: "Ташкент",
    price: 1600000,
    minDays: 1,
    unit: "сутки",
    operatorIncluded: true,
    deliveryAvailable: true,
    image: truck,
    demo: true,
  },
  {
    id: "rental-excavator",
    name: "Гусеничный экскаватор · 20 т",
    equipmentType: "excavator",
    category: "Экскаваторы",
    capacity: "20 т",
    city: "Бухара",
    price: 2800000,
    minDays: 2,
    unit: "сутки",
    operatorIncluded: true,
    deliveryAvailable: false,
    image: excavator,
    demo: true,
  },
];
export function rentalDays(start, end) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end))
    return 0;
  const days = (Date.parse(end) - Date.parse(start)) / 86400000 + 1;
  return Number.isFinite(days) && days >= 1 && days <= 365 ? days : 0;
}
