const { generatePathPrefix } = require('./src/utils/generate-path-prefix');
const { siteMetadata } = require('./src/utils/site-metadata');

const pathPrefix = generatePathPrefix(siteMetadata);
const isPreview = process.env.GATSBY_IS_PREVIEW === `true`;

const plugins = [
  'gatsby-plugin-emotion',
  isPreview ? 'gatsby-source-snooty-preview' : 'gatsby-source-snooty-prod',
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
  const layoutComponentRelativePath = `./src/layouts/index.js`;
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
