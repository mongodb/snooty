const yaml = require('js-yaml');
const path = require('path');
const { transformBreadcrumbs } = require('./src/utils/setup/transform-breadcrumbs.js');
const { baseUrl } = require('./src/utils/base-url');
const { saveAssetFiles, saveStaticFiles } = require('./src/utils/setup/save-asset-files');
const { validateEnvVariables } = require('./src/utils/setup/validate-env-variables');
const { getNestedValue } = require('./src/utils/get-nested-value');
const { removeNestedValue } = require('./src/utils/remove-nested-value.js');
const { getPageSlug } = require('./src/utils/get-page-slug');
const { manifestMetadata, siteMetadata } = require('./src/utils/site-metadata');
const { assertTrailingSlash } = require('./src/utils/assert-trailing-slash');
const { constructPageIdPrefix } = require('./src/utils/setup/construct-page-id-prefix');
const { manifestDocumentDatabase, stitchDocumentDatabase } = require('./src/init/DocumentDatabase.js');
const got = require(`got`);

// type Page = {
// id: string,
// page_id: string,
// pagePath: string,
// ast: any,
// static_assets: Array<string>,
// internal: {
// type: string,
// contentDigest: string,
// },
// };

exports.onPreInit = () => {
  // setup and validate env variables
  const envResults = validateEnvVariables(manifestMetadata);
  if (envResults.error) {
    throw Error(envResults.message);
  }
};

exports.createSchemaCustomization = async ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Page implements Node @dontInfer {
      page_id: String
      pagePath: String
      ast: JSON!
    }
    type SnootyMetadata implements Node @dontInfer {
      metadata: JSON
    }
  `;
  createTypes(typeDefs);
};

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, cache }) => {
  const { createNode } = actions;
  const lastFetched = await cache.get(`lastFetched`);
  console.log({ lastFetched });

  lastFetched ? console.log(`fetching only changed pages`) : console.log(`fetching all pages`);
  let response;
  console.time(`fetch updates`);
  // if (!lastFetched) {
  response = await got(
    `http://localhost:3000/projects/docs/DOCS-16126-5.0.18-release-notes/documents/updated/1684249414358`
  ).json();
  // TODO restore
  // } else {
  // response = await got(
  // `http://localhost:3000/docs/updated/${lastFetched}`
  // ).json();
  // }
  console.timeEnd(`fetch updates`);
  console.log(response);
  await cache.set(`lastFetched`, response.timestamp);

  // Create metadata node.
  const { static_files: staticFiles, ...metadataMinusStatic } = response.data.metadata[0];

  const { parentPaths, slugToTitle } = metadataMinusStatic;
  if (parentPaths) {
    transformBreadcrumbs(parentPaths, slugToTitle);
  }

  // Save files in the static_files field of metadata document, including intersphinx inventories.
  if (staticFiles) {
    await saveStaticFiles(staticFiles);
  }

  createNode({
    children: [],
    id: createNodeId('metadata'),
    internal: {
      contentDigest: createContentDigest(metadataMinusStatic),
      type: 'SnootyMetadata',
    },
    parent: null,
    metadata: metadataMinusStatic,
  });

  // Create document nodes.
  response.data.documents.forEach((datum) => {
    const { source, ...page } = datum;
    page.id = createNodeId(page.page_id);
    page.internal = {
      type: `Page`,
      contentDigest: createContentDigest(page),
    };

    createNode(page);
  });
};

// Prevent errors when running gatsby build caused by browser packages run in a node environment.
exports.onCreateWebpackConfig = ({ stage, loaders, plugins, actions }) => {
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /mongodb-stitch-browser-sdk/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

  const providePlugins = {
    Buffer: ['buffer', 'Buffer'],
    process: require.resolve('./stubs/process.js'),
  };

  const fallbacks = { stream: require.resolve('stream-browserify'), buffer: require.resolve('buffer/') };

  actions.setWebpackConfig({
    plugins: [plugins.provide(providePlugins)],
    resolve: {
      fallback: fallbacks,
      alias: {
        process: 'process/browser',
      },
    },
  });
};

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;
  const templatePath = path.resolve(`./src/components/DocumentBody.js`);
  const result = await graphql(`
    query {
      allPage {
        totalCount
        nodes {
          id
          page_id
        }
      }
    }
  `);

  result.data.allPage.nodes.forEach((node) => {
    const slug = node.page_id === `index` ? `/` : node.page_id;
    createPage({
      path: slug,
      component: templatePath,
      context: {
        id: node.id,
        slug,
        repoBranches: {
          branches: [`main`],
          siteBasePrefix: `/`
        },
        associatedReposInfo: null,
        isAssociatedProduct: null,
        // template: pageNodes?.options?.template,
        // page: pageNodes,
      },
    });
  });
};
