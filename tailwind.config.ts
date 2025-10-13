import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        dark: {
          primary: "#0d0d14",
          secondary: "#12121a",
          tertiary: "#1a1a27",
        },
        accent: {
          cyan: "#06b6d4",
          purple: "#a855f7",
          pink: "#ec4899",
          blue: "#3b82f6",
        },
        glow: {
          cyan: "rgba(6, 182, 212, 0.3)",
          purple: "rgba(168, 85, 247, 0.3)",
          pink: "rgba(236, 72, 153, 0.3)",
        }
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        glow: {
          '0%': {
            'box-shadow': '0 0 5px rgba(6, 182, 212, 0.2), 0 0 10px rgba(168, 85, 247, 0.1)',
          },
          '100%': {
            'box-shadow': '0 0 10px rgba(6, 182, 212, 0.3), 0 0 20px rgba(168, 85, 247, 0.2)',
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;

