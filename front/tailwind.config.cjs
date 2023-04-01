/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
        colors: {
            'color1' : '#FFD700',
            'color2' : '#2F83E4',
            'color3' : '#6356AF',
            'color4' : '#2A2358'
        },
        fontFamily: {
            'itim': ['Itim']
        }
    },
  },
  plugins: [],
}

