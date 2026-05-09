import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        raios: {
          dark: "#0a0a0f",
          card: "#12121a",
          border: "#1e1e2e",
          accent: "#22c55e",
          "accent-dim": "#16a34a",
          muted: "#71717a",
          surface: "#18181f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
