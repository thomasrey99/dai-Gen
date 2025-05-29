import { heroui } from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      backgroundImage: {
        'dark-gradient': "linear-gradient(135deg, #0b1120, #141c2f, #1e293b, #0b1120)",
      },
    },
  },
  darkMode: false, // ya que no estás usando dark/light mode
  plugins: [heroui({
    themes: {
      mytheme: {
        colors: {
          background: "#000000", // fondo base
          foreground: "#fe89e3",
          primary: {
            DEFAULT: "#BEF264",
            foreground: "#000000",
          },
          focus: "#BEF264",
        },
      },
    },
  })],
}

module.exports = config;
