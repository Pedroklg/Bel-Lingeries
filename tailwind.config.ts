import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        belDarkBeige: '#f1b28e',
        belLightBeige: '#f9e0c1',
        belPink: '#f29796',
        belBlue: '#aad4d4',
        belDarkCyan: '#445c64',
        belOrange: '#c85d41',
        belWhite: '#f9f9f9',
      },
    },
  },
  plugins: [],
};

export default config;
