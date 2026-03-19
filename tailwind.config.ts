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
        electric: "#4aa8ff",
        ember: "#fcbf49"
      },
      boxShadow: {
        glow: "0 0 30px rgba(74, 168, 255, 0.25)",
        glowStrong: "0 0 50px rgba(74, 168, 255, 0.45)"
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 20% 10%, rgba(74, 168, 255, 0.18), transparent 55%), radial-gradient(circle at 80% 20%, rgba(74, 168, 255, 0.08), transparent 60%)"
      },
      backgroundSize: {
        grid: "100% 100%, 100% 100%"
      }
    }
  },
  plugins: []
};

export default config;
