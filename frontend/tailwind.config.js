/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          800: '#1e40af', // Example dark blue shade
        },
        dark: {
          800: '#121212', // Example dark shade
        },
      },
    },
  },
  plugins: [],
};
