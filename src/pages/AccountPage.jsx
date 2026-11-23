import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { api } from "../api/client.js";
import { useSession } from "../api/useSession.js";
import { useLanguage } from "../i18n/useLanguage.js";
import Button from "../components/ui/Button.jsx";
import { statusLabel } from "../api/status.js";
import ProfileForm from "../components/account/ProfileForm.jsx";
import "../components/account/workspace.css";

export default function AccountPage() {
  const { t, language } = useLanguage(), { user, loading, error: sessionError } = useSession(), navigate = useNavigate();
  const [params] = useSearchParams(), section = params.get("section") || "orders";
  const [data, setData] = useState({orders:[],requests:[],loading:true,error:""});
  const [revision, setRevision] = useState(0), [filter, setFilter] = useState("all"), [query, setQuery] = useState(""), [message,setMessage] = useState("");
  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    setData({orders:[],requests:[],loading:true,error:""});
    Promise.all([api("/orders"), api("/requests")]).then(([o,r]) => {
      if(active) setData({orders:o.orders,requests:r.items,loading:false,error:""});
    }).catch(error => {if(active) setData({orders:[],requests:[],loading:false,error:error.message});});
    return () => {active=false;};
  }, [user?.id,revision]);
  const money = value => new Intl.NumberFormat(language).format(value);
  const activeStatus = status => !["completed","cancelled"].includes(status);
  const match = statuses => filter === "all" || (filter === "active" ? statuses.some(activeStatus) : statuses.every(s => !activeStatus(s)));
  const orders=data.orders.filter(o => match(o.items.map(i=>i.status)) && `${o.id} ${o.items.map(i=>t(i.name)).join(" ")}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const requests=data.requests.filter(r=>match([r.status]) && `${r.id} ${r.data.name || ""} ${r.data.task || ""}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  if(loading) return <div className="workspace"><div className="workspace-inner" role="status">{t("Загрузка…")}</div></div>;
  if(!user || sessionError) return <div className="workspace"><div className="workspace-inner"><h1>{t("Личный кабинет")}</h1><p role="status">{t(sessionError || "Войдите в аккаунт, чтобы продолжить.")}</p><Button to="/login">{t("Войти")}</Button>{sessionError && <Button onClick={()=>window.dispatchEvent(new Event("stroy-session"))}>{t("Повторить")}</Button>}</div></div>;
  return <div className="workspace"><div className="workspace-inner">
    <header className="workspace-head"><div><p className="workspace-muted">STROY UZ / {t("Покупатель")}</p><h1>{t("Личный кабинет")}</h1><p>{user.name}</p></div><div className="workspace-actions"><Button to="/catalog">{t("Открыть каталог")}</Button><Button variant="secondary" onClick={async()=>{try{await api("/auth/logout",{method:"POST",body:{}});window.dispatchEvent(new Event("stroy-session"));navigate("/login");}catch(e){setMessage(e.message);}}}>{t("Выйти")}</Button></div></header>
    <div className="workspace-grid"><nav className="workspace-nav" aria-label={t("Личный кабинет")}>
      {[["orders","Мои заказы"],["requests","Мои заявки"],["profile","Профиль и адрес"]].map(([key,label])=><Link key={key} to={`/account?section=${key}`} aria-current={section===key?"page":undefined}>{t(label)}</Link>)}
      <Link to="/favorites">{t("Избранное")}</Link><Link to="/cart">{t("Корзина")}</Link><Link to="/seller">{t(user.role==="seller"?"Кабинет продавца":"Стать продавцом")}</Link>
    </nav><div className="workspace-content">
      <div className="workspace-stats">{[[data.orders.length,"Мои заказы"],[data.orders.filter(o=>o.items.some(i=>activeStatus(i.status))).length,"В работе"],[data.requests.length,"Мои заявки"]].map(([value,label])=><div className="workspace-stat" key={label}><strong>{data.loading?"—":value}</strong><span>{t(label)}</span></div>)}</div>
      {section==="profile" ? <ProfileForm key={user.id} user={user}/> : <section>
        <div className="workspace-head"><h2>{t(section==="requests"?"Мои заявки":"Мои заказы")}</h2><Button variant="secondary" disabled={data.loading} onClick={()=>setRevision(n=>n+1)}>{t("Обновить")}</Button></div>
        <div className="workspace-toolbar"><label>{t("Поиск")}<input type="search" value={query} onChange={e=>setQuery(e.target.value)}/></label><label>{t("Статус")}<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">{t("Все")}</option><option value="active">{t("В работе")}</option><option value="closed">{t("Завершённые")}</option></select></label></div>
        {data.loading ? <p role="status">{t("Загрузка…")}</p> : data.error ? <p role="alert" className="workspace-error">{t(data.error)}</p> : <div className="workspace-list">
          {section==="requests" ? requests.map(r=><article className="workspace-card" key={r.id}><div className="workspace-row"><h3>{r.data.name || `#${r.id.slice(0,8)}`}</h3><span className="workspace-badge" data-status={r.status}>{t(statusLabel(r.status))}</span></div><p>{r.data.task}</p><p className="workspace-muted">{r.data.address}</p>{r.data.kind==="rental" && <p>{r.data.startDate} — {r.data.endDate} · {r.data.days} {t("сутки")}</p>}</article>) : orders.map(o=><article className="workspace-card" key={o.id}>
            <div className="workspace-row"><div><h3>#{o.id.slice(0,8)}</h3><p className="workspace-muted">{new Date(o.created_at).toLocaleDateString(language)}</p></div><strong>{money(o.total)} {t("сум")}</strong></div>
            <ul className="workspace-lines">{o.items.map(i=><li key={i.id}><span>{t(i.name)} × {i.quantity}</span><span className="workspace-badge" data-status={i.status}>{t(statusLabel(i.status))}</span></li>)}</ul><p className="workspace-muted">{o.address}</p><Button to={`/orders/${o.id}/delivery`} variant="secondary">{t("Отследить доставку")}</Button>
          </article>)}
          {!(section==="requests"?requests:orders).length && <div className="workspace-card workspace-empty"><h3>{t("Пока пусто")}</h3><p className="workspace-muted">{t("Измените фильтры или выберите предложение в каталоге.")}</p><Button to={section==="requests"?"/services":"/catalog"}>{t("Открыть каталог")}</Button></div>}
        </div>}
      </section>}
      <p role="status">{t(message)}</p>
    </div></div>
  </div></div>;
}
