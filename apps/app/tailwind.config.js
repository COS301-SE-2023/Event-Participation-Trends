const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [],
  },
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  plugins: [
    // ...
    require('tailwind-scrollbar'),
    require("daisyui"),
  ],
  important: true,
  theme: {
    extend: {
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
      },
    },
  },
};
