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
          DEFAULT: "#0f1a0f",
          primary: "#0f1a0f",
          secondary: "#1a2e1a",
        },
        primary: "#0f1a0f",
        secondary: "#1a2e1a",
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
