import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // CSS variable (app/globals.css) — ek ek landing page nijer theme dite pare (.theme-gluta)
        brand: {
          DEFAULT: "rgb(var(--brand) / <alpha-value>)",
          dark: "rgb(var(--brand-dark) / <alpha-value>)",
          deep: "rgb(var(--brand-deep) / <alpha-value>)",
          light: "#fce4ec",
          soft: "#f8d4e3",
        },
        gold: "#f5c518",
        // Order form er halka rong (homepage e pink, Double Gluta te lavender)
        tint: {
          50: "rgb(var(--tint-50) / <alpha-value>)",
          100: "rgb(var(--tint-100) / <alpha-value>)",
          200: "rgb(var(--tint-200) / <alpha-value>)",
          300: "rgb(var(--tint-300) / <alpha-value>)",
        },
      },
      fontFamily: {
        bangla: ["var(--font-hind)", "sans-serif"],
        display: ["var(--font-baloo)", "var(--font-hind)", "sans-serif"],
      },
      boxShadow: {
        card: "0 6px 24px -8px rgb(var(--brand) / 0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
