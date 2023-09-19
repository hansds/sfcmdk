/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx,md,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "hero-light":
          "radial-gradient(circle at top, #fdfafc , #d7dff1), url('/images/hero-bg-light.jpg')",
        "hero-dark":
          "radial-gradient(circle at top, #100036 , #030b1e), url('/images/hero-bg-dark.jpg')",
      },
    },
  },
  plugins: [],
  safelist: ["w-5", "inline-block", "mx-1"],
  darkMode: "class",
};
