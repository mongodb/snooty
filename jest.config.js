module.exports = {
  projects: [
    {
      displayName: 'regression',
      preset: 'jest-puppeteer',
      testMatch: ['<rootDir>/tests/regression/*.test.js'],
    },
    {
      displayName: 'unit',
      setupFilesAfterEnv: ['<rootDir>/src/testSetup.js'],
      snapshotSerializers: ['enzyme-to-json/serializer'],
      testMatch: ['<rootDir>/tests/unit/*.test.js'],
    },
  ],
  verbose: true,
};
