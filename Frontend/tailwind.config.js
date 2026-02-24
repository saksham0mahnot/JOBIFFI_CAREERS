/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            DEFAULT: '#193CB8', // Vibrant Secondary Blue
            deep: '#1C398E',    // Primary Deep Blue
            muted: '#364153',   // Muted Text/Navigation Blue
          },
          bg: {
            DEFAULT: '#F1F5F9', // Main Page Background
          }
        }
      }
    },
  },
  plugins: [],
}
