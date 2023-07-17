import { fontFamily as defaultFontFamily } from "tailwindcss/defaultTheme";
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
    "./node_modules/react-tailwindcss-select/dist/index.esm.js",
  ],
  safelist: ["ml-0", "ml-2", "ml-4", "ml-6"],
  theme: {
    extend: {
      colors: {},
      gridTemplateColumns: {
        "app-layout": "2fr 1fr",
        "list-item-layout": "1fr 3fr",
        "preference-item-layout": "2fr 7fr",
      },
    },
    fontFamily: {
      serif: ["Labrada Variable", ...defaultFontFamily.serif],
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["lofi", "black"],
  },
};
