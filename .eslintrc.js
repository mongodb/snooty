module.exports = {
  globals: {
    __PATH_PREFIX__: true,
    browser: true,
  },
  extends: ['react-app', 'plugin:import/errors'],
  plugins: ['jest'],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', '.'],
      },
    },
  },
};
