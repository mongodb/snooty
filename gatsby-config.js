const { generatePathPrefix } = require('./src/utils/generate-path-prefix');
const { siteMetadata } = require('./src/utils/site-metadata');

module.exports = {
  pathPrefix: generatePathPrefix(siteMetadata),
  plugins: ['gatsby-plugin-react-helmet'],
  siteMetadata,
};
