module.exports = {
  globals: {
    __PATH_PREFIX__: ``,
  },
  verbose: true,
  testTimeout: 10000,
  projects: [
    {
      displayName: 'unit',
      globals: {
        __PATH_PREFIX__: '',
      },
      moduleNameMapper: {
        '^.+\\.(css)$': 'identity-obj-proxy',
      },
      setupFilesAfterEnv: ['<rootDir>/tests/testSetup.js'],
      snapshotSerializers: ['@emotion/jest/serializer'],
      testEnvironment: 'jest-environment-jsdom',
      testMatch: ['<rootDir>/tests/unit/**/*.test.js'],
      transform: {
        '^.+\\.jsx?$': `<rootDir>/jest-preprocess.js`,
      },
    },
    {
      displayName: 'utils',
      testMatch: ['<rootDir>/tests/utils/*.test.js'],
      transform: {
        '^.+\\.jsx?$': `<rootDir>/jest-preprocess.js`,
      },
    },
    {
      displayName: 'context',
      testEnvironment: 'jest-environment-jsdom',
      testMatch: ['<rootDir>/tests/context/*.test.js'],
      transform: {
        '^.+\\.jsx?$': `<rootDir>/jest-preprocess.js`,
      },
    },
  ],
};
