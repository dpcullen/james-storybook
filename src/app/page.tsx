"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import WelcomeScreen from "@/components/WelcomeScreen";
import CategoryPicker from "@/components/CategoryPicker";
import StorySettings from "@/components/StorySettings";
import StoryViewer from "@/components/StoryViewer";
import type { Category } from "@/lib/categories";
import type { StoryLength, TimeOfDay } from "@/lib/storyPrompts";

type Screen = "welcome" | "categories" | "settings" | "story";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [storyLength, setStoryLength] = useState<StoryLength>("short");
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");

  const handleCategorySelect = useCallback((category: Category) => {
    setSelectedCategory(category);
    setScreen("settings");
  }, []);

  const handleSettingsConfirm = useCallback(
    (length: StoryLength, time: TimeOfDay) => {
      setStoryLength(length);
      setTimeOfDay(time);
      setScreen("story");
    },
    []
  );

  const handleBack = useCallback(() => {
    setScreen((prev) => {
      if (prev === "story") return "settings";
      if (prev === "settings") return "categories";
      if (prev === "categories") return "welcome";
      return "welcome";
    });
  }, []);

  const handleHome = useCallback(() => {
    setScreen("welcome");
    setSelectedCategory(null);
  }, []);

  const handleNewStory = useCallback(() => {
    // Go back to categories to pick a new story
    setScreen("categories");
  }, []);

  const isNight = timeOfDay === "night" || (screen === "settings" && false);
  const bgClass =
    screen === "story" && timeOfDay === "night"
      ? "bg-night"
      : screen === "story"
        ? "bg-gradient-to-b from-sky via-blue-200 to-sky"
        : "bg-gradient-to-b from-sky via-blue-100 to-sky";

  return (
    <main
      className={`${bgClass} min-h-screen min-h-[100dvh] flex flex-col items-center justify-center transition-colors duration-1000 safe-top safe-bottom`}
    >
      <AnimatePresence mode="wait">
        {screen === "welcome" && (
          <WelcomeScreen
            key="welcome"
            onStart={() => setScreen("categories")}
          />
        )}
        {screen === "categories" && (
          <CategoryPicker
            key="categories"
            onSelect={handleCategorySelect}
            onBack={handleBack}
          />
        )}
        {screen === "settings" && selectedCategory && (
          <StorySettings
            key="settings"
            category={selectedCategory}
            onConfirm={handleSettingsConfirm}
            onBack={handleBack}
          />
        )}
        {screen === "story" && selectedCategory && (
          <StoryViewer
            key="story"
            category={selectedCategory}
            length={storyLength}
            timeOfDay={timeOfDay}
            onHome={handleHome}
            onNewStory={handleNewStory}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
