/* eslint-disable */
export default {
  displayName: 'api-passport',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/api/passport',
  coverageReporters: ['clover', 'json', 'lcov', 'text'], // Include 'json' for JSON coverage report
  collectCoverageFrom: [
    '**/src/**/*.{ts,js}',
    '!**/node_modules/**'
  ],
};
