/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'ph': '300px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1720px',
    },
    colors: {
      purple: {
        50: "#faf5ff",
        100: "#f3e8ff",
        200: "#e9d5ff",
        300: "#d8b4fe",
        400: "#874de7",
        500: "#7a39e4",
        600: "#6e33cd",
        700: "#5528a0",
        800: "#3d1d72",
        900: "#251144",
        950: "#0c0617",
      },
      red: "#f14",
      blue: "#1d4ed8",
      gray: "#374151",
      ultraGray: "#171717",
      lightgray: "#9ca3af",
      primaryPurple: "#7a39e4",
      secondaryColor: "#622eb6",
      textColor: "#2c0f5a ",
      secondaryTextColor: "#fafdf6 ",
      hoverColor: "#7536da",
      svgColor: "#ffffffbe",
    },
    extend: {
      fontFamily: {
        sans: ['IRANSans', 'sans-serif'],
      },
      backgroundImage: {
        "custom-gradient":
          "linear-gradient(to bottom, rgb(214, 219, 220), rgb(255, 255, 255))",
      },
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
    },
  },
  plugins: [require("daisyui")],
};
