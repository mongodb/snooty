import { createRequire } from 'module';
import { generatePathPrefix } from './src/utils/generate-path-prefix.js';
import { siteMetadata } from './src/utils/site-metadata.js';
import { isGatsbyPreview } from './src/utils/is-gatsby-preview.js';

const isPreview = isGatsbyPreview();
const pathPrefix = !isPreview ? generatePathPrefix(siteMetadata) : undefined;

const require = createRequire(import.meta.url);

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
} else {
  const layoutComponentRelativePath = `./src/layouts/preview-layout-outer.js`;
  plugins.push({
    resolve: 'gatsby-plugin-layout',
    options: {
      component: require.resolve(layoutComponentRelativePath),
    },
  });
}

export { plugins, pathPrefix, siteMetadata };
