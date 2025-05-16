"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

// Тип данных пользователя Telegram
type TelegramUser = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  is_premium?: boolean;
  language_code?: string;
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
  const [showProfile, setShowProfile] = useState(false);
  // Данные пользователя Telegram
  const [telegramUser, setTelegramUser] = useState<TelegramUser | null>(null);
  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(true);

  // Эффект для инициализации Telegram WebApp
  useEffect(() => {
    // Проверяем, что мы в Telegram WebApp
    const tg = window.Telegram?.WebApp;
    if (tg) {
      
      // Инициализируем WebApp
      tg.expand(); // Раскрываем на весь экран
      tg.enableClosingConfirmation(); // Включаем подтверждение закрытия
      
      // Получаем данные пользователя
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setTelegramUser({
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          photo_url: user.photo_url,
          is_premium: user.is_premium,
          language_code: user.language_code
        });
      }
      
      setIsLoading(false);
    } else {
      // Если не в Telegram, используем заглушку
      setTelegramUser({
        id: 123456789,
        first_name: "Илья",
        last_name: "Кругляк",
        username: "ilya_kruglyak",
        is_premium: false
      });
      setIsLoading(false);
    }
  }, []);

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

  // Отображение модального окна профиля
  const renderProfileModal = () => {
    if (isLoading) {
      return (
        <div className="fixed inset-0 bg-black/50 z-[1002] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <p>Загрузка данных...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/50 z-[1002] flex items-end">
        <div className="bg-white w-full rounded-t-2xl p-6 animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Профиль</h2>
            <button 
              onClick={() => setShowProfile(false)}
              className="text-3xl text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          {/* Блок с информацией о пользователе */}
          <div className="flex items-center gap-4 mb-8">
            {telegramUser?.photo_url ? (
              <Image
                src={telegramUser.photo_url}
                alt="Profile photo"
                width={80}
                height={80}
                className="rounded-full object-cover w-20 h-20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#356ac9] flex items-center justify-center text-white text-3xl font-bold">
                {telegramUser?.first_name?.[0]}
                {telegramUser?.last_name?.[0]}
              </div>
            )}
            
            <div>
              <h3 className="font-bold text-xl">
                {telegramUser?.first_name} {telegramUser?.last_name}
              </h3>
              {telegramUser?.username && (
                <p className="text-gray-500">@{telegramUser.username}</p>
              )}
              {telegramUser?.is_premium && (
                <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                  Telegram Premium
                </span>
              )}
            </div>
          </div>
          
          {/* Меню профиля */}
          <div className="space-y-4">
            <button className="w-full text-left py-4 border-b border-gray-100 flex items-center justify-between">
              <span>Мои заказы</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button className="w-full text-left py-4 border-b border-gray-100 flex items-center justify-between">
              <span>Избранное</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button className="w-full text-left py-4 border-b border-gray-100 flex items-center justify-between">
              <span>Настройки</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <button 
              className="w-full text-left py-4 text-red-500 font-medium"
              onClick={() => {
                if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                  window.Telegram.WebApp.close();
                }
              }}
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Отображение splash-экрана
  if (showSplash) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#012044]">
        <Image
          src="/splash.jpg"
          alt="Splash Screen"
          layout="fill"
          objectFit="cover"
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
          layout="fill"
          objectFit="cover"
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
      {/* Кнопки управления в правом верхнем углу */}
      <div className="absolute top-4 right-4 z-[1000] flex space-x-3">
        {/* Кнопка списка */}
        <button 
          className="w-10 h-10 rounded-full bg-[#356ac9]/120 backdrop-blur-sm flex items-center justify-center 
          hover:bg-[#012044] transition-all shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>

        {/* Кнопка профиля */}
        <button 
          onClick={() => setShowProfile(true)}
          className="w-10 h-10 rounded-full bg-[#356ac9]/120 backdrop-blur-sm flex items-center justify-center 
          hover:bg-[#012044] transition-all shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </button>
      </div>

      {/* Модальное окно профиля */}
      {showProfile && renderProfileModal()}

      {/* Компонент карты с передачей обработчика выбора */}
      <MapComponent onPlaceSelect={handlePlaceSelect} />

      {/* Карточка выбранного заведения */}
      {selectedPlace && (
        <div className="absolute bottom-0 w-full bg-white text-[#012044] p-4 rounded-t-2xl shadow-xl z-[1000] transition-opacity duration-300">
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