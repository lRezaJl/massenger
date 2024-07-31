/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      purple: {
        50: "#faf5ff",
        100: "#d7c4f7",
        200: "#bd9cf2",
        300: "#a274ec",
        400: "#874de7",
        500: "#7a39e4",
        600: "#6e33cd",
        700: "#5528a0",
        800: "#3d1d72",
        900: "#251144",
        950: "#0c0617",
      },
      primaryPurpol: "#7a39e4",
      secondaryColor: "#622eb6",
      textColor: "#2c0f5a ",
      secondaryTextColor: "#fafdf6 ",
      hoverColor: "#7536da",
      sbgColor: "#ffffffbe",
    },
    extend: {
      fontFamily: {
        myfont: ["IRANSansWeb(FaNum)-Pack", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
};
