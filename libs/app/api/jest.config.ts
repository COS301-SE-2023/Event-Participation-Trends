/* eslint-disable */
export default {
  displayName: 'app-api',
  preset: '../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/app/api',
  coverageReporters: ['json', 'html'], // Include 'json' for JSON coverage report
};
