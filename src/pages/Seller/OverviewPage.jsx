import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { useLanguage } from "../../i18n/useLanguage.js";
import Button from "../../components/ui/Button.jsx";

export default function OverviewPage() {
  const { t } = useLanguage();
  const [data,setData]=useState(null), [error,setError]=useState(""), [revision,setRevision]=useState(0);
  useEffect(()=>{
    let active=true;
    setError("");setData(null);
    Promise.all(["products","services","rentals","orders","requests"].map(k=>api(`/seller/${k}`))).then(results=>{
      if(active) setData(Object.fromEntries(["products","services","rentals","orders","requests"].map((key,i)=>[key,results[i].items])));
    }).catch(e=>{if(active)setError(e.message);});
    return ()=>{active=false;};
  },[revision]);
  return <div className="workspace-content"><header className="workspace-head"><div><h1>{t("Обзор магазина")}</h1><p className="workspace-muted">{t("Ассортимент, остатки и публикации в одном месте.")}</p></div><Button onClick={()=>setRevision(n=>n+1)} variant="secondary">{t("Обновить")}</Button></header>
    {error ? <p role="alert" className="workspace-error">{t(error)}</p> : !data ? <p role="status">{t("Загрузка…")}</p> : <>
      <div className="workspace-stats">{[[data.products.length,"Мои товары"],[data.orders.filter(i=>i.status==="new").length,"Новые заказы"],[data.requests.filter(i=>i.status==="new").length,"Новые заявки"]].map(([count,label])=><div className="workspace-stat" key={label}><strong>{count}</strong><span>{t(label)}</span></div>)}</div>
      <section className="workspace-card"><h2>{t("Требуют внимания")}</h2><p>{t("Товары без остатка")}: <strong>{data.products.filter(p=>p.stock===0 && p.published).length}</strong></p><p>{t("Черновики")}: <strong>{[...data.products,...data.services,...data.rentals].filter(p=>!p.published).length}</strong></p><div className="workspace-actions"><Button to="/seller/orders">{t("Заказы и заявки")}</Button><Button to="/seller" variant="secondary">{t("Мои товары")}</Button></div></section>
      <section className="workspace-card"><h2>{t("Добавить предложение")}</h2><div className="workspace-actions"><Button to="/seller/add-product">{t("Добавить товар")}</Button><Button to="/seller/add-service" variant="secondary">{t("Добавить услугу")}</Button><Button to="/seller/rentals#rental-create" variant="secondary">{t("Добавить технику")}</Button></div></section>
    </>}
  </div>;
}
