"use client";

import { motion } from "framer-motion";
import { categories, type Category } from "@/lib/categories";

interface CategoryPickerProps {
  onSelect: (category: Category) => void;
  onBack: () => void;
}

export default function CategoryPicker({
  onSelect,
  onBack,
}: CategoryPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center w-full h-screen h-[100dvh] p-4"
    >
      {/* Header */}
      <div className="flex items-center w-full max-w-2xl mb-4">
        <motion.button
          onClick={onBack}
          className="btn-bounce text-3xl p-2"
          whileTap={{ scale: 0.9 }}
        >
          ⬅️
        </motion.button>
        <h2 className="text-3xl font-bold text-ocean text-center flex-1 mr-10">
          Pick a Story!
        </h2>
      </div>

      {/* Category Grid */}
      <div className="flex-1 overflow-y-auto story-scroll w-full max-w-2xl pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => onSelect(category)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.92 }}
              className="btn-bounce flex flex-col items-center justify-center p-4 sm:p-5 rounded-3xl shadow-lg active:shadow-md transition-shadow aspect-square"
              style={{ backgroundColor: category.bgColor }}
            >
              <span className="text-5xl sm:text-6xl mb-2">
                {category.emoji}
              </span>
              <span
                className="text-lg sm:text-xl font-bold"
                style={{ color: category.color }}
              >
                {category.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
