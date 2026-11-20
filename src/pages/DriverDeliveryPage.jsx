import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/useLanguage.js";
import Button from "../components/ui/Button.jsx";
import DeliveryMap from "../components/delivery/DeliveryMap.jsx";

export default function DriverDeliveryPage() {
  const { t, language } = useLanguage();
  const [token] = useState(() => location.hash.slice(1));
  const [data,setData] = useState(null),[message,setMessage] = useState(""),[sharing,setSharing] = useState(false),[position,setPosition] = useState(null),[sent,setSent] = useState(null);
  const watcher = useRef(null), active = useRef(false), lastSent = useRef(0), sending = useRef(false);
  async function call(path, body) {
    const response = await fetch(`/api/delivery/driver${path}`, {method:body ? "POST" : "GET",headers:{"X-Delivery-Token":token,...(body ? {"Content-Type":"application/json"} : {})},...(body ? {body:JSON.stringify(body)} : {})});
    if(!response.ok) throw new Error(response.status===401 || response.status===409 ? "Ссылка недействительна или доставка ещё не отправлена." : "Не удалось передать координаты. Проверьте интернет.");
    return response.json();
  }
  useEffect(() => {
    let mounted = true;
    call("").then(value=>{if(mounted)setData(value);}).catch(e=>{if(mounted)setMessage(e.message);});
    return () => {mounted=false;active.current=false;if(watcher.current!==null)navigator.geolocation?.clearWatch(watcher.current);};
    // The capability remains fixed for the lifetime of this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
  const stop = async () => {
    active.current=false;
    if(watcher.current!==null)navigator.geolocation?.clearWatch(watcher.current);
    watcher.current=null;setSharing(false);
    try {await call("/stop",{});setMessage("Передача координат остановлена.");} catch(e){setMessage(e.message);}
  };
  const start = () => {
    if(!navigator.geolocation) return setMessage("Геолокация недоступна. Проверьте разрешения браузера.");
    if(active.current) return;
    active.current=true;setSharing(true);setMessage("");lastSent.current=0;
    watcher.current=navigator.geolocation.watchPosition(async value => {
      if(!active.current || sending.current || Date.now()-lastSent.current<10000) return;
      sending.current=true;
      const next = {lat:value.coords.latitude,lng:value.coords.longitude,accuracy:value.coords.accuracy,capturedAt:new Date(value.timestamp).toISOString()};
      try {await call("/location",next);if(active.current){setPosition(next);setSent(Date.now());lastSent.current=Date.now();setMessage("");}else await call("/stop",{});}
      catch(e){if(active.current)setMessage(e.message);}finally{sending.current=false;}
    },()=>{setMessage("Геолокация недоступна. Проверьте разрешения браузера.");active.current=false;setSharing(false);if(watcher.current!==null)navigator.geolocation.clearWatch(watcher.current);watcher.current=null;call("/stop",{}).catch(()=>{});}, {enableHighAccuracy:true,maximumAge:5000,timeout:20000});
  };
  return <section className="delivery-page"><div className="delivery-container delivery-driver">
    <p className="delivery-eyebrow">{t("STROY UZ / ДОСТАВКА")}</p><h1>{t("На связи с получателем")}</h1>
    <p className="delivery-muted">{t("Передавайте местоположение только во время доставки. Не закрывайте эту страницу: в фоне браузер может остановить передачу.")}</p>
    {data && <div className="delivery-card"><h2>{t("Место доставки")}</h2><p>{data.address}</p><DeliveryMap point={data.delivery?.point} vehicle={position}/>
      {data.delivery?.note && <p className="delivery-note">{data.delivery.note}</p>}
      <p className="delivery-muted">{t("Нажимая кнопку, вы разрешаете показывать вашу геопозицию покупателю этого заказа.")}</p>
      <Button onClick={sharing ? stop : start} disabled={data.status!=="shipped"}>{t(sharing ? "Остановить передачу" : "Передавать моё местоположение")}</Button>
      {data.status!=="shipped" && <p>{t("Дождитесь, пока продавец отметит заказ отправленным, затем обновите страницу.")}</p>}
      {sent && <p className="delivery-muted">{t("Последнее обновление")}: {new Date(sent).toLocaleTimeString(language)}</p>}
    </div>}
    <p role="status" className="delivery-note">{t(message || (sharing ? "Передача координат включена" : "Передача координат выключена"))}</p>
  </div></section>;
}
