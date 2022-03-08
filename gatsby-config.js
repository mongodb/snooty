const { generatePathPrefix } = require('./src/utils/generate-path-prefix');
const { siteMetadata } = require('./src/utils/site-metadata');

const pathPrefix = generatePathPrefix(siteMetadata);

module.exports = {
  plugins: [
    'gatsby-plugin-emotion',
    'gatsby-plugin-layout',
    'gatsby-plugin-react-helmet',
    // 'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: `${siteMetadata.siteUrl}${pathPrefix}`,
      },
    },
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: 'GTM-GDFN',
        includeInDevelopment: false,
      },
    },
  ],
  pathPrefix,
  siteMetadata,
};
