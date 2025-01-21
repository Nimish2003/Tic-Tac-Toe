/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'page-1': "url('./assets/images/page_1.png')",
      }
    },
  },
  plugins: [],
}

