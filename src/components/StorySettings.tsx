"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Category } from "@/lib/categories";
import type { StoryLength, TimeOfDay } from "@/lib/storyPrompts";

interface StorySettingsProps {
  category: Category;
  onConfirm: (length: StoryLength, timeOfDay: TimeOfDay) => void;
  onBack: () => void;
}

const lengths: { value: StoryLength; label: string; time: string; emoji: string }[] = [
  { value: "short", label: "Short", time: "3 min", emoji: "📗" },
  { value: "medium", label: "Medium", time: "10 min", emoji: "📘" },
  { value: "long", label: "Long", time: "15 min", emoji: "📕" },
];

export default function StorySettings({
  category,
  onConfirm,
  onBack,
}: StorySettingsProps) {
  const [length, setLength] = useState<StoryLength>("short");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full h-screen h-[100dvh] p-4"
    >
      {/* Header */}
      <div className="flex items-center w-full max-w-lg mb-6">
        <motion.button
          onClick={onBack}
          className="btn-bounce text-3xl p-2"
          whileTap={{ scale: 0.9 }}
        >
          ⬅️
        </motion.button>
        <div className="text-center flex-1 mr-10">
          <span className="text-4xl">{category.emoji}</span>
          <h2 className="text-2xl font-bold text-ocean">
            {category.name} Story
          </h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full max-w-lg">
        {/* Story Length */}
        <div className="w-full">
          <h3 className="text-2xl font-bold text-ocean text-center mb-4">
            How long? ⏰
          </h3>
          <div className="flex gap-3 justify-center">
            {lengths.map((l) => (
              <motion.button
                key={l.value}
                onClick={() => setLength(l.value)}
                whileTap={{ scale: 0.92 }}
                className={`btn-bounce flex-1 flex flex-col items-center p-4 rounded-2xl shadow-lg transition-all ${
                  length === l.value
                    ? "bg-ocean text-white ring-4 ring-sunshine scale-105"
                    : "bg-white text-ocean"
                }`}
              >
                <span className="text-3xl mb-1">{l.emoji}</span>
                <span className="text-lg font-bold">{l.label}</span>
                <span className="text-sm opacity-75">{l.time}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Time of Day */}
        <div className="w-full">
          <h3 className="text-2xl font-bold text-ocean text-center mb-4">
            When is it? 🌤️
          </h3>
          <div className="flex gap-4 justify-center">
            <motion.button
              onClick={() => setTimeOfDay("day")}
              whileTap={{ scale: 0.92 }}
              className={`btn-bounce flex-1 flex flex-col items-center p-5 rounded-2xl shadow-lg transition-all ${
                timeOfDay === "day"
                  ? "bg-sunshine text-orange-800 ring-4 ring-ocean scale-105"
                  : "bg-white text-ocean"
              }`}
            >
              <span className="text-5xl mb-2">☀️</span>
              <span className="text-xl font-bold">Daytime</span>
              <span className="text-sm opacity-75">Adventure!</span>
            </motion.button>
            <motion.button
              onClick={() => setTimeOfDay("night")}
              whileTap={{ scale: 0.92 }}
              className={`btn-bounce flex-1 flex flex-col items-center p-5 rounded-2xl shadow-lg transition-all ${
                timeOfDay === "night"
                  ? "bg-indigo-900 text-white ring-4 ring-purple-400 scale-105"
                  : "bg-white text-ocean"
              }`}
            >
              <span className="text-5xl mb-2">🌙</span>
              <span className="text-xl font-bold">Bedtime</span>
              <span className="text-sm opacity-75">Sleepy time</span>
            </motion.button>
          </div>
        </div>

        {/* Start Button */}
        <motion.button
          onClick={() => onConfirm(length, timeOfDay)}
          className="btn-bounce bg-gradient-to-r from-candy to-sunset text-white text-2xl font-bold py-5 px-10 rounded-full shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Story! ✨
        </motion.button>
      </div>
    </motion.div>
  );
}
