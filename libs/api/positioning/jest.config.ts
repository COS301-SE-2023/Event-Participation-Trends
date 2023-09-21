/* eslint-disable */
export default {
  displayName: 'api-positioning',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/api/positioning',
  coverageReporters: ['json', 'html'], // Include 'json' for JSON coverage report
};
