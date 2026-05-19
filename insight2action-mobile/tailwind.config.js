/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Indigo 600
        primaryLight: "#818CF8",
        secondary: "#10B981", // Emerald 500
        background: "#F8FAFC", // Slate 50
        card: "#FFFFFF",
        text: "#0F172A", // Slate 900
        textMuted: "#64748B", // Slate 500
        border: "#E2E8F0",
        danger: "#EF4444", // Red 500
        warning: "#F59E0B" // Amber 500
      },
      fontFamily: {
        // Will use system fonts for simplicity, but can be expanded
        sans: ["System"],
      }
    },
  },
  plugins: [],
}
