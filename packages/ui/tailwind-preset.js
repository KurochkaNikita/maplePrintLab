import plugin from "tailwindcss/plugin";

/**
 * Brand design tokens and base styles shared by the public site and the admin.
 * Each app adds its own `content` globs, fonts (CSS variables) and page-specific CSS.
 *
 * @type {import("tailwindcss").Config}
 */
export default {
  theme: {
    extend: {
      colors: {
        charcoal: "#14213D",
        filament: "#F6F7FB",
        amber: {
          DEFAULT: "#EA580C",
          deep: "#C2410C",
        },
        teal: "#4338CA",
        ink: "#2F3A55",
        line: "#E2E5EE",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
        accent: ["var(--font-display)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    plugin(({ addBase, addComponents }) => {
      addBase({
        ":root": { colorScheme: "light" },
        html: { scrollBehavior: "smooth" },
        body: { "@apply bg-filament text-ink font-body antialiased": {} },
        "h1, h2, h3": { "@apply font-display text-charcoal": {} },
        "::selection": { backgroundColor: "#c2410c", color: "#f6f7fb" },
        // Visible keyboard focus.
        ":focus-visible": {
          outline: "2px solid #4338ca",
          outlineOffset: "3px",
          borderRadius: "2px",
        },
      });
      addComponents({
        // "Build plate": faint printer-bed grid used behind hero areas.
        ".build-plate": {
          backgroundImage:
            "linear-gradient(to right, rgb(20 33 61 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(20 33 61 / 0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "linear-gradient(to bottom, #000 55%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 55%, transparent)",
        },
        // Thin striped bar echoing printed layers.
        ".layer-bar": {
          height: "6px",
          background:
            "repeating-linear-gradient(90deg, #c2410c 0 24px, #4338ca 24px 48px, #ea580c 48px 72px, #14213d 72px 96px)",
        },
      });
    }),
  ],
};
