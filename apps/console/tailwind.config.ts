import type { Config } from "tailwindcss";
import preset from "@maple-print-lab/ui/tailwind-preset";

const config: Config = {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx}"],
};

export default config;
