const { assertTrailingSlash } = require('./src/utils/assert-trailing-slash');
const { assertLeadingSlash } = require('./src/utils/assert-leading-slash');
const { generatePathPrefix } = require('./src/utils/generate-path-prefix');
const { siteMetadata } = require('./src/utils/site-metadata');
const { findAllKeyValuePairs } = require('./src/utils/find-all-key-value-pairs');
const { findKeyValuePair } = require('./src/utils/find-key-value-pair');

const pathPrefix = generatePathPrefix(siteMetadata);
const layoutComponentRelativePath = `./src/layouts/index.js`;

console.log('PATH PREFIX', pathPrefix);

// Specifies which plugins to use depending on build environment
// Keep our main plugin at top to include file saving before image plugins
const plugins = [
  'gatsby-source-snooty-prod',
  'gatsby-plugin-emotion',
  'gatsby-plugin-image',
  'gatsby-plugin-sharp',
  'gatsby-plugin-emotion',
  'gatsby-transformer-sharp', // Needed for dynamic images
  {
    resolve: 'gatsby-source-filesystem',
    options: {
      name: 'images',
      path: `${__dirname}/src/images`, // cannot use public as plugins initialize before gatsby-node module
    },
  },
  {
    resolve: 'gatsby-plugin-sitemap',
    options: {
      query: `
        {
          allSitePage {
            nodes {
              id
              path
              pageContext
            }
          }

          allPage {
            nodes {
              id
              ast
            }
          }
        }
      `,
      resolveSiteUrl: () => siteMetadata.siteUrl,
      resolvePages: ({ allSitePage: { nodes: sitePages }, allPage: { nodes: pages } }) => {
        const COMPOSABLE_CHILDREN_NAME = 'selected-content';

        const getComposablePermutations = (sitePage, astPage) => {
          const res = [];
          const contentAstChildren = findAllKeyValuePairs(
            astPage?.ast?.children ?? [],
            'name',
            COMPOSABLE_CHILDREN_NAME
          );
          for (const astNode of contentAstChildren) {
            const queryString = new URLSearchParams(astNode?.selections ?? {}).toString();
            if (!queryString) continue;

            res.push({
              ...sitePage,
              id: `${sitePage.id}?${queryString}`,
              path: `${sitePage.path}?${queryString}`,
            });
          }
          return res;
        };

        for (const astPage of pages) {
          if (!astPage?.ast?.options?.has_composable_tutorial) {
            continue;
          }

          // make copies of this sitePage node, to include query params as part of the path in the sitemap
          const sitePage = findKeyValuePair(sitePages, 'path', assertLeadingSlash(assertTrailingSlash(astPage.id)));

          if (!sitePage) {
            console.error(
              `Composable tutorials sitepages not generated. Missing corresponding sitepage with id ${astPage.id}`
            );
            continue;
          }

          sitePages.push(...getComposablePermutations(sitePage, astPage));
        }

        return sitePages;
      },
    },
  },
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
