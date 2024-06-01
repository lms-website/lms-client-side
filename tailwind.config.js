/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        Arvo: ["Arvo", "serif"],
      },
      colors: {
        primary: "var(--primary)",
        "light-primary": "var(--light-primary)",
        body: "var(--body-bg)",
        "light-gray": "var(--light-gray)",
        "extra-light-gray": "var(--extra-light-gray)",
        gray: "var(--gray)",
        "dark-gray": "var(--dark-gray)",
        black: "var(--black)",
        error: "var(--error)",
      },
      boxShadow: {
        "main-shadow": "0 2px 4px #00293140",
        "shadow-4": "0 4px 4px #0008141A",
        "shadow-hover": "0 4px 10px #00081440",
      },
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
            "background-color": "#f6a26f",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animation-delay")],
};
