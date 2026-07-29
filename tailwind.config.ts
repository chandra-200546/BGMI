export default {
  content: ["./src/**/*.{ts,tsx}", "./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        battle: "#0a0a0f",
        neonOrange: "#ff6b00",
        toxicGreen: "#39ff14",
        hudBlack: "#111017",
      },
      fontFamily: {
        display: ["Teko", "Rajdhani", "ui-sans-serif", "system-ui"],
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        orangeGlow: "0 0 34px rgba(255, 107, 0, 0.42)",
        greenGlow: "0 0 24px rgba(57, 255, 20, 0.34)",
      },
      keyframes: {
        hudSweep: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.65", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.35)" },
        },
      },
      animation: {
        hudSweep: "hudSweep 5s ease-in-out infinite",
        pulseGlow: "pulseGlow 2.2s ease-in-out infinite",
      },
    },
  },
};
