import type { Config } from "tailwindcss";
import houseStyle from "./src/tokens/tailwind.preset";

// House-style preset plus the ice redesign palette (navy, frost, cyan).
export default {
  presets: [houseStyle],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e7f6fb",
          100: "#d6f4ff",
          200: "#a8ecf6",
          300: "#8aedf8",
          400: "#7eebf8",
          500: "#5fe3f5",
          600: "#2ec8df",
          700: "#0a4e66",
          800: "#0c1e38",
          900: "#0b2240",
          950: "#071426",
        },
        frost: "#d6f4ff",
        night: "#071426",
      },
      backgroundImage: {
        "cool-fade": "linear-gradient(180deg,#f6f9fc 0%,#eaf1f8 100%)",
      },
    },
  },
} satisfies Config;
