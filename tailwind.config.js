/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        leap: {
          "0%, 20%, 50%, 80%, 100%": {
            transform: "translateY(0)",
          },
          "40%, 60%": {
            transform: "translateY(-20px)",
          },
        },
        colorChange: {
          "0%, 100%": {
            "background-color": "bg-purple-800",
          },
          "50%": {
            "background-color": "#f3e8ff",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animation-delay")],
};
