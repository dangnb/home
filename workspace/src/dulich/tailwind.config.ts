import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#B48B50",
          dark: "#8D6637",
          light: "#E5D4B2",
          gold: "#B48B50",
        },
        sand: {
          50: "#FAF8F2",
          100: "#F3F0E8",
          200: "#E7E2D7",
          300: "#D8D1C3",
        },
        nature: {
          deep: "#163A30",
          moss: "#356052",
          forest: "#102E26",
          lime: "#cfdf82",
        },
        ink: {
          DEFAULT: "#18231E",
          muted: "#5F685F",
          light: "#879087",
        },
        surface: {
          DEFAULT: "#F3F0E8",
          card: "#FFFDF8",
          muted: "#E7E2D7",
          dark: "#163A30",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-ui)", "Montserrat", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "Be Vietnam Pro", "system-ui", "sans-serif"],
      },
      boxShadow: {
        whisper: "0 10px 30px rgba(0, 0, 0, 0.03)",
        card: "0 14px 40px rgba(0, 0, 0, 0.06)",
        gold: "0 4px 20px rgba(194, 169, 121, 0.35)",
        "gold-lg": "0 8px 30px rgba(194, 169, 121, 0.45)",
      },
      borderRadius: {
        luxury: "20px 4px",
      },
    },
  },
  plugins: [forms],
};

export default config;
