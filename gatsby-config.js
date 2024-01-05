const { generatePathPrefix } = require('./src/utils/generate-path-prefix');
const { siteMetadata } = require('./src/utils/site-metadata');
const { isGatsbyPreview } = require('./src/utils/is-gatsby-preview');
const { enableZopfliCompressOutputVerbose } = require('./src/utils/enable-compression-output-verbose');

const isPreview = isGatsbyPreview();
const enableCompressionOutputVerbose = enableZopfliCompressOutputVerbose();
console.log('enableCompressionOutputVerbose', enableCompressionOutputVerbose);
const pathPrefix = !isPreview ? generatePathPrefix(siteMetadata) : undefined;

console.log('PATH PREFIX', pathPrefix);

// Specifies which plugins to use depending on build environment
const plugins = ['gatsby-plugin-emotion', isPreview ? 'gatsby-source-snooty-preview' : 'gatsby-source-snooty-prod'];

// PRODUCTION DEPLOYMENTS --
// If not a preview build, use the layout that includes the
// consistent navbar and footer and generate a sitemap.
if (!isPreview) {
  plugins.push(`gatsby-plugin-sitemap`);
  const layoutComponentRelativePath = `./src/layouts/index.js`;
  plugins.push({
    resolve: 'gatsby-plugin-layout',
    options: {
      component: require.resolve(layoutComponentRelativePath),
    },
  });
  plugins.push({
    resolve: 'gatsby-plugin-zopfli',
    options: {
      extensions: ['css', 'html', 'js', 'svg', 'json'], // focuses on text-base files
      verbose: enableCompressionOutputVerbose,
      compression: {
        numiterations: 20,
      },
    },
  });
} else {
  const layoutComponentRelativePath = `./src/layouts/preview-layout-outer.js`;
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
