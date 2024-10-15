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

        bodyBackground: "#191919",
        //bg-gray-800: "#333333"
        //bg-gray-900: "#111827"
        cardBackground: "#3c3d3c",
      },
      maxWidth: {
        readableSongTitle: "25ch",
        artistTopTrack: "19ch",
      },
      screens: {
        //xxs: "398px",
        xxs: "440px",
        xs: "585px",
        smmd: "700px",
        mdlg: "900px",
      },
      fontFamily: {
        dancing: ["Dancing Script", "cursive"],
      },
      fontSize: {
        smmd: ["1rem"],
      },
    },
  },
  plugins: [],
};
