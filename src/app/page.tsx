"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, User } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Динамический импорт компонента карты (без SSR)
const MapComponent = dynamic(() => import('@/components/ui/MapComponent'), {
  ssr: false,
  loading: () => <div className="h-full bg-gray-100 flex items-center justify-center">Загрузка карты...</div>
});

// Массив путей к изображениям историй
const stories = [
  "/story1.jpg",
  "/story2.jpg",
  "/story3.jpg",
  "/story4.jpg",
  "/story5.jpg"
];

// Тип данных о заведении
type PlaceInfo = {
  name: string;
  hours: string;
  offer: string;
  quantity: number;
  price: number;
};

export default function FlipApp() {
  // Состояние для отображения splash-экрана
  const [showSplash, setShowSplash] = useState(true);
  // Текущий шаг в историях
  const [step, setStep] = useState(0);
  // Текущая страница (истории/карта)
  const [page, setPage] = useState<'story' | 'map'>('story');
  // Флаг просмотра историй
  const [hasViewedStories, setHasViewedStories] = useState(false);
  // Данные выбранного заведения
  const [selectedPlace, setSelectedPlace] = useState<PlaceInfo | null>(null);

  // Эффект для скрытия splash-экрана через 3 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Проверка localStorage при загрузке
  useEffect(() => {
    const viewed = localStorage.getItem('hasViewedStories');
    if (viewed === 'true') {
      setHasViewedStories(true);
      setPage('map');
    }
  }, []);

  // Обработчик перехода к следующей истории
  const nextStory = () => {
    if (step < stories.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('hasViewedStories', 'true');
      setHasViewedStories(true);
      setPage("map");
    }
  };

  // Закрытие карточки заведения
  const closeCard = () => {
    setSelectedPlace(null);
  };

  // Обработчик выбора заведения (передаётся в MapComponent)
  const handlePlaceSelect = (place: PlaceInfo) => {
    setSelectedPlace(place);
  };

  // Отображение splash-экрана
if (showSplash) {
  return (
    <div className="flex items-center justify-center h-screen bg-[#012044]">
      <Image
        src="/splash.jpg"
        alt="Splash Screen"
        layout="fill" // Это ключевое изменение
        objectFit="cover" // Это обеспечит покрытие всего пространства
        className="rounded-xl"
        priority
      />
    </div>
  );
}

  // Отображение историй
  if (!hasViewedStories && page === "story") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#012044] text-white" onClick={nextStory}>
        <Image
          src={stories[step]}
          alt={`Story ${step + 1}`}
          layout="fill" // Это ключевое изменение
          objectFit="cover" // Это обеспечит покрытие всего пространства
          className="rounded-xl"
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

  // Основной интерфейс с картой
  return (
    <div className="relative w-full h-screen">
      {/* Кнопка "Показать списком" */}
      <div className="absolute top-2 left-2 z-[1000]">
        <Button className="bg-[#fed619] text-[#012044]">
          <MapPin className="mr-2" /> Показать списком
        </Button>
      </div>

      {/* Кнопка профиля */}
      <div className="absolute top-2 right-2 z-[1000]">
        <Button className="bg-[#012044] text-white">
          <User className="mr-2" /> Профиль
        </Button>
      </div>

      {/* Компонент карты с передачей обработчика выбора */}
      <MapComponent onPlaceSelect={handlePlaceSelect} />

      {/* Карточка выбранного заведения */}
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