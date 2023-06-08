const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        "ept-deep-grey": "#101010",
        "ept-bumble-yellow": "#facc15",
        "ept-off-white": "#F5F5F5",
      },
    },
  },
  plugins: [],
};
