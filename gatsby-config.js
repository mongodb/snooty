const { generatePathPrefix } = require('./src/utils/generate-path-prefix');
const { siteMetadata } = require('./src/utils/site-metadata');

const pathPrefix = generatePathPrefix(siteMetadata);

// TODO: Gatsby v4 will enable code splitting automatically. Delete duplicate components, add conditional for consistent-nav UnifiedNav in DefaultLayout
const isFullBuild = siteMetadata.snootyEnv !== 'prd' || process.env.PREVIEW_BUILD_ENABLED?.toUpperCase() !== 'TRUE';
const layoutComponentRelativePath = `./src/layouts/${isFullBuild ? 'index' : `preview-layout`}.js`;

module.exports = {
  plugins: [
    'gatsby-plugin-emotion',
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: require.resolve(layoutComponentRelativePath),
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
