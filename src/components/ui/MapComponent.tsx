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
  const markerRef = useRef<L.Marker | null>(null);
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

      // Создаем круглый маркер
      const createMarkerIcon = (size: number, color = "#356ac9") => {
        return L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              width: ${size}px;
              height: ${size}px;
              background: ${color};
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 5px rgba(0,0,0,0.2);
              transition: all 0.2s ease-out;
            "></div>
          `,
          iconSize: [size, size],
          iconAnchor: [size/2, size/2]
        });
      };

      // Создаем маркер
      const marker = L.marker(VID_COFFEE_COORDS, {
        icon: createMarkerIcon(24),
        interactive: true,
      }).addTo(map);

      marker.on("click", () => {
        onPlaceSelect(PLACE_INFO);
      });

      mapRef.current = map;
      markerRef.current = marker;

      // Дополнительный стиль для приглушенных цветов
      mapContainerRef.current.style.filter = 'saturate(1.05) brightness(1.05)';
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={mapContainerRef} className="w-full h-full bg-[#d6e7ff]" />;
}