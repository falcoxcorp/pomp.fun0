/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#C1A444',  // Custom gold color
      },
      textColor: {
        gold: '#C1A444',  // Custom gold color
      },
    },
  },
  plugins: [],
}

