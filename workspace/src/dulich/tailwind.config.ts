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
          DEFAULT: "#C2A979",
          dark: "#A08040",
          light: "#E5D4B2",
          gold: "#D4AF37",
        },
        sand: {
          50: "#FAF8F5",
          100: "#F4F1EA",
          200: "#E9E5DB",
          300: "#DDD8CB",
        },
        nature: {
          deep: "#17372d",
          moss: "#254d3e",
          forest: "#202a25",
          lime: "#cfdf82",
        },
        ink: {
          DEFAULT: "#1a1c1c",
          muted: "#70746b",
          light: "#8a8f85",
        },
        surface: {
          DEFAULT: "#F4F1EA",
          card: "#FFFFFF",
          muted: "#EEEEEE",
          dark: "#17372d",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "Montserrat", "system-ui", "sans-serif"],
        body: ["var(--font-dm-sans)", "Montserrat", "system-ui", "sans-serif"],
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
