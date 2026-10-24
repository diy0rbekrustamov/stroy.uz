import { catalogProducts } from "./catalogData.js";
import { serviceCatalog } from "./serviceCatalog.js";
import { rentalCatalog } from "./rentalCatalog.js";

// Production is real-only unless demo mode is explicitly enabled.
export const demoCatalogEnabled = import.meta.env.VITE_DEMO_CATALOG === "true" ||
  (import.meta.env.DEV && import.meta.env.VITE_DEMO_CATALOG !== "false");
const examples = { products: catalogProducts, services: serviceCatalog, rentals: rentalCatalog };
export const demoItems = kind => demoCatalogEnabled
  ? (examples[kind] || []).map(item => ({...item, demo:true, sellerId:null, published:false}))
  : [];
