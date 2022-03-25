module.exports = {
  globals: {
    __PATH_PREFIX__: true,
    browser: true,
  },
  extends: ['react-app', 'plugin:import/errors'],
  ignorePatterns: ['node_modules/', 'public/'],
  plugins: ['jest', '@emotion'],
  rules: {
    '@emotion/jsx-import': 'error',
    '@emotion/pkg-renaming': 'error',
    'no-unused-vars': [1, { varsIgnorePattern: 'React', args: 'none', ignoreRestSiblings: true }],
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', '.'],
      },
    },
  },
};
