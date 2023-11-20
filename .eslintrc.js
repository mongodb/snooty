export default {
  globals: {
    __PATH_PREFIX__: true,
    browser: true,
  },
  extends: ['react-app', 'plugin:import/errors'],
  ignorePatterns: ['node_modules/', 'public/'],
  plugins: ['jest', '@emotion', 'import'],
  rules: {
    '@emotion/pkg-renaming': 'error',
    'no-return-await': 1,
    'import/order': [
      'error',
      {
        groups: ['external', 'builtin', 'internal', 'parent', 'sibling', 'index'],
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', '.'],
      },
    },
  },
};
