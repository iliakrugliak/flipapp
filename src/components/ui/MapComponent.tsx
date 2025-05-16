"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const VID_COFFEE_COORDS: [number, number] = [59.964480, 30.296195];
const INITIAL_MAP_CENTER: [number, number] = [59.96, 30.30];

const PLACE_INFO = {
  name: "Vid Coffee",
  hours: "Ежедневно с 08:00 до 20:00",
  offer: "Миндальное печенье",
  quantity: 3,
  price: 120,
};

interface MapComponentProps {
  onPlaceSelect: (place: typeof PLACE_INFO) => void;
}

export default function MapComponent({ onPlaceSelect }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: INITIAL_MAP_CENTER,
        zoom: 13,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
      }).addTo(map);

      const markerWithLabel = L.divIcon({
        className: 'marker-with-label',
        html: `
          <div style="display: flex; align-items: center;">
            <div style="
              width: 24px;
              height: 24px;
              background: #356ac9;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            "></div>
            <span style="
              margin-left: 8px;
              color: #356ac9;
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              font-size: 13px;
              font-weight: 700;
            ">
              ${PLACE_INFO.name}
            </span>
          </div>
        `,
        iconSize: [120, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker(VID_COFFEE_COORDS, {
        icon: markerWithLabel,
        interactive: true,
      }).addTo(map);

      marker.on("click", (e) => {
        e.originalEvent.stopPropagation();
        onPlaceSelect(PLACE_INFO);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mapContainerRef} className="w-full h-full bg-[#d6e7ff]" />;
}