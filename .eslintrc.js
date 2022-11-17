module.exports = {
  globals: {
    __PATH_PREFIX__: true,
    browser: true,
  },
  extends: ['react-app', 'plugin:import/errors'],
  ignorePatterns: ['node_modules/', 'public/'],
  plugins: ['jest', '@emotion'],
  rules: {
    '@emotion/pkg-renaming': 'error',
    'no-return-await': 1,
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', '.'],
      },
    },
  },
};
