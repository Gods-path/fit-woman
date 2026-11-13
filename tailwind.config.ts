import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette terracotta / ocre / vert profond
        terracotta: {
          DEFAULT: "#C45A3B",
          light: "#E07856",
          dark: "#9E4228",
        },
        ocre: {
          DEFAULT: "#D89A3F",
          light: "#EAC078",
          dark: "#A9761F",
        },
        foret: {
          DEFAULT: "#2F5D4F",
          light: "#4A7D6C",
          dark: "#1E3F35",
        },
        sable: "#FBF4EA",
        creme: "#FFFCF7",
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
