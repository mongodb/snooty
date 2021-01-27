const { generatePathPrefix } = require('./src/utils/generate-path-prefix');
const { siteMetadata } = require('./src/utils/site-metadata');

module.exports = {
  pathPrefix: generatePathPrefix(siteMetadata),
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-emotion',
    'gatsby-plugin-layout',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: 'GTM-GDFN',
        includeInDevelopment: false,
      },
    },
  ],
  siteMetadata,
};
