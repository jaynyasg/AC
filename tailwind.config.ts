import type { Config } from "tailwindcss";
import houseStyle from "./src/tokens/tailwind.preset";

// House-style preset (neutrals, type, motion) + a cool-blue "brand" scale
// sampled from ac/background.png so the site is themed around it.
export default {
  presets: [houseStyle],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff5fb",
          100: "#dbe8f5",
          200: "#bcd4ec",
          300: "#93b9df",
          400: "#6498cf",
          500: "#427bbd", // primary cool blue
          600: "#33619e",
          700: "#2b4f80",
          800: "#27436a",
          900: "#243a59",
          950: "#18253b",
        },
        frost: "#cfe6f1", // pale icy highlight from the background
      },
      backgroundImage: {
        "cool-fade": "linear-gradient(180deg,#f6f9fc 0%,#eaf1f8 100%)",
      },
    },
  },
} satisfies Config;
