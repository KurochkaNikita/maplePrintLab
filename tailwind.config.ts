import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        charcoal: "#22201D",
        filament: "#F7F0E1",
        amber: {
          DEFAULT: "#B9722E",
          deep: "#8F551F",
        },
        teal: "#2F6E64",
        ink: "#3A3F44",
        line: "#DDD6C9",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        accent: ["var(--font-accent)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
