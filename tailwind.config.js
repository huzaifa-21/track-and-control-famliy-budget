/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "black-color": "#191919",
        primary: "#299d91",
        secondary: "#525256",
        background: "#F4F5F7",
        green: "#4DAF6E",
        red: "#E73D1C",
        header: "#878787",
        gray: {
          100: "#f3f3f3",
          200: "#e8e8e8",
          300: "#d1d1d1",
          400: "#9f9f9f",
          600: "#666666",
        },
      },
      boxShadow: {
        main: "0 0 25px 25px #4c676421",
      },
    },
  },
  plugins: [],
};
