import { useEffect,useState } from "react";
import { catalogProducts } from "../data/catalogData.js";
import { serviceCatalog } from "../data/serviceCatalog.js";
import placeholder from "../assets/optimized/placeholder.webp";
import { rentalCatalog } from "../data/rentalCatalog.js";
import { api } from "./client.js";

const cache=new Map(),pending=new Map();
async function readCatalog(kind,fallback) {
  const saved=cache.get(kind);
  if(saved && saved.expires>Date.now())return saved.items;
  if(pending.has(kind))return pending.get(kind);
  const task=(async()=>{
    const result=[];
    for(let offset=0;offset<10000;offset+=100){
      const data=await api("/"+kind+"?limit=100&offset="+offset);
      result.push(...data.items);
      if(data.items.length<100)break;
    }
    const items=result.map(item=>{
      const sample=fallback.find(source=>source.id===item.imageKey);
      return {...item,image:item.image || sample?.image || placeholder,thumbnail:item.image ? undefined : sample?.thumbnail};
    });
    cache.set(kind,{items,expires:Date.now()+30000});return items;
  })();
  pending.set(kind,task);
  try{return await task;}finally{pending.delete(kind);}
}
export function useCatalog(kind="products") {
  const fallback=kind==="products" ? catalogProducts : kind==="rentals" ? rentalCatalog : serviceCatalog;
  const [state,setState]=useState({items:fallback,remote:false,loading:true,error:""});
  useEffect(()=>{
    let active=true;
    const load=async()=>{
      try{
        const items=await readCatalog(kind,fallback);
        if(active)setState({items:kind==="rentals" && !items.length ? fallback : items,remote:true,loading:false,error:""});
      }catch(error){if(active)setState({items:fallback,remote:false,loading:false,error:error.message});}
    };
    const refresh=()=>{cache.delete(kind);load();};
    load();window.addEventListener("stroy-catalog",refresh);
    return ()=>{active=false;window.removeEventListener("stroy-catalog",refresh);};
  },[kind,fallback]);
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
