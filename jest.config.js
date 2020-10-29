module.exports = {
  globals: {
    __PATH_PREFIX__: ``,
  },
  verbose: true,
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
      snapshotSerializers: ['enzyme-to-json/serializer', 'jest-emotion'],
      testMatch: ['<rootDir>/tests/unit/*.test.js', '<rootDir>/tests/unit/utils/*.test.js'],
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
  ],
};
