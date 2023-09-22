/* eslint-disable */
export default {
  displayName: 'api-admin-data-access',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../../coverage/libs/api/admin/data-access',
  coverageReporters: ['json', 'html'], // Include 'json' for JSON coverage report
};
