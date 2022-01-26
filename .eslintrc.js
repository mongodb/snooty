module.exports = {
  globals: {
    __PATH_PREFIX__: true,
    browser: true,
  },
  extends: ['react-app', 'plugin:import/errors'],
  ignorePatterns: ['docs-tools/', 'node_modules/', 'public/'],
  plugins: ['jest', '@emotion'],
  rules: {
    '@emotion/jsx-import': 'error',
    '@emotion/pkg-renaming': 'error'
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', '.'],
      },
    },
  },
};
