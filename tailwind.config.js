module.exports = {
  purge: ["./components/**/*.js", "./pages/**/*.js"],
  theme: {
    colors: {
      primary: "#202225",
      secondary: "#4939ff",
      white: "#FFFFFF",
      green: "#00FFAD",
      red: "#e53e3e"
    },
    fontFamily: {
      sans: [
        "Chivo",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Open Sans",
        "Helvetica Neue",
        "sans-serif",
      ],
    },
    fontWeight: {
      normal: 400,
      bold: 700,
    },
    extend: {
      zIndex: {
        "-1": -1,
        1: 1,
        2: 2,
        3: 3,
        4: 4,
      },
    },
  },
  variants: {},
  plugins: [],
  corePlugins: {
    float: false,
    container: false,
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
};
