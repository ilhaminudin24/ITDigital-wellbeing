import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#0058a3", // IKEA Blue
                "accent": "#ffdb00", // IKEA Yellow
                "background-light": "#ffffff",
                "background-dark": "#111111",
                "surface-dark": "#1f1f1f",
                "input-bg": "#2a2a2a",
                "nav-bg": "#ffffff", // Added for consistency if needed, though not in HTML explicitly
            },
            fontFamily: {
                "display": ["var(--font-spline-sans)", "sans-serif"],
            },
            borderRadius: {
                "lg": "2rem",
                "xl": "3rem",
            },
        },
    },
    plugins: [],
};
export default config;
