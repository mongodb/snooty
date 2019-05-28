//based on https://github.com/10gen/mms/blob/master/client/.eslintrc.js
const fs = require('fs');
const path = require('path');

module.exports = {
  extends: ['airbnb', 'prettier', 'prettier/react', 'plugin:jest/recommended'],
  // required until class properties is supported by eslint natively.
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
  },
  plugins: ['react', 'class-property', 'prettier', 'jest'],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', '.'],
      },
    },
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  globals: {
    browser: true,
  },
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-underscore-dangle': 0,
    'prefer-destructuring': 0,
    'import/no-cycle': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        controlComponents: ['span'],
      },
    ],
    'jsx-a11y/label-has-for': 0,
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.tsx'] }],
    'react/no-array-index-key': 0,
  },
};
