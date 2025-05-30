/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#60a5fa", // Tailwind blue-400
          DEFAULT: "#3b82f6", // Tailwind blue-500
          dark: "#1e40af", // Tailwind indigo-900
        },
        secondary: {
          light: "#fbbf24", // Tailwind amber-400
          DEFAULT: "#f59e0b", // Tailwind amber-500
          dark: "#b45309", // Tailwind amber-700
        },
        background: {
          light: "#ffffff", // White
          dark: "#0f172a", // Slate-900
        },
        text: {
          light: "#111827", // Gray-900
          dark: "#f1f5f9", // Slate-100
        },
        accent: {
          light: "#6ee7b7", // Emerald-300
          DEFAULT: "#10b981", // Emerald-500
          dark: "#064e3b", // Emerald-900
        },
      },
    },
  },
  plugins: [],
};
