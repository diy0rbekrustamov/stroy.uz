import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/useLanguage.js";
import Button from "../ui/Button.jsx";
import "leaflet/dist/leaflet.css";
import "./delivery.css";

export default function DeliveryMap({ point, vehicle, onChange }) {
  const { t } = useLanguage();
  const destinationLabel = t("Место доставки"), vehicleLabel = t("Машина");
  const container = useRef(null), instance = useRef(null), change = useRef(onChange);
  const [ready, setReady] = useState(false), [error, setError] = useState("");
  useEffect(() => { change.current = onChange; }, [onChange]);
  useEffect(() => {
    let disposed = false, observer;
    import("leaflet").then(module => {
      if (disposed) return;
      const L = module.default;
      const map = L.map(container.current, { scrollWheelZoom: false, zoomControl: false }).setView([39.7747, 64.4286], 13);
      const tiles = L.tileLayer(import.meta.env.VITE_MAP_TILE_URL || "https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      tiles.on("tileerror", () => setError("Карта недоступна. Можно указать координаты вручную."));
      map.on("click", event => change.current?.({lat: Number(event.latlng.lat.toFixed(6)), lng: Number(event.latlng.lng.toFixed(6))}));
      instance.current = { L, map, layers: L.layerGroup().addTo(map) };
      observer = new ResizeObserver(() => map.invalidateSize());
      observer.observe(container.current);
      setReady(true);
    }).catch(() => setError("Карта недоступна. Можно указать координаты вручную."));
    return () => { disposed = true; observer?.disconnect(); instance.current?.map.remove(); instance.current = null; };
  }, []);
  useEffect(() => {
    if (!ready || !instance.current) return;
    const { L, map, layers } = instance.current;
    layers.clearLayers();
    const points = [];
    for (const [location, label, className] of [[point, destinationLabel, "destination"], [vehicle, vehicleLabel, "vehicle"]]) {
      if (!location || !Number.isFinite(location.lat) || !Number.isFinite(location.lng) || Math.abs(location.lat) > 85 || Math.abs(location.lng) > 180) continue;
      const coords = [location.lat, location.lng];
      points.push(coords);
      const marker = L.marker(coords, { title: label, icon: L.divIcon({ className: `delivery-marker ${className}`, html: className === "destination" ? "●" : "↗", iconSize: [34,34], iconAnchor: [17,34] }) });
      marker.addTo(layers);
    }
    if (points.length === 2) map.fitBounds(points, { padding: [50,50], maxZoom: 16, animate: false });
    else if (points.length) map.setView(points[0], Math.max(map.getZoom(), 14), { animate: false });
  }, [ready, point, vehicle, destinationLabel, vehicleLabel]);
  return <div className="delivery-map-wrap">
    <div ref={container} className="delivery-map" role="region" aria-label={t("Карта доставки")} />
    <div className="delivery-map-tools">
      <button type="button" aria-label={t("Увеличить карту")} onClick={() => instance.current?.map.zoomIn()}>+</button>
      <button type="button" aria-label={t("Уменьшить карту")} onClick={() => instance.current?.map.zoomOut()}>−</button>
      {onChange && <button type="button" title={t("Выбрать центр карты")} onClick={() => { const center = instance.current?.map.getCenter(); if(center) onChange({lat:Number(center.lat.toFixed(6)),lng:Number(center.lng.toFixed(6))}); }}>⌖</button>}
    </div>
    {onChange && <div className="delivery-map-hint">{t("Нажмите на карте у въезда на объект")}</div>}
    {error && <p className="delivery-map-error" role="status">{t(error)}</p>}
  </div>;
}

export function DeliveryLocationPicker({ point, onChange }) {
  const { t } = useLanguage();
  const [message, setMessage] = useState("");
  const locate = () => {
    if (!navigator.geolocation) return setMessage("Геолокация недоступна. Выберите точку на карте.");
    setMessage("Определяем местоположение…");
    navigator.geolocation.getCurrentPosition(position => {
      onChange({lat:Number(position.coords.latitude.toFixed(6)),lng:Number(position.coords.longitude.toFixed(6))});
      setMessage("Проверьте точку на карте перед заказом.");
    }, () => setMessage("Геолокация недоступна. Выберите точку на карте."), { enableHighAccuracy: true, timeout: 12000 });
  };
  return <div>
    <div className="delivery-section-heading"><div><h2>{t("Точка на карте")}</h2><p>{t("Помогите водителю найти нужный въезд")}</p></div><Button variant="secondary" onClick={locate}>{t("Моё местоположение")}</Button></div>
    <DeliveryMap point={point} onChange={onChange}/>
    <div className="delivery-point"><span className="delivery-dot"/><span>{point ? `${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}` : t("Точка пока не выбрана")}</span>{point && <button type="button" onClick={() => onChange(null)}>{t("Убрать")}</button>}</div>
    <details className="delivery-coordinates"><summary>{t("Указать координаты вручную")}</summary><div className="delivery-coordinate-fields">
      <label>{t("Широта")}<input type="number" step="any" min="-85" max="85" value={point?.lat ?? ""} onChange={e => onChange(e.target.value === "" ? null : {lat:Number(e.target.value),lng:point?.lng ?? 64.4286})}/></label>
      <label>{t("Долгота")}<input type="number" step="any" min="-180" max="180" value={point?.lng ?? ""} onChange={e => onChange(e.target.value === "" ? null : {lat:point?.lat ?? 39.7747,lng:Number(e.target.value)})}/></label>
    </div></details>
    <p role="status" className="delivery-muted">{t(message)}</p>
  </div>;
}
