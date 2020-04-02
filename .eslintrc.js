module.exports = {
  globals: {
    __PATH_PREFIX__: true,
    browser: true,
  },
  extends: ['react-app', 'plugin:import/errors'],
  ignorePatterns: ['docs-tools/', 'node_modules/', 'public/'],
  plugins: ['jest'],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', '.'],
      },
    },
  },
};
