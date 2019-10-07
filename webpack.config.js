const path = require('path');
const webpack = require('webpack');

module.exports = env => {
  const noopPath = path.resolve(__dirname, 'preview/noop.js');

  return {
    mode: 'development',
    entry: path.resolve(__dirname, 'preview-start.js'),
    resolveLoader: {
      modules: [path.resolve(__dirname, 'node_modules')],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: true,
              babelrcRoots: [path.resolve(__dirname)],
            },
          },
          // Including this results in a babel-loader error within VS Code
          exclude: /node_modules\/react-highlight/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      alias: {
        gatsby: noopPath,
        previewSetup: path.resolve(__dirname, 'preview', 'preview-setup'),
        useSiteMetadata: noopPath,
      },
      extensions: ['*', '.js', '.css'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'preview'),
    },
    // Config for webpack-dev-server
    devServer: {
      contentBase: path.resolve(__dirname),
    },
    // fs won't work properly with default webpack configurations https://stackoverflow.com/a/51669301
    // We're using the bundle file in a browser but fs is local to Node
    node: {
      fs: 'empty',
    },
    plugins: [
      // TODO: Pass in an environment variable for process.env.GATSBY_SITE
      new webpack.DefinePlugin({
        'process.env.PREVIEW_PAGE': JSON.stringify(`${env.PREVIEW_PAGE}`),
      }),
    ],
  };
};
