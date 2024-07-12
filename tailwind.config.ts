import type { Config } from "tailwindcss";

/** @type {import('tailwindcss').Config} */

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        nunito: [
          "NunitoSans-Regular",
          "NunitoSans-Light",
          "NunitoSans-ExtraBold",
          "NunitoSans-Bold",
          "NunitoSans-SemiBold",
        ],
        lato: [
          "Lato-Black",
          "Lato-Bold",
          "Lato-Regular",
        ],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
