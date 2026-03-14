/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary:"#522959",
        secondary:"#2A114B",
        accent:"#824D69",
        light:"#DFB6B2",
        cream:"#FAE5D8",
        dark:"#180018"
      }
    }
  },
  plugins: [],
}