import { useEffect, useState } from "react";
import placeholder from "../assets/optimized/placeholder.webp";
import { api } from "./client.js";
import { demoCatalogEnabled, demoItems } from "../data/demoCatalog.js";

const cache = new Map();
const pending = new Map();
let revision = 0;
const empty = { items: [], remote: false, loading: true, error: "" };
const groups = { tools: "tools", mixes: "build", bricks: "build", metal: "build", finishing: "renovate", plumbing: "renovate" };
async function readCatalog(kind) {
  const saved = cache.get(kind);
  if (saved?.expires > Date.now()) return saved.items;
  if (pending.has(kind)) return pending.get(kind);
  const currentRevision = revision;
  const task = (async () => {
    const result = [];
    for (let offset = 0; offset < 10000; offset += 100) {
      const data = await api(`/${kind}?limit=100&offset=${offset}`);
      result.push(...data.items);
      if (data.items.length < 100) break;
    }
    const items = result.filter(item => item.sellerId && !item.demo && item.published).map(item => ({ ...item, image: item.image || placeholder, group: groups[item.categoryId] || "build" }));
    if (revision === currentRevision) cache.set(kind, { items, expires: Date.now() + 30000 });
    return items;
  })();
  pending.set(kind, task);
  try { return await task; }
  finally { if (pending.get(kind) === task) pending.delete(kind); }
}
export function useCatalog(kind = "products") {
  const [state, setState] = useState(()=>demoCatalogEnabled ? {...empty,items:demoItems(kind),loading:false,demo:true} : empty);
  useEffect(() => {
    let active = true, requestId = 0;
    const load = async () => {
      const id = ++requestId;
      setState(current => ({ ...current, loading: !current.items.length, error: "" }));
      try {
        const items = await readCatalog(kind);
        if (active && id === requestId) setState({ items:[...items,...demoItems(kind)], remote: true, loading: false, error: "",demo:demoCatalogEnabled });
      } catch (error) {
        if (active && id === requestId) setState({ items: demoItems(kind), remote: false, loading: false, error: demoCatalogEnabled ? "" : error.message,demo:demoCatalogEnabled });
      }
    };
    const refresh = () => { revision++; cache.clear(); pending.clear(); load(); };
    load();
    window.addEventListener("stroy-catalog", refresh);
    window.addEventListener("focus", load);
    return () => { active = false; window.removeEventListener("stroy-catalog", refresh); window.removeEventListener("focus", load); };
  }, [kind]);
  return state;
}

// Catalog pages request only the visible slice from the API. Unlike useCatalog,
// this hook never downloads the whole products table to filter it in the browser.
export function useProductCatalog(filters) {
  const query = new URLSearchParams({
    limit: String(filters.limit),
    page: String(filters.page),
    sort: filters.sort,
    ...(filters.search ? { q: filters.search } : {}),
    ...(filters.category !== "all" ? { category: filters.category } : {}),
    ...(filters.brand !== "all" ? { brand: filters.brand } : {}),
    ...(filters.min !== null ? { min: String(filters.min) } : {}),
    ...(filters.max !== null ? { max: String(filters.max) } : {}),
    ...(filters.stock ? { stock: "1" } : {}),
  }).toString();
  const [state, setState] = useState({
    items: [], total: 0, page: 1, pages: 1,
    remote: false, loading: true, error: "", key: "",
  });
  useEffect(() => {
    let active = true;
    setState((previous) => ({ ...previous, loading: true, error: "", key: query }));
    api(`/products?${query}`)
      .then((result) => {
        if (!active) return;
        const items = result.items.map((item) => {
          const sample = catalogProducts.find((source) => source.id === (item.imageKey || item.id));
          return {
            ...item,
            image: item.image || sample?.image || placeholder,
            thumbnail: item.image ? undefined : sample?.thumbnail,
          };
        });
        setState({
          items,
          total: result.total,
          page: result.page,
          pages: result.pages,
          remote: true,
          loading: false,
          error: "", key: query,
        });
      })
      .catch((error) => {
        if (active) setState({
          items: [], total: 0, page: 1, pages: 1,
          remote: false, loading: false, error: error.message, key: query,
        });
      });
    return () => { active = false; };
  }, [query]);
  return state.key === query
    ? state
    : { items: [], total: 0, page: filters.page, pages: 1, remote: false, loading: true, error: "" };
}

export function useProductFacets() {
  const [facets, setFacets] = useState(null);
  useEffect(() => {
    let active = true;
    api("/catalog/facets").then((result) => {
      if (active) setFacets(result);
    }).catch(() => {});
    return () => { active = false; };
  }, []);
  return facets;
}
