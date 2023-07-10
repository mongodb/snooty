const { generatePathPrefix } = require('./src/utils/generate-path-prefix');
const { siteMetadata } = require('./src/utils/site-metadata');

const pathPrefix = generatePathPrefix(siteMetadata);

// TODO: Gatsby v4 will enable code splitting automatically. Delete duplicate components, add conditional for consistent-nav UnifiedNav in DefaultLayout
// const isFullBuild =
// siteMetadata.snootyEnv !== 'production' || process.env.PREVIEW_BUILD_ENABLED?.toUpperCase() !== 'TRUE';
// const layoutComponentRelativePath = `./src/layouts/${isFullBuild ? 'index' : `preview-layout`}.js`;

const shouldUseGCSourcePlugin = process.env.USE_NEW_PLUGIN === `true`;

const plugins = [
  'gatsby-plugin-emotion',
  shouldUseGCSourcePlugin ? 'new' : 'old',
  // {
  // resolve: 'gatsby-plugin-layout',
  // options: {
  // component: require.resolve(layoutComponentRelativePath),
  // },
  // },
  // Sitemap plugin can potentially error out when too many pages are being built
  // at once
  shouldUseGCSourcePlugin ? '' : 'gatsby-plugin-sitemap',
  {
    resolve: 'gatsby-plugin-canonical-urls',
    options: {
      siteUrl: `${siteMetadata.siteUrl}${pathPrefix}`,
      stripQueryString: true,
    },
  },
];

module.exports = {
  plugins,
  pathPrefix,
  siteMetadata,
};
