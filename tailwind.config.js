/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        naruto: {
          bg: "#FFFBEB",
          primary: "#F97316",
          accent: "#FBBF24",
          text: "#1F2937",
        },
        sasuke: {
          bg: "#0F172A",
          primary: "#8B5CF6",
          accent: "#4C1D95",
          text: "#F1F5F9",
        },
      },
      animation: {
        'chakra-flow': 'flow 10s linear infinite',
        'yin-yang-spin': 'spin 20s linear infinite',
      },
      keyframes: {
        flow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
