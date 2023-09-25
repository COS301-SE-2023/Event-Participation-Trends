/* eslint-disable */
export default {
  displayName: 'api-email-util',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/api/email/util',
  coverageReporters: ['clover', 'json', 'lcov', 'text'], // Include 'json' for JSON coverage report
  collectCoverageFrom: [
    '**/src/**/*.{ts,js}',
    '!**/node_modules/**'
  ],
};
