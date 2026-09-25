/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14110F",
        kraft: "#D8C39A",
        "kraft-dark": "#B39F73",
        "case-red": "#B33A2E",
        chalk: "#F2EFE9",
        "slate-evidence": "#4A5560",
        verified: "#4C7A5E",
        "amber-flag": "#C68A2E",
      },
      fontFamily: {
        serif: ["Fraunces", "Georgia", "serif"],
        document: ["Fraunces", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        cork: "0 8px 30px rgba(0, 0, 0, 0.6)",
        card: "2px 4px 12px rgba(0, 0, 0, 0.35)",
        pin: "0 2px 5px rgba(0, 0, 0, 0.5)",
      }
    },
  },
  plugins: [],
}
