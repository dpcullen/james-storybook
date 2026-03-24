"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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

/**
 * Map of sound effects and animal sounds to speech-friendly versions.
 * ALL CAPS words get spelled out by the speech engine, so we convert them.
 * We also stretch/emphasize sounds to make them more expressive and fun.
 */
const soundEffectMap: Record<string, string> = {
  // Action sounds
  WHOOSH: "Woooosh!",
  WHOOOOSH: "Woooooosh!",
  WHOOOOOOSH: "Woooooooosh!",
  FWOOSH: "Fwoooosh!",
  SWOOSH: "Swooosh!",
  SWOOOSH: "Swoooosh!",
  WHOMP: "Whomp!",
  FWOMP: "Fwomp!",
  ZOOM: "Zooom!",
  ZOOOM: "Zoooom!",
  ZOOOOM: "Zooooom!",
  VROOM: "Vroooom!",
  WHOOOOOM: "Whoooom!",
  WHIRRRR: "Whirrrr!",
  WHEEE: "Wheeee!",
  WHEEEE: "Wheeeee!",
  WHEEEEE: "Wheeeeee!",
  WOOOAAAA: "Woooaaah!",

  // Impact sounds
  CRASH: "Crash!",
  BANG: "Bang!",
  BOOM: "Boom!",
  THUMP: "Thump!",
  BUMP: "Bump!",
  STOMP: "Stomp!",
  CLUNK: "Clunk!",
  POP: "Pop!",
  CRACK: "Crack!",
  SNAP: "Snap!",
  CREAK: "Creeeak!",
  CREEEAK: "Creeeeak!",
  CREEEEAK: "Creeeeeak!",
  CLAP: "Clap!",
  ZAP: "Zap!",

  // Water sounds
  SPLASH: "Splash!",
  SPLOSH: "Splosh!",
  SPLOOSH: "Splooosh!",
  SPLOOOOSH: "Sploooosh!",
  SPLISHY: "Splishy!",
  SWISH: "Swish!",
  BLUB: "Blub!",

  // Vehicle sounds
  BEEP: "Beep!",
  BEEEP: "Beeep!",
  BEEEEP: "Beeeep!",
  TOOT: "Toot!",
  TOOOT: "Toooot!",
  TOOOOT: "Tooooot!",
  TOOOOOOT: "Tooooooot!",
  TOOOOOOOT: "Toooooooot!",
  NEEENAW: "Nee-naw!",
  CHOO: "Choo!",
  CHUG: "Chug!",
  CHUGGA: "Chugga!",
  PUTT: "Putt!",
  VRRRRR: "Vrrrr!",

  // Animal sounds - stretched and expressive
  ROAR: "Roaaarr!",
  ROAAARRR: "Roaaaarrrr!",
  RAWR: "Rawrr!",
  ROOO: "Rooo!",
  MOO: "Mooo!",
  MOOOO: "Mooooo!",
  QUACK: "Quack!",
  WOOF: "Woof!",
  ARF: "Arf!",
  BAAAA: "Baaaa!",
  OINK: "Oink!",
  CLUCK: "Cluck!",
  SQUEAK: "Squeak!",
  SQUEEEAK: "Squeeeeak!",
  RIBBIT: "Ribbit!",
  MIAOW: "Miaow!",
  MIAOWWW: "Miaowww!",
  MRRROW: "Mrrow!",
  PEEP: "Peep!",
  CHEEP: "Cheep!",
  CHIRP: "Chirp!",
  HONK: "Honk!",
  HOOT: "Hoot!",
  HOOOO: "Hooo!",
  ACHOO: "Achoo!",
  PURR: "Purrrr!",
  PURRR: "Purrrrr!",
  PURRRR: "Purrrrrr!",
  HISS: "Hisss!",
  BUZZ: "Buzzz!",
  CRICK: "Crick!",
  CLICK: "Click!",

  // Human / reaction sounds
  HOORAY: "Hooray!",
  WOW: "Wow!",
  WHOA: "Whoa!",
  YUM: "Yum!",
  HAHAHA: "Ha ha ha!",
  MMMM: "Mmmmm!",

  // Action descriptors
  BOING: "Boing!",
  FLAP: "Flap!",
  FWUMP: "Fwump!",
  FLASH: "Flash!",
  DING: "Ding!",
  SCRAPE: "Scrape!",
  SCRATCH: "Scratch!",
  CRUNCH: "Crunch!",
  SLURP: "Slurp!",
  LICK: "Lick!",
  BOOP: "Boop!",
  POOF: "Poof!",
  FLURFF: "Flurff!",
  SQUISH: "Squish!",
  SPLAT: "Splat!",
  DUMP: "Dump!",
  SCOOP: "Scoop!",
  BOUNCE: "Bounce!",
  SWOOP: "Swoop!",
  SWOOOP: "Swooop!",

  // Misc
  PSSSSHHHH: "Psssshhh!",
  CHIT: "Chit!",
};

/** Prepare text for more expressive speech.
 *  - Converts ALL CAPS to title case so the voice doesn't spell them out
 *  - Replaces known sound effects with expressive, stretched versions
 *  - Uses commas/periods for natural breathing pauses */
function prepareForSpeech(text: string): string {
  let prepared = text;

  // Remove any existing ellipses so they aren't read as "dot dot dot"
  prepared = prepared.replace(/\.{2,}/g, ",");
  prepared = prepared.replace(/…/g, ",");

  // Replace known sound effects with expressive versions (before lowercasing)
  // Match ALL-CAPS words (2+ chars) and check the map
  prepared = prepared.replace(/\b([A-Z]{2,})\b/g, (match) => {
    // Check exact match in our sound map
    if (soundEffectMap[match]) {
      return soundEffectMap[match];
    }
    // For unknown ALL-CAPS words, convert to Title Case so they aren't spelled out
    return match.charAt(0) + match.slice(1).toLowerCase();
  });

  // Add a tiny pause before opening dialogue for dramatic effect
  prepared = prepared.replace(/\s+"([^"]+)"/g, ', "$1"');

  // Em-dashes become pauses
  prepared = prepared.replace(/\s*—\s*/g, ", ");
  prepared = prepared.replace(/\s*–\s*/g, ", ");

  // Clean up double commas or comma-period combos
  prepared = prepared.replace(/,\s*,/g, ",");
  prepared = prepared.replace(/,\s*\./g, ".");
  prepared = prepared.replace(/\.\s*,/g, ".");
  prepared = prepared.replace(/^\s*,\s*/, "");

  return prepared;
}

/** Pick the best available voice, preferring natural/premium ones */
function pickBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  // Priority list: premium/enhanced voices sound much more natural
  const preferenceOrder = [
    // iOS/macOS premium voices (very natural)
    (v: SpeechSynthesisVoice) =>
      v.name.includes("Premium") && v.lang.startsWith("en"),
    (v: SpeechSynthesisVoice) =>
      v.name.includes("Enhanced") && v.lang.startsWith("en"),
    // Specific high-quality voices
    (v: SpeechSynthesisVoice) => v.name.includes("Samantha"),
    (v: SpeechSynthesisVoice) => v.name.includes("Karen"),
    (v: SpeechSynthesisVoice) => v.name.includes("Moira"),
    (v: SpeechSynthesisVoice) => v.name.includes("Tessa"),
    (v: SpeechSynthesisVoice) => v.name.includes("Daniel"),
    // Google voices (Chrome)
    (v: SpeechSynthesisVoice) =>
      v.name.includes("Google UK English Female"),
    (v: SpeechSynthesisVoice) =>
      v.name.includes("Google US English"),
    // Microsoft voices (Edge/Windows)
    (v: SpeechSynthesisVoice) =>
      v.name.includes("Microsoft Aria") || v.name.includes("Microsoft Jenny"),
    (v: SpeechSynthesisVoice) =>
      v.name.includes("Microsoft") && v.lang.startsWith("en"),
    // Any English local voice
    (v: SpeechSynthesisVoice) =>
      v.lang.startsWith("en") && v.localService,
    // Any English voice at all
    (v: SpeechSynthesisVoice) => v.lang.startsWith("en"),
  ];

  for (const test of preferenceOrder) {
    const found = voices.find(test);
    if (found) return found;
  }
  return voices[0] || null;
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
  const [isPaused, setIsPaused] = useState(false);
  const [activeParagraph, setActiveParagraph] = useState<number>(-1);
  const [activeWordIndex, setActiveWordIndex] = useState<number>(-1);
  const [voiceReady, setVoiceReady] = useState(false);

  const storyRef = useRef<HTMLDivElement>(null);
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const playingRef = useRef(false);
  const cancelledRef = useRef(false);
  const wordTimerRef = useRef<number | null>(null);
  const pauseStartRef = useRef<number>(0);
  const elapsedBeforePauseRef = useRef<number>(0);
  const utteranceStartRef = useRef<number>(0);
  const estimatedDurationRef = useRef<number>(0);
  const totalWordsRef = useRef<number>(0);

  // Parse story into paragraphs (non-empty lines)
  const paragraphs = useMemo(() => {
    return story
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [story]);

  // Load voices (they load async on some browsers)
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) setVoiceReady(true);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const pickStory = useCallback(() => {
    setLoading(true);
    setStory("");
    setActiveParagraph(-1);
    setActiveWordIndex(-1);
    setTimeout(() => {
      const newStory = getStory(category.id, length, timeOfDay, allStories);
      setStory(newStory);
      setLoading(false);
    }, 800);
  }, [category, length, timeOfDay]);

  useEffect(() => {
    pickStory();
    return () => {
      cancelledRef.current = true;
      if (wordTimerRef.current) cancelAnimationFrame(wordTimerRef.current);
      window.speechSynthesis?.cancel();
    };
  }, [pickStory]);

  // Auto-scroll to active paragraph
  useEffect(() => {
    if (activeParagraph >= 0 && paragraphRefs.current[activeParagraph]) {
      const el = paragraphRefs.current[activeParagraph];
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeParagraph]);

  /** Time-based word tracker — works on all browsers including Safari/iPad.
   *  Estimates which word is being spoken based on elapsed time. */
  const startWordTimer = useCallback(
    (wordCount: number, estimatedMs: number) => {
      totalWordsRef.current = wordCount;
      estimatedDurationRef.current = estimatedMs;
      utteranceStartRef.current = performance.now();
      elapsedBeforePauseRef.current = 0;

      const tick = () => {
        if (cancelledRef.current) return;

        const elapsed =
          elapsedBeforePauseRef.current +
          (performance.now() - utteranceStartRef.current);
        const progress = Math.min(elapsed / estimatedMs, 1);
        const currentWord = Math.min(
          Math.floor(progress * wordCount),
          wordCount - 1
        );

        setActiveWordIndex(currentWord);

        if (progress < 1 && !cancelledRef.current) {
          wordTimerRef.current = requestAnimationFrame(tick);
        }
      };

      wordTimerRef.current = requestAnimationFrame(tick);
    },
    []
  );

  const stopWordTimer = useCallback(() => {
    if (wordTimerRef.current) {
      cancelAnimationFrame(wordTimerRef.current);
      wordTimerRef.current = null;
    }
    setActiveWordIndex(-1);
  }, []);

  /** Speak a single paragraph and return a promise that resolves when done */
  const speakParagraph = useCallback(
    (text: string, paragraphIndex: number): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (cancelledRef.current) {
          reject(new Error("cancelled"));
          return;
        }

        const prepared = prepareForSpeech(text);
        const utterance = new SpeechSynthesisUtterance(prepared);

        // Voice settings
        const voice = pickBestVoice();
        if (voice) utterance.voice = voice;

        // Determine paragraph type for speech tuning
        const isNightMode = timeOfDay === "night";
        const isEnding = text === "The End." || text === "The End";
        const isSoundEffect = /^[A-Z!.\s]+$/.test(text) && text.length < 40;

        // Vary rate and pitch for expressiveness
        let rate: number;
        if (isNightMode) {
          rate = 0.78;
          utterance.pitch = 0.95;
        } else if (isEnding) {
          rate = 0.7;
          utterance.pitch = 1.05;
        } else if (isSoundEffect) {
          rate = 0.75;
          utterance.pitch = 1.1;
        } else {
          rate = 0.82 + Math.random() * 0.06;
          utterance.pitch = 0.98 + Math.random() * 0.06;
        }
        utterance.rate = rate;
        utterance.volume = 1.0;

        // Track active paragraph
        setActiveParagraph(paragraphIndex);
        setActiveWordIndex(-1);

        // Estimate duration for time-based word tracking
        // Average ~160 words/min at rate 1.0, adjusted by actual rate
        const originalWords = text.split(/\s+/).filter((w) => w.length > 0);
        const preparedWords = prepared.split(/\s+/).filter((w) => w.length > 0);
        const wordsPerMinute = 155 * rate;
        const estimatedMs = (preparedWords.length / wordsPerMinute) * 60 * 1000;

        utterance.onstart = () => {
          startWordTimer(originalWords.length, estimatedMs);
        };

        utterance.onend = () => {
          stopWordTimer();
          // Flash all words as "read" briefly
          setActiveWordIndex(originalWords.length);
          resolve();
        };

        utterance.onerror = (e) => {
          stopWordTimer();
          if (e.error === "canceled" || e.error === "interrupted") {
            reject(new Error("cancelled"));
          } else {
            resolve();
          }
        };

        window.speechSynthesis.speak(utterance);
      });
    },
    [timeOfDay, startWordTimer, stopWordTimer]
  );

  /** Play the full story paragraph by paragraph with natural pauses */
  const playStory = useCallback(async () => {
    if (!story || paragraphs.length === 0) return;

    cancelledRef.current = false;
    playingRef.current = true;
    setIsPlaying(true);
    setIsPaused(false);

    const isNightMode = timeOfDay === "night";

    for (let i = 0; i < paragraphs.length; i++) {
      if (cancelledRef.current) break;

      try {
        await speakParagraph(paragraphs[i], i);
      } catch {
        break; // cancelled
      }

      if (cancelledRef.current) break;

      // Natural pause between paragraphs
      const isDialogue = paragraphs[i].includes('"');
      const isEndOfScene =
        paragraphs[i].endsWith(".") && !isDialogue;
      const pauseDuration = isNightMode
        ? 900
        : isEndOfScene
          ? 700
          : isDialogue
            ? 400
            : 550;

      await new Promise<void>((resolve) => {
        const timer = setTimeout(resolve, pauseDuration);
        // Allow cancellation during pause
        const checkCancel = setInterval(() => {
          if (cancelledRef.current) {
            clearTimeout(timer);
            clearInterval(checkCancel);
            resolve();
          }
        }, 50);
        setTimeout(() => clearInterval(checkCancel), pauseDuration + 100);
      });
    }

    playingRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    setActiveParagraph(-1);
    setActiveWordIndex(-1);
  }, [story, paragraphs, timeOfDay, speakParagraph]);

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      if (isPaused) {
        // Resume: restart the word timer from where we left off
        window.speechSynthesis.resume();
        utteranceStartRef.current = performance.now();
        startWordTimer(totalWordsRef.current, estimatedDurationRef.current - elapsedBeforePauseRef.current);
        setIsPaused(false);
      } else {
        // Pause: save elapsed time and stop the word timer
        window.speechSynthesis.pause();
        elapsedBeforePauseRef.current +=
          performance.now() - utteranceStartRef.current;
        if (wordTimerRef.current) cancelAnimationFrame(wordTimerRef.current);
        setIsPaused(true);
      }
    } else {
      playStory();
    }
  }, [isPlaying, isPaused, playStory, startWordTimer]);

  const handleStop = useCallback(() => {
    cancelledRef.current = true;
    stopWordTimer();
    window.speechSynthesis?.cancel();
    playingRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    setActiveParagraph(-1);
    setActiveWordIndex(-1);
  }, [stopWordTimer]);

  const handleAnotherStory = useCallback(() => {
    handleStop();
    pickStory();
    storyRef.current?.scrollTo(0, 0);
  }, [handleStop, pickStory]);

  const isNight = timeOfDay === "night";
  const textColor = isNight ? "text-blue-100" : "text-gray-800";
  const dimTextColor = isNight ? "text-blue-300/40" : "text-gray-800/30";
  const activeTextColor = isNight ? "text-white" : "text-gray-900";
  const unreadInActiveColor = isNight ? "text-blue-100/50" : "text-gray-800/40";

  /** Render a paragraph with word-level highlighting */
  const renderParagraph = useCallback(
    (text: string, paragraphIndex: number) => {
      const isActive = paragraphIndex === activeParagraph && isPlaying;
      const isEnding = text === "The End." || text === "The End";

      // When not playing, show all text normally
      if (!isPlaying || activeParagraph < 0) {
        return (
          <span className={isEnding ? "font-bold" : ""}>{text}</span>
        );
      }

      // Non-active paragraphs: just show text (parent <p> handles dimming)
      if (!isActive) {
        return <span className={isEnding ? "font-bold" : ""}>{text}</span>;
      }

      // Active paragraph: highlight each word as it's read
      const tokens = text.split(/(\s+)/); // Keep whitespace tokens
      let wordIndex = 0;

      return (
        <>
          {tokens.map((token, tokenIdx) => {
            // Whitespace tokens — just render as-is
            if (/^\s+$/.test(token)) {
              return <span key={tokenIdx}>{token}</span>;
            }

            const thisWordIndex = wordIndex;
            wordIndex++;

            const isCurrentWord = thisWordIndex === activeWordIndex;
            const isAlreadyRead = activeWordIndex >= 0 && thisWordIndex < activeWordIndex;
            const isUpcoming = activeWordIndex >= 0 && thisWordIndex > activeWordIndex;

            return (
              <span
                key={tokenIdx}
                className={
                  isCurrentWord
                    ? `highlight-word ${isNight ? "highlight-word-night" : "highlight-word-day"}`
                    : isAlreadyRead
                      ? activeTextColor
                      : isUpcoming
                        ? unreadInActiveColor
                        : ""
                }
              >
                {token}
              </span>
            );
          })}
        </>
      );
    },
    [activeParagraph, activeWordIndex, isPlaying, isNight, activeTextColor, unreadInActiveColor]
  );

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
          <div className="absolute top-6 right-8 text-5xl opacity-80">
            🌙
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between p-3 z-10">
        <motion.button
          onClick={() => {
            handleStop();
            onHome();
          }}
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
              {paragraphs.map((paragraph, i) => {
                const isEnding =
                  paragraph === "The End." || paragraph === "The End";
                const isActive = i === activeParagraph && isPlaying;
                const isRead =
                  isPlaying && activeParagraph >= 0 && i < activeParagraph;
                const isUnread =
                  isPlaying && activeParagraph >= 0 && i > activeParagraph;

                return (
                  <motion.p
                    key={i}
                    ref={(el) => {
                      paragraphRefs.current[i] = el;
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.08, 2) }}
                    className={`text-xl sm:text-2xl leading-relaxed mb-4 transition-all duration-300 ${
                      isEnding
                        ? "text-center text-2xl sm:text-3xl font-bold mt-8"
                        : ""
                    } ${
                      isActive
                        ? `${activeTextColor} font-medium scale-[1.01] origin-left`
                        : isRead
                          ? dimTextColor
                          : isUnread
                            ? `${textColor} opacity-60`
                            : textColor
                    }`}
                    style={{
                      // Subtle glow on active paragraph
                      textShadow: isActive
                        ? isNight
                          ? "0 0 20px rgba(147, 197, 253, 0.3)"
                          : "none"
                        : "none",
                    }}
                  >
                    {renderParagraph(paragraph, i)}
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
              onClick={handlePlayPause}
              whileTap={{ scale: 0.9 }}
              className={`btn-bounce text-3xl p-3 rounded-full shadow-lg ${
                isPlaying && !isPaused
                  ? "bg-sunset text-white"
                  : "bg-gradient-to-r from-green-400 to-green-500 text-white"
              }`}
            >
              {isPlaying && !isPaused ? "⏸️" : "▶️"}
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
