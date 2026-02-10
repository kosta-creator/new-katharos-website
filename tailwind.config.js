/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        midnight: '#050508',
        storm: '#1A1A2E',
        marble: '#E8E4DF',
        bone: '#C4BEB5',
        fire: '#E8913A',
        lightning: '#4DC9F6',
        gold: '#C9A84C',
      },
    },
  },
  plugins: [],
}
