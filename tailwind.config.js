/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin');

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a", "950": "#172554" }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(({ addUtilities }) => {
      addUtilities({
        /* Hide scrollbar for Chrome, Safari and Opera */
        ".no-scrollbar::-webkit-scrollbar": {
          'display': 'none'
        },
        /* Hide scrollbar for IE, Edge and Firefox */
        ".no-scrollbar": {
          "-ms-overflow-style": "none",  /* IE and Edge */
          "scrollbar-width": "none"  /* Firefox */
        }
      });
    })
  ],
}