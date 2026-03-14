/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gaming: {
          bg: "#0a0e1a",
          panel: "#111827",
          surface: "#1a2035",
          border: "#2a3a5c",
          "dark-blue": "#0d1b2a",
          "mid-blue": "#1b2838",
          "light-blue": "#2a4a6b",
          "neon-blue": "#00d4ff",
          "neon-purple": "#b44aff",
          "neon-green": "#00ff87",
          "neon-red": "#ff4757",
          "neon-gold": "#ffd700",
          "neon-orange": "#ff6b35",
        },
      },
      fontFamily: {
        gaming: ['"Inter"', '"Segoe UI"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 10px rgba(0, 212, 255, 0.3), 0 0 20px rgba(0, 212, 255, 0.1)",
        "neon-purple":
          "0 0 10px rgba(180, 74, 255, 0.3), 0 0 20px rgba(180, 74, 255, 0.1)",
        "neon-green":
          "0 0 10px rgba(0, 255, 135, 0.3), 0 0 20px rgba(0, 255, 135, 0.1)",
      },
      animation: {
        "pulse-neon": "pulse-neon 2s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
      },
      keyframes: {
        "pulse-neon": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
