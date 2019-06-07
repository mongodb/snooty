module.exports = {
  projects: [
    {
      displayName: 'regression',
      preset: 'jest-puppeteer',
      testMatch: ['<rootDir>/tests/regression/*.test.js'],
    },
    {
      displayName: 'unit',
      globals: {
        __PATH_PREFIX__: '',
      },
      moduleNameMapper: {
        '^.+\\.(css)$': '<rootDir>/tests/unit/__mockStyles.js',
      },
      setupFilesAfterEnv: ['<rootDir>/src/testSetup.js'],
      snapshotSerializers: ['enzyme-to-json/serializer'],
      testMatch: ['<rootDir>/tests/unit/*.test.js'],
    },
  ],
  verbose: true,
};
