import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fun: ['"Comic Neue"', "cursive", "sans-serif"],
      },
      colors: {
        sunshine: "#FFD700",
        sky: "#87CEEB",
        grass: "#90EE90",
        candy: "#FF69B4",
        sunset: "#FF6347",
        ocean: "#4169E1",
        night: "#1a1a2e",
        "night-blue": "#16213e",
      },
    },
  },
  plugins: [],
};
export default config;
