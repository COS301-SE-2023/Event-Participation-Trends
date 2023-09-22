/* eslint-disable */
export default {
  displayName: 'api-sensorlinking',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/libs/api/sensorlinking',
  coverageReporters: ['json', 'html'], // Include 'json' for JSON coverage report
};
