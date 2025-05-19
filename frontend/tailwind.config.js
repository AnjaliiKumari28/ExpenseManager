/** @type {import('tailwindcss').Config} */

const flowbite = require("flowbite-react/tailwind");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          '50': '#f3f8ed',
          '100': '#e3eed9',
          '200': '#c8e0b6',
          '300': '#a6cb8b',
          '400': '#87b566',
          '500': '#6b9d4a',
          '600': '#507937',
          '700': '#3f5e2d',
          '800': '#354c28',
          '900': '#2f4225',
          '950': '#162310',
        },
      }
    },
  },
  plugins: [
    flowbite.plugin({ charts: true }),
  ]
}
