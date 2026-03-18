/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind to scan all React components in the src folder
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // We can add custom brand colors here later if needed
      colors: {
        primary: '#0ea5e9', // Example: Sky Blue for the Pharmacy brand
      }
    },
  },
  plugins: [],
}