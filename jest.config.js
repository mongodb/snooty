module.exports = {
  projects: [
    {
      displayName: 'regression',
      preset: 'jest-puppeteer',
      setupFilesAfterEnv: ['<rootDir>/src/regressionTestSetup.js'],
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
      setupFilesAfterEnv: ['<rootDir>/src/testSetup.js'],
      snapshotSerializers: ['enzyme-to-json/serializer'],
      testMatch: ['<rootDir>/tests/unit/*.test.js'],
    },
  ],
  verbose: true,
};
