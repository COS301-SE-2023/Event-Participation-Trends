const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [],
  },
  content: [
    './src/**/*.{html,js,ts}',
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  plugins: [
    // ...
    require("daisyui"),
  ],
  theme: {
    fontFamily: {
      'poppins': ['Poppins', 'Arial'],
      'montserrat': ['Montserrat', 'Arial'],
    },
    extend: {
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(0, 1fr))',
        '36': 'repeat(36, minmax(0, 1fr))',
      },
      gridColumn: {
        'span-34': 'span 34 / span 34',
      },
      keyframes: {
        bounce: {
          '0%, 100%' : {
            transform: 'translateY(-5%)',
          },
          '50%' : {
            transform: 'translateY(0)',
          }
        }
      },
      screens: {
        '1032': '1032px',
        '1124': '1124px',
        '1310': '1310px',
        '1480': '1480px',
      },
      colors: {
        "ept-deep-grey": "#101010",
        "ept-bumble-yellow": "#facc15",
        "ept-off-white": "#F5F5F5",
        "ept-blue-grey": "#B1B8D4",
        "ept-navy-blue": "#22242A",
        "ept-light-blue": "#57D3DD",
        "ept-light-green": "#4ade80",
        "ept-light-red": "#ef4444"
      },
    },
  },
};