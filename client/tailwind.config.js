/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a1a33',
        glacier: '#eef4ff',
        alpine: '#1e3a8a',
        ember: '#f59e0b',
        pine: '#0f2c5c',
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Poppins"', 'sans-serif'],
      },
      boxShadow: {
        float: '0 24px 60px -24px rgba(16, 42, 110, 0.4)',
      },
    },
  },
  plugins: [],
}
