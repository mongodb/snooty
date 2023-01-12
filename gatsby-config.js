const { generatePathPrefix } = require('./src/utils/generate-path-prefix');
const { siteMetadata } = require('./src/utils/site-metadata');

const pathPrefix = generatePathPrefix(siteMetadata);
const containsNav = siteMetadata.snootyEnv.match(/pro?d(uction)?/);
const layoutRelativePath = `./src/layouts/index${containsNav ? '' : `-no-nav`}.js`;

module.exports = {
  plugins: [
    'gatsby-plugin-emotion',
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: require.resolve(layoutRelativePath),
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-webpack-bundle-analyser-v2',
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: `${siteMetadata.siteUrl}${pathPrefix}`,
        stripQueryString: true,
      },
    },
  ],
  pathPrefix,
  siteMetadata,
};
