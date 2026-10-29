/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { ink: "#171717", cream: "#e5e3d4", lime: "#c5e86c" },
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"], display: ["Space Grotesk", "sans-serif"] },
    },
  },
  plugins: [],
};
