"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#012044]">Мой профиль</h1>
        <Button 
          onClick={() => router.back()}
          variant="ghost"
          className="text-xl"
        >
          ×
        </Button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#356ac9] flex items-center justify-center text-white text-2xl font-bold">
            ИИ
          </div>
          <div>
            <h2 className="font-bold text-lg">Илья Кругляк</h2>
            <p className="text-gray-500">+7 (123) 456-78-90</p>
          </div>
        </div>

        <div className="space-y-4">
          <Button className="w-full justify-start" variant="ghost">
            Мои заказы
          </Button>
          <Button className="w-full justify-start" variant="ghost">
            Избранное
          </Button>
          <Button className="w-full justify-start" variant="ghost">
            Настройки
          </Button>
          <Button className="w-full justify-start text-red-500" variant="ghost">
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
}