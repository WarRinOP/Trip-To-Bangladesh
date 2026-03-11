import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0a0f1a",
          primary: "#0a0f1a",
          secondary: "#121b2d",
        },
        primary: "#0a0f1a",
        secondary: "#121b2d",
        accent: {
          gold: "#c9a84c",
        },
        text: {
          DEFAULT: "#f5f0e8",
          muted: "#a89f8c",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
