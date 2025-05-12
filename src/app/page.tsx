"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, User } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

const stories = [
  "/story1.jpg",
  "/story2.jpg",
  "/story3.jpg",
  "/story4.jpg",
  "/story5.jpg"
];

type PlaceInfo = {
  name: string;
  hours: string;
  offer: string;
  quantity: number;
  price: number;
};

const VID_COFFEE_COORDS = [59.964480, 30.296195];
const INITIAL_MAP_CENTER = [59.96, 30.30];

export default function FlipApp() {
  const [showSplash, setShowSplash] = useState(true); // <-- правильно внутри компонента
  const [step, setStep] = useState<number>(0);
  const [page, setPage] = useState<'story' | 'map'>('story');
  const [hasViewedStories, setHasViewedStories] = useState<boolean>(false);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [selectedPlace, setSelectedPlace] = useState<PlaceInfo | null>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const LRef = useRef<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const viewed = localStorage.getItem('hasViewedStories');
    if (viewed === 'true') {
      setHasViewedStories(true);
      setPage('map');
    }
  }, []);

  useEffect(() => {
    if (page === 'map' && typeof window !== 'undefined' && !leafletLoaded) {
      (async () => {
        const L = await import("leaflet");
        LRef.current = L;
        setLeafletLoaded(true);
      })();
    }
  }, [page, leafletLoaded]);

  useEffect(() => {
    if (page === 'map' && leafletLoaded && !mapRef.current) {
      const L = LRef.current;
      mapRef.current = L.map('map').setView(INITIAL_MAP_CENTER, 15);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors & CartoDB'
      }).addTo(mapRef.current);

      const redIcon = L.icon({
        iconUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff0000"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
      });

      markerRef.current = L.marker(VID_COFFEE_COORDS, {
        icon: redIcon,
        title: "Vid Coffee"
      })
      .addTo(mapRef.current)
      .on('click', () => {
        setSelectedPlace({
          name: "Vid Coffee",
          hours: "Ежедневно с 08:00 до 20:00",
          offer: "Миндальное печенье",
          quantity: 3,
          price: 120,
        });
      });

      return () => {
        mapRef.current?.remove();
        mapRef.current = null;
      };
    }
  }, [page, leafletLoaded]);

  const nextStory = () => {
    if (step < stories.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('hasViewedStories', 'true');
      setHasViewedStories(true);
      setPage("map");
    }
  };

  const closeCard = () => {
    setSelectedPlace(null);
  };

  if (showSplash) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#012044]">
        <Image
          src="/splash.jpg"
          alt="Splash Screen"
          width={300}
          height={300}
          className="rounded-xl"
          priority
        />
      </div>
    );
  }

  if (!hasViewedStories && page === "story") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#012044] text-white" onClick={nextStory}>
        <Image
          src={stories[step]}
          alt={`Story ${step + 1}`}
          width={320}
          height={560}
          className="rounded-2xl border-4 border-white shadow-xl"
          priority
        />
        {step === stories.length - 1 && (
          <Button className="mt-4 bg-[#fed619] text-[#012044]" onClick={() => {
            localStorage.setItem('hasViewedStories', 'true');
            setPage("map");
          }}>
            Перейти к карте
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <div className="absolute top-2 left-2 z-[1000]">
        <Button className="bg-[#fed619] text-[#012044]">
          <MapPin className="mr-2" /> Карта заведений
        </Button>
      </div>
      <div className="absolute top-2 right-2 z-[1000]">
        <Button className="bg-[#012044] text-white">
          <User className="mr-2" /> Профиль
        </Button>
      </div>

      <div id="map" className="w-full h-full z-0"></div>

      {selectedPlace && (
        <div className="absolute bottom-0 w-full bg-white text-[#012044] p-4 rounded-t-2xl shadow-xl z-[1000]">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">{selectedPlace.name}</h2>
            <button onClick={closeCard} className="text-xl font-bold">×</button>
          </div>
          <p className="text-sm">{selectedPlace.hours}</p>
          <div className="mt-2">
            <p className="font-semibold">{selectedPlace.offer}</p>
            <p className="text-sm">Количество: {selectedPlace.quantity}</p>
            <p className="text-sm">Цена: {selectedPlace.price}₽</p>
          </div>
          <Button className="w-full mt-4 bg-[#fed619] hover:bg-[#012044] hover:text-white">
            Заказать
          </Button>
        </div>
      )}
    </div>
  );
}
