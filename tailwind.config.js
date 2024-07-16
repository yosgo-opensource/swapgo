module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'media', //  or 'class'
  theme: {
    extend: {
      fontFamily: {
        playwrite: ['var(--font-playwrite-hr)', 'cursive'],
      },
      fontWeight: {
        hairline: '100',
        thin: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
