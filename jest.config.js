module.exports = {
  globals: {
    __PATH_PREFIX__: ``,
  },
  verbose: true,
  projects: [
    {
      displayName: 'regression',
      preset: 'jest-puppeteer',
      setupFilesAfterEnv: ['<rootDir>/tests/regressionTestSetup.js'],
      testMatch: ['<rootDir>/tests/regression/*.test.js'],
    },
    {
      displayName: 'unit',
      globals: {
        __PATH_PREFIX__: '',
      },
      moduleNameMapper: {
        '^.+\\.(css)$': 'identity-obj-proxy',
      },
      setupFilesAfterEnv: ['<rootDir>/tests/testSetup.js', '<rootDir>/tests/emotionTestSetup.js'],
      snapshotSerializers: ['enzyme-to-json/serializer'],
      testMatch: ['<rootDir>/tests/unit/*.test.js', '<rootDir>/tests/unit/utils/*.test.js'],
      transform: {
        '^.+\\.jsx?$': `<rootDir>/jest-preprocess.js`,
      },
    },
  ],
};
