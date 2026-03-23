"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import type { Category } from "@/lib/categories";
import type { StoryLength, TimeOfDay } from "@/lib/storyPrompts";
import { getStory } from "@/lib/storyEngine";
import { allStories } from "@/lib/stories";

interface StoryViewerProps {
  category: Category;
  length: StoryLength;
  timeOfDay: TimeOfDay;
  onHome: () => void;
  onNewStory: () => void;
}

export default function StoryViewer({
  category,
  length,
  timeOfDay,
  onHome,
  onNewStory,
}: StoryViewerProps) {
  const [story, setStory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const storyRef = useRef<HTMLDivElement>(null);

  const pickStory = useCallback(() => {
    setLoading(true);
    setStory("");
    // Small delay for a nice loading animation
    setTimeout(() => {
      const newStory = getStory(category.id, length, timeOfDay, allStories);
      setStory(newStory);
      setLoading(false);
    }, 800);
  }, [category, length, timeOfDay]);

  useEffect(() => {
    pickStory();
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, [pickStory]);

  // Browser speech narration
  const playBrowserNarration = useCallback(() => {
    if (!story) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(story);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a good English voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) =>
        v.name.includes("Samantha") ||
        v.name.includes("Daniel") ||
        v.name.includes("Google UK English Male") ||
        (v.lang.startsWith("en") && v.localService)
    );
    if (preferred) utterance.voice = preferred;

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  }, [story, isPlaying]);

  const handleStop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
  }, []);

  const handleAnotherStory = useCallback(() => {
    handleStop();
    pickStory();
    storyRef.current?.scrollTo(0, 0);
  }, [handleStop, pickStory]);

  const isNight = timeOfDay === "night";
  const textColor = isNight ? "text-blue-100" : "text-gray-800";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col w-full h-screen h-[100dvh] relative"
    >
      {/* Night mode stars */}
      {isNight && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="star absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                ["--duration" as string]: `${1.5 + Math.random() * 2}s`,
                ["--delay" as string]: `${Math.random() * 2}s`,
              }}
            />
          ))}
          <div className="absolute top-6 right-8 text-5xl opacity-80">🌙</div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-3 z-10">
        <motion.button
          onClick={onHome}
          className="btn-bounce text-2xl p-2"
          whileTap={{ scale: 0.9 }}
        >
          🏠
        </motion.button>
        <div className="flex items-center gap-2">
          <span className="text-3xl">{category.emoji}</span>
          <span
            className={`text-lg font-bold ${isNight ? "text-blue-200" : "text-ocean"}`}
          >
            {category.name}
          </span>
        </div>
        <div className="w-10" />
      </div>

      {/* Story Content */}
      <div ref={storyRef} className="flex-1 story-scroll px-6 sm:px-8 pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <motion.div
              className="text-6xl"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              {category.emoji}
            </motion.div>
            <p
              className={`text-2xl font-bold ${isNight ? "text-blue-200" : "text-ocean"}`}
            >
              Finding a story...
            </p>
            <div className="flex gap-2">
              <div
                className={`w-4 h-4 rounded-full dot-1 ${isNight ? "bg-blue-300" : "bg-ocean"}`}
              />
              <div
                className={`w-4 h-4 rounded-full dot-2 ${isNight ? "bg-blue-300" : "bg-ocean"}`}
              />
              <div
                className={`w-4 h-4 rounded-full dot-3 ${isNight ? "bg-blue-300" : "bg-ocean"}`}
              />
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl mx-auto"
          >
            <div className="story-text">
              {story.split("\n").map((paragraph, i) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                const isEnding =
                  trimmed === "The End." || trimmed === "The End";
                return (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`${textColor} text-xl sm:text-2xl leading-relaxed mb-4 ${
                      isEnding
                        ? "text-center text-2xl sm:text-3xl font-bold mt-8"
                        : ""
                    }`}
                  >
                    {trimmed}
                  </motion.p>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Controls */}
      {!loading && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className={`fixed bottom-0 left-0 right-0 ${
            isNight ? "bg-night-blue/95" : "bg-white/95"
          } backdrop-blur-sm border-t ${
            isNight ? "border-blue-800" : "border-blue-200"
          } safe-bottom`}
        >
          <div className="flex items-center justify-center gap-3 p-3 max-w-xl mx-auto">
            {/* Play/Pause */}
            <motion.button
              onClick={playBrowserNarration}
              whileTap={{ scale: 0.9 }}
              className={`btn-bounce text-3xl p-3 rounded-full shadow-lg ${
                isPlaying
                  ? "bg-sunset text-white"
                  : "bg-gradient-to-r from-green-400 to-green-500 text-white"
              }`}
            >
              {isPlaying ? "⏸️" : "▶️"}
            </motion.button>

            {/* Stop */}
            {isPlaying && (
              <motion.button
                onClick={handleStop}
                whileTap={{ scale: 0.9 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="btn-bounce text-3xl p-3 rounded-full bg-red-400 text-white shadow-lg"
              >
                ⏹️
              </motion.button>
            )}

            {/* Another Story (same category) */}
            <motion.button
              onClick={handleAnotherStory}
              whileTap={{ scale: 0.9 }}
              className={`btn-bounce text-lg font-bold py-3 px-5 rounded-full shadow-lg ${
                isNight ? "bg-indigo-700 text-white" : "bg-ocean text-white"
              }`}
            >
              🔄 Again!
            </motion.button>

            {/* New Category */}
            <motion.button
              onClick={() => {
                handleStop();
                onNewStory();
              }}
              whileTap={{ scale: 0.9 }}
              className={`btn-bounce text-lg font-bold py-3 px-5 rounded-full shadow-lg ${
                isNight ? "bg-purple-700 text-white" : "bg-candy text-white"
              }`}
            >
              📚 New
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
