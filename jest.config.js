module.exports = {
  globals: {
    __PATH_PREFIX__: ``,
  },
  verbose: true,
  testTimeout: 15000,
  // Heap usage climbs steadily across test files within a worker (likely emotion/RTL
  // cleanup not fully releasing DOM/style caches between files) and never comes back
  // down. Restart a worker once it exceeds this RSS so the leak can't accumulate
  // across an entire run and OOM-crash CI, which has far less memory than a dev machine.
  workerIdleMemoryLimit: '1GB',
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
      testMatch: ['<rootDir>/tests/utils/*.test.js', '<rootDir>/tests/utils/*.test.ts'],
      transform: {
        '^.+\\.jsx?$': `<rootDir>/jest-preprocess.js`,
        '^.+\\.(ts|tsx)$': 'ts-jest',
      },
    },
    {
      displayName: 'context',
      testEnvironment: 'jest-environment-jsdom',
      testMatch: [
        '<rootDir>/tests/context/*.test.js',
        '<rootDir>/tests/context/*.test.ts',
        '<rootDir>/tests/context/*.test.tsx',
      ],
      transform: {
        '^.+\\.jsx?$': `<rootDir>/jest-preprocess.js`,
        '^.+\\.(ts|tsx)$': 'ts-jest',
      },
    },
  ],
};
