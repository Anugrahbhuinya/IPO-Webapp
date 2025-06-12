/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: "class", // Enable class-based dark mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all JS/JSX/TS/TSX files in src
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

