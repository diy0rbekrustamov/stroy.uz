import { useState } from "react";
import { useLanguage } from "../../i18n/useLanguage.js";
import placeholder from "../../assets/optimized/placeholder.webp";

export default function ShopImage({src,srcSet,alt="",onError,...props}) {
  const {t}=useLanguage();
  const [broken,setBroken]=useState(null);
  const fallback=!src || broken===src;
  return <img {...props} src={fallback ? placeholder : src} srcSet={fallback ? undefined : srcSet}
    alt={fallback ? t("Изображение недоступно") + (alt ? ": "+alt : "") : alt}
    decoding="async" data-fallback={fallback || undefined} onError={event=>{
      if(!fallback)setBroken(src);
      onError?.(event);
    }}/>;
}
