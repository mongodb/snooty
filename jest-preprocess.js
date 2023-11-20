import { createTransformer } from 'babel-jest';

const babelOptions = {
  presets: ['babel-preset-gatsby', '@emotion/babel-preset-css-prop'],
  plugins: ['@emotion'],
};

export default createTransformer(babelOptions);
