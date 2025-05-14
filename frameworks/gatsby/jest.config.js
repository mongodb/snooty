module.exports = {
  globals: {
    __PATH_PREFIX__: ``,
  },
  verbose: true,
  testTimeout: 10000,
  projects: [
    {
      displayName: 'unit',
      preset: 'ts-jest',
      globals: {
        __PATH_PREFIX__: '',
      },
      moduleNameMapper: {
        '^.+\\.(css)$': 'identity-obj-proxy',
      },
      setupFilesAfterEnv: ['<rootDir>/tests/testSetup.js'],
      snapshotSerializers: ['@emotion/jest/serializer'],
      testEnvironment: 'jest-environment-jsdom',
      testMatch: [
        '<rootDir>/tests/unit/**/*.test.js',
        '<rootDir>/tests/unit/**/*.test.tsx',
        '<rootDir>/tests/unit/**/*.test.ts',
      ],
      transform: {
        '^.+\\.jsx?$': `<rootDir>/jest-preprocess.js`,
        '^.+\\.(ts|tsx)$': 'ts-jest',
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
