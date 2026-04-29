/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Oxanium", "cursive"],
        technical: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
