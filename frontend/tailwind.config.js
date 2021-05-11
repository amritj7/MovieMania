module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      textColor: "#F5F3F4",
      red: "#BA181B",
      black: "#0B090A",
      grey: "#161A1D",
      golden: "#ffea00",
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
