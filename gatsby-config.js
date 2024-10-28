const { generatePathPrefix } = require('./src/utils/generate-path-prefix');
const { siteMetadata } = require('./src/utils/site-metadata');

const pathPrefix = generatePathPrefix(siteMetadata);
const layoutComponentRelativePath = `./src/layouts/index.js`;

console.log('PATH PREFIX', pathPrefix);

// Disallow gatsby-plugin-image on staging builds - unnecessary adds time to build
const stagingEnvs = ['stg', 'prd', 'dev', 'staging'];
const useImagePlugin = !stagingEnvs.includes(process.env.SNOOTY_ENV);

// Specifies which plugins to use depending on build environment
// Keep our main plugin at top to include file saving before image plugins
const plugins = [
  'gatsby-source-snooty-prod',
  ...(useImagePlugin ? ['gatsby-plugin-image'] : []),
  'gatsby-plugin-sharp',
  'gatsby-transformer-sharp', // Needed for dynamic images
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'images',
      path: `${__dirname}/src/images`, // cannot use public as plugins initialize before gatsby-node module
    },
  },
  'gatsby-plugin-emotion',
  'gatsby-plugin-sitemap',
  {
    resolve: 'gatsby-plugin-layout',
    options: {
      component: require.resolve(layoutComponentRelativePath),
    },
  },
];

module.exports = {
  plugins,
  pathPrefix,
  siteMetadata,
};
