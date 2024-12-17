module.exports = {
  globals: {
    __PATH_PREFIX__: true,
    browser: true,
  },
  extends: ['react-app', 'plugin:import/errors'],
  ignorePatterns: ['node_modules/', 'public/'],
  plugins: ['jest', '@emotion', 'import', 'testing-library'],
  rules: {
    '@emotion/pkg-renaming': 'error',
    'no-return-await': 1,
    'import/order': [
      'error',
      {
        groups: ['external', 'builtin', 'internal', 'parent', 'sibling', 'index'],
      },
    ],
    'testing-library/no-wait-for-snapshot': 'error',
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', '.'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
    },
  ],
};
