"use client";

import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-8 p-8 text-center w-full max-w-lg"
    >
      {/* Floating stars decoration */}
      <div className="relative">
        <motion.span
          className="absolute -top-8 -left-8 text-4xl"
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ⭐
        </motion.span>
        <motion.span
          className="absolute -top-4 -right-6 text-3xl"
          animate={{ y: [0, -8, 0], rotate: [0, -15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        >
          🌟
        </motion.span>
        <motion.span
          className="absolute -bottom-6 left-0 text-3xl"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        >
          ✨
        </motion.span>

        <motion.div
          className="text-8xl mb-2"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          📖
        </motion.div>
      </div>

      <div>
        <h1 className="text-5xl font-bold text-ocean drop-shadow-lg mb-2">
          James&apos;s
        </h1>
        <h2 className="text-4xl font-bold text-candy drop-shadow-md">
          Storybook
        </h2>
      </div>

      <motion.p
        className="text-xl text-ocean/70 font-semibold"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Magical stories just for you!
      </motion.p>

      <motion.button
        onClick={onStart}
        className="btn-bounce bg-gradient-to-r from-candy to-sunset text-white text-3xl font-bold py-6 px-12 rounded-full shadow-xl active:shadow-md transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Let&apos;s Read! 📚
      </motion.button>

      <motion.div
        className="flex gap-3 text-3xl"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <span>🦕</span>
        <span>🚀</span>
        <span>🐶</span>
        <span>🚗</span>
        <span>🏰</span>
      </motion.div>
    </motion.div>
  );
}
