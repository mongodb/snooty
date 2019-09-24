const path = require('path');
const webpack = require('webpack');

const dotenv = require('dotenv').config({
    path: `.env.development`,
});

module.exports = (env) => {
    return {
        mode: "development",
        entry: './preview-start.js',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.css$/, 
                    use: ['style-loader', 'css-loader']
                }
            ]
        },
        resolve: {
            alias: {
                gatsby: path.resolve(__dirname, 'preview/noop.js'),
                useSiteMetadata: path.resolve(__dirname, "preview/noop.js")
            },
            extensions: ['*', '.js', '.css']
        },
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, 'preview'),
        },
        devServer: {
            contentBase: './',
            open: true
        },
        // fs won't work properly with default webpack configurations https://stackoverflow.com/a/51669301
        node: {
            fs: 'empty'
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.GATSBY_SITE': JSON.stringify(dotenv.parsed.GATSBY_SITE),
                'process.env.GATSBY_PARSER_USER': JSON.stringify(dotenv.parsed.GATSBY_PARSER_USER),
                'process.env.GATSBY_PARSER_BRANCH': JSON.stringify(dotenv.parsed.GATSBY_PARSER_BRANCH),
                'process.env.PREVIEW_PAGE': JSON.stringify(`${env.PREVIEW_PAGE}`)
            })
        ]
    }
}
