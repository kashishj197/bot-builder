import { type Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // ✅ important for toggling with `.dark`
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
