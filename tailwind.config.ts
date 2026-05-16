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
        night: "#0f1115",
        haze: "#f5f6f7",
        electric: "#3f4752",
        ember: "#6d7177",
        amber: {
          200: "#6d7177",
          300: "#525860"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(15, 17, 21, 0.06), 0 8px 24px rgba(15, 17, 21, 0.04)",
        glowStrong:
          "0 0 0 1px rgba(15, 17, 21, 0.08), 0 12px 40px rgba(15, 17, 21, 0.08)"
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 20% 10%, rgba(15, 17, 21, 0.06), transparent 55%), radial-gradient(circle at 80% 20%, rgba(15, 17, 21, 0.03), transparent 60%)"
      },
      backgroundSize: {
        grid: "100% 100%, 100% 100%"
      }
    }
  },
  plugins: []
};

export default config;
