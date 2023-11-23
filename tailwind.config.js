/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'myYellow':'#FFDE8A',
      'fontyellow':'#8E6806',
      ...colors
    }
  },
  plugins: [],
   safelist: [{
            pattern: /(bg|text|border)-(myyellow)/
        }]
}

