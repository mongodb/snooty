const { assertTrailingSlash } = require('./src/utils/assert-trailing-slash');
const { assertLeadingSlash } = require('./src/utils/assert-leading-slash');
const { generatePathPrefix } = require('./src/utils/generate-path-prefix');
const { siteMetadata } = require('./src/utils/site-metadata');
const { findKeyValuePair } = require('./src/utils/find-key-value-pair');

const pathPrefix = generatePathPrefix(siteMetadata);
const layoutComponentRelativePath = `./src/layouts/index.js`;

console.log('PATH PREFIX', pathPrefix);

// TODO: move into separate ts util
function findPage(pages, id) {
  return pages.find((p) => assertLeadingSlash(assertTrailingSlash(p.id)) === id);
}

function generatePermutations(data) {
  const keys = data.map((obj) => obj.value);
  const values = data.map((obj) => obj.selections.map((sel) => sel.value));

  // Generate Cartesian product
  return values
    .reduce(
      (acc, curr) => {
        return acc.flatMap((prev) => curr.map((value) => [...prev, value]));
      },
      [[]]
    )
    .map((combination) => Object.fromEntries(keys.map((key, i) => [key, combination[i]])));
}

// Specifies which plugins to use depending on build environment
// Keep our main plugin at top to include file saving before image plugins
const plugins = [
  'gatsby-source-snooty-prod',
  'gatsby-plugin-image',
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
  {
    resolve: 'gatsby-plugin-sitemap',
    options: {
      query: `
        {
          allSitePage {
            nodes {
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
        // console.log(sitePages);
        const composableSitePages = sitePages.filter((p) => p?.pageContext?.options?.consumables);

        for (const composableSitePage of composableSitePages) {
          const page = findPage(pages, composableSitePage.path);
          if (!page) {
            console.error(`Site Page with consumable reported at path ${composableSitePage.path}, but no page exists`);
            continue;
          }

          // find composable node.
          const composableNode = findKeyValuePair(page.ast.children, 'name', 'composable-tutorial');
          if (!composableNode) {
            console.error(`Composable node not found on page ${page.id}`);
            continue;
          }

          // construct query params
          // TODO: this should be from children. not options
          const permutations = generatePermutations(composableNode['composable-options']);

          for (const permutation of permutations) {
            const queryString = new URLSearchParams(permutation).toString();
            sitePages.push({
              ...composableSitePage,
              id: `${composableSitePage.id}?${queryString}`,
              path: `${composableSitePage.path}?${queryString}`,
            });
          }
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
