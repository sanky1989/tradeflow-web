/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dashboard Colors
        bg: "#0F1115",
        sidebar: "#16191F",
        card: "#1C2128",
        border: "#2D333B",
        accent: "#7C4DFF",
        "text-main": "#E6EDF3",
        "text-muted": "#8B949E",
        success: "#3FB950",
        warning: "#D29922",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}