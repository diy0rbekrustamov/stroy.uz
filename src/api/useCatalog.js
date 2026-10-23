import { useEffect, useState } from "react";
import { catalogProducts } from "../data/catalogData.js";
import { serviceCatalog } from "../data/serviceCatalog.js";
import { api } from "./client.js";
export function useCatalog(kind = "products") {
  const fallback = kind === "products" ? catalogProducts : serviceCatalog;
  const [state, setState] = useState({
    items: fallback,
    remote: false,
    loading: true,
    error: "",
  });
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const items = [];
        for (let offset = 0; offset < 10000; offset += 100) {
          const data = await api("/" + kind + "?limit=100&offset=" + offset);
          items.push(...data.items);
          if (data.items.length < 100) break;
        }
        if (active)
          setState({
            items: items.map((item) => ({
              ...item,
              image:
                item.image ||
                fallback.find((source) => source.id === item.imageKey)?.image ||
                fallback[0].image,
            })),
            remote: true,
            loading: false,
            error: "",
          });
      } catch (error) {
        if (active)
          setState({
            items: fallback,
            remote: false,
            loading: false,
            error: error.message,
          });
      }
    };
    load();
    window.addEventListener("stroy-catalog", load);
    return () => {
      active = false;
      window.removeEventListener("stroy-catalog", load);
    };
  }, [kind, fallback]);
  return state;
}
