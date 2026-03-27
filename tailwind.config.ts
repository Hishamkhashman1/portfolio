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
        night: "#0b0d10",
        haze: "#141922",
        electric: "#8a9caf",
        ember: "#c5a36b",
        amber: {
          200: "#9aa7b6",
          300: "#8796a8"
        }
      },
      boxShadow: {
        glow: "0 0 30px rgba(138, 156, 175, 0.18)",
        glowStrong: "0 0 50px rgba(138, 156, 175, 0.28)"
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 20% 10%, rgba(138, 156, 175, 0.12), transparent 55%), radial-gradient(circle at 80% 20%, rgba(138, 156, 175, 0.06), transparent 60%)"
      },
      backgroundSize: {
        grid: "100% 100%, 100% 100%"
      }
    }
  },
  plugins: []
};

export default config;
