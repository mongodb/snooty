const { generatePathPrefix } = require('./src/utils/generate-path-prefix');
const { siteMetadata } = require('./src/utils/site-metadata');

const pathPrefix = generatePathPrefix(siteMetadata);
const isPreview = process.env.GATSBY_IS_PREVIEW === `true`;

// TODO: Gatsby v4 will enable code splitting automatically. Delete duplicate components, add conditional for consistent-nav UnifiedNav in DefaultLayout
const isFullBuild =
  siteMetadata.snootyEnv !== 'production' || process.env.PREVIEW_BUILD_ENABLED?.toUpperCase() !== 'TRUE';
const layoutComponentRelativePath = `./src/layouts/${isFullBuild ? 'index' : `preview-layout`}.js`;

const plugins = [
  'gatsby-plugin-emotion',
  isPreview ? 'new' : 'old',
  {
    resolve: 'gatsby-plugin-canonical-urls',
    options: {
      siteUrl: `${siteMetadata.siteUrl}${pathPrefix}`,
      stripQueryString: true,
    },
  },
];

if (!isPreview) {
  plugins.push(`gatsby-plugin-sitemap`);
} else {
  plugins.push({
    resolve: 'gatsby-plugin-layout',
    options: {
      component: require.resolve(layoutComponentRelativePath),
    },
  });
}

module.exports = {
  plugins,
  pathPrefix,
  siteMetadata,
};
