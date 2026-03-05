/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // enable dark mode by toggling class
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#ba86fc', // Using modern purple/indigo vibe
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#8b5cf6', // Indigo primary
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
                dark: {
                    bg: '#121212',
                    surface: '#1e1e1e',
                    border: '#333333'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
