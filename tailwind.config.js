/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotifyGreen: "#1DB954",
        spotifyBlack: "#191414",
      },
      maxWidth: {
        readableSongTitle: "25ch",
      },
      screens: {
        xs: "585px",
      },
    },
  },
  plugins: [],
};
