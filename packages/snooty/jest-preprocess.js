const babelOptions = {
  presets: ['babel-preset-gatsby', '@emotion/babel-preset-css-prop'],
  plugins: ['@emotion'],
};

module.exports = require('babel-jest').createTransformer(babelOptions);
