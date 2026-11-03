import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#c2185b",
          dark: "#9c0f47",
          deep: "#7a0a37",
          light: "#fce4ec",
          soft: "#f8d4e3",
        },
        gold: "#f5c518",
      },
      fontFamily: {
        bangla: ["var(--font-hind)", "sans-serif"],
        display: ["var(--font-baloo)", "var(--font-hind)", "sans-serif"],
      },
      boxShadow: {
        card: "0 6px 24px -8px rgba(194, 24, 91, 0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
