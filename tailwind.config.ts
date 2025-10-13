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
        background: "#242424",
        primary: "#00FF00",
        secondary: "#FF6B9D",
        tertiary: "#9B87F5",
      },
    },
  },
  plugins: [],
};
export default config;

