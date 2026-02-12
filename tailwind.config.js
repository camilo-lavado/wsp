/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          light: '#25D366',
          dark: '#075E54',
          teal: '#128C7E',
        },
        surface: {
          light: '#F8F9FA',
          dark: '#202C33', // WhatsApp Web dark bg
          card: '#111B21', // WhatsApp Web message bg
        }
      }
    },
  },
  plugins: [],
}
