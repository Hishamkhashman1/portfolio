import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-grotesk)", "ui-sans-serif", "system-ui"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"]
      },
      colors: {
        night: "#0a0b0f",
        haze: "#11151d",
        electric: "#39f5c8",
        ember: "#fcbf49"
      },
      boxShadow: {
        glow: "0 0 30px rgba(57, 245, 200, 0.25)",
        glowStrong: "0 0 50px rgba(57, 245, 200, 0.45)"
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at top, rgba(57, 245, 200, 0.18), transparent 55%), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)"
      },
      backgroundSize: {
        grid: "100% 100%, 48px 48px, 48px 48px"
      }
    }
  },
  plugins: []
};

export default config;
