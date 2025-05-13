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
      const map = L.map(mapContainerRef.current).setView(INITIAL_MAP_CENTER, 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors & CartoDB'
      }).addTo(map);

      const redIcon = L.icon({
        iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff0000"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
      });

      const marker = L.marker(VID_COFFEE_COORDS, {
        icon: redIcon,
        title: "Vid Coffee",
        interactive: true
      }).addTo(map);

      marker.on('click', () => {
        onPlaceSelect(PLACE_INFO);
      });

      mapRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Пустой массив — useEffect выполнится один раз при монтировании

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
