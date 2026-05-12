import { useEffect, useRef } from "react";

interface TawkToWidgetProps {
  propertyId: string; 
  widgetId?: string;
}

export default function LiveChat({ propertyId, widgetId = "default" }: TawkToWidgetProps) {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    isLoaded.current = true;

    if (typeof window !== "undefined") {
      (window as any).Tawk_API = (window as any).Tawk_API || {};
      (window as any).Tawk_LoadStart = new Date();
    }

    const script = document.createElement("script");
    script.src = `https://embed.tawk.to/${propertyId}`;
    script.async = true;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    
    script.onload = () => {
      console.log("✅ Tawk.to loaded");
      // Опционально: настройка виджета после загрузки
      // (window as any).Tawk_API?.onLoad?.(() => {
      //   (window as any).Tawk_API?.maximize?.();
      // });
    };

    script.onerror = () => {
      console.error("❌ Failed to load Tawk.to");
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [propertyId, widgetId]);

  return null;
}