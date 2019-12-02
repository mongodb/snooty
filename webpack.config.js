const path = require('path');
const webpack = require('webpack');

// Obtain the process.env variables to pass into preview-start-cli.js
const getCliVariables = (previewMode, page) => {
  // eslint-disable-next-line global-require
  const dotenv = require('dotenv').config({
    path: `.env.development`,
  });

  return {
    'process.env.GATSBY_SITE': JSON.stringify(dotenv.parsed.GATSBY_SITE),
    'process.env.GATSBY_PARSER_USER': JSON.stringify(dotenv.parsed.GATSBY_PARSER_USER),
    'process.env.GATSBY_PARSER_BRANCH': JSON.stringify(dotenv.parsed.GATSBY_PARSER_BRANCH),
    'process.env.PREVIEW_MODE': JSON.stringify(previewMode),
    'process.env.PREVIEW_PAGE': JSON.stringify(page),
  };
};

// Obtain the process.env variables to pass into preview-start-vscode.js
const getVsCodeVariables = (previewMode, site, page) => {
  return {
    'process.env.GATSBY_SITE': JSON.stringify(site),
    'process.env.PREVIEW_MODE': JSON.stringify(previewMode),
    'process.env.PREVIEW_PAGE': JSON.stringify(page),
  };
};

module.exports = env => {
  const noopPath = path.resolve(__dirname, 'preview/noop.js');
  const envVariables =
    env.PREVIEW_MODE === 'cli'
      ? getCliVariables(env.PREVIEW_MODE, env.PREVIEW_PAGE)
      : getVsCodeVariables(env.PREVIEW_MODE, env.PROJECT_NAME, env.PREVIEW_PAGE);

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
        previewSetup: path.resolve(__dirname, 'preview', `preview-setup-${env.PREVIEW_MODE}.js`),
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
    plugins: [new webpack.DefinePlugin(envVariables)],
  };
};
