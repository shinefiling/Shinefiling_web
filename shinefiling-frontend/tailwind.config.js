/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // NEW BRAND PALETTE: Teal & Orange
                primary: {
                    DEFAULT: '#043E52', // Main Teal
                    light: '#055570',
                    dark: '#032c3a',
                },
                secondary: {
                    DEFAULT: '#ED6E3F', // Brand Orange
                    light: '#f28b65',
                    dark: '#d15a2e',
                },
                teal: {
                    50: '#f0f9fa',
                    100: '#d9f0f2',
                    500: '#016A6D', // Original teal accent
                    600: '#043E52', // Direct branding
                },
                orange: {
                    50: '#fff7f5',
                    500: '#ED6E3F',
                    600: '#d15a2e',
                },
                // Mappings for existing usage
                navy: {
                    DEFAULT: '#043E52',
                    light: '#10232A',
                },
                brand: {
                    DEFAULT: '#ED6E3F',
                    teal: '#043E52',
                    orange: '#ED6E3F',
                },
                bronze: {
                    DEFAULT: '#ED6E3F',
                    light: '#f28b65',
                    dark: '#d15a2e',
                }
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                display: ['"Plus Jakarta Sans"', 'sans-serif'],
                serif: ['"Playfair Display"', 'serif'],
            },
            boxShadow: {
                'premium': '0 10px 30px -10px rgba(16, 35, 42, 0.15)',
                'soft': '0 2px 10px rgba(0, 0, 0, 0.05)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
