/* eslint-disable */
export default {
  displayName: 'api-viewer-feature',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/api/viewer/feature',
  coverageReporters: ['clover', 'json', 'lcov', 'text'], // Include 'json' for JSON coverage report
};
