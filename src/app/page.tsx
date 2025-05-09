/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, User } from "lucide-react";
import Image from "next/image";

const stories = [
  "/story1.jpg",
  "/story2.jpg",
  "/story3.jpg",
  "/story4.jpg",
  "/story5.jpg"
];

export default function FlipApp() {
  const [step, setStep] = useState(0);
  const [page, setPage] = useState("story");

  const nextStory = () => {
    if (step < stories.length - 1) {
      setStep(step + 1);
    } else {
      setPage("map");
    }
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
          <Button className="mt-4 bg-[#fed619] text-[#012044]" onClick={() => setPage("map")}>Перейти к карте</Button>
        )}
      </div>
    );
  }

  if (page === "map") {
    return (
      <div className="relative w-full h-screen">
        {/* Карта (в будущем сюда интегрируется кастомная карта) */}
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
        <iframe
          src="https://www.openstreetmap.org/export/embed.html"
          className="w-full h-full border-none"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  return null;
}
