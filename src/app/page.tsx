/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, User } from "lucide-react";
import Image from "next/image";

// Массив историй
const stories = [
  "/story1.jpg",
  "/story2.jpg",
  "/story3.jpg",
  "/story4.jpg",
  "/story5.jpg"
];

export default function FlipApp() {
  const [step, setStep] = useState<number>(0);
  const [page, setPage] = useState<'story' | 'map'>('story');

  const [selectedPlace, setSelectedPlace] = useState<null | {
    name: string;
    hours: string;
    offer: string;
    quantity: number;
    price: number;
  }>(null);

  const nextStory = () => {
    if (step < stories.length - 1) {
      setStep(step + 1);
    } else {
      setPage("map");
    }
  };

  const handleMarkerClick = () => {
    setSelectedPlace({
      name: "Vid Coffee",
      hours: "Ежедневно с 08:00 до 20:00",
      offer: "Миндальное печенье",
      quantity: 3,
      price: 120,
    });
  };

  const closeCard = () => {
    setSelectedPlace(null);
  };

  if (page === "story") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#012044] text-white" onClick={nextStory}>
        <Image
          src={stories[step]}
          alt={`story ${step + 1}`}
          width={320}
          height={560}
          className="rounded-2xl border-4 border-white shadow-xl"
        />
        {step === stories.length - 1 && (
          <Button className="mt-4 bg-[#fed619] text-[#012044]" onClick={() => setPage("map")}>
            Перейти к карте
          </Button>
        )}
      </div>
    );
  }

  if (page === "map") {
    return (
      <div className="relative w-full h-screen">
        {/* Верхние кнопки */}
        <div className="absolute top-2 left-2 z-10">
          <Button className="bg-[#fed619] text-[#012044]">
            <MapPin className="mr-2" /> Карта заведений
          </Button>
        </div>
        <div className="absolute top-2 right-2 z-10">
          <Button className="bg-[#012044] text-white">
            <User className="mr-2" /> Профиль
          </Button>
        </div>

        {/* Карта */}
        <iframe
          src="https://www.openstreetmap.org/export/embed.html"
          className="w-full h-full border-none"
          allowFullScreen
        ></iframe>

        {/* Маркер партнёра */}
        <div className="absolute left-[45%] top-[50%] z-10">
          <button
            onClick={handleMarkerClick}
            className="w-5 h-5 bg-red-600 rounded-full border-2 border-white shadow-lg"
            title="Vid Coffee"
          ></button>
        </div>

        {/* Карточка партнёра */}
        {selectedPlace && (
          <div className="absolute bottom-0 w-full bg-white text-[#012044] p-4 rounded-t-2xl shadow-xl z-20">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">{selectedPlace.name}</h2>
              <button onClick={closeCard} className="text-xl font-bold text-[#012044]">×</button>
            </div>
            <p className="text-sm">{selectedPlace.hours}</p>
            <div className="mt-2">
              <p className="font-semibold">{selectedPlace.offer}</p>
              <p className="text-sm">Количество: {selectedPlace.quantity}</p>
              <p className="text-sm">Цена: {selectedPlace.price}₽</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
