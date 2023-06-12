// const yaml = require('js-yaml');
const path = require('path');
const util = require(`util`);
const stream = require('stream');
const { promisify } = require('util');
const fs = require('fs').promises;
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
const pipeline = promisify(stream.pipeline);
const got = require(`got`);
const { parser } = require(`stream-json/jsonl/Parser`);
const fastq = require(`fastq`)
const {sourceNodes} = require(`./other-things-to-source`)

const decode = parser();

// Create the transformer
const logTransform = new stream.Transform({
  readableObjectMode: true,
  writableObjectMode: true,
  transform(chunk, encoding, callback) {
    console.log(util.inspect(chunk.toString().slice(-200), { depth: null, colors: true }));
    this.push(chunk);
    callback();
  },
});

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

    type RemoteMetadata implements Node @dontInfer {
      remoteMetadata: JSON
    }

    type ChangelogData implements Node @dontInfer {
      changelogData: JSON
    }
  `;
  createTypes(typeDefs);
};

let pageCount = 0;
const fileWritePromises = []
const saveFile = async (file, data) => {
  await fs.mkdir(path.join('static', path.dirname(file)), {
    recursive: true,
  });
  await fs.writeFile(path.join('static', file), data, 'binary');
  console.log(`wrote asset`, file)
};
exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, cache }) => {
  let hasOpenAPIChangelog = false;
  const { createNode } = actions;
  const lastFetched = await cache.get(`lastFetched`);
  console.log({ lastFetched });
  const httpStream = got.stream(`http://localhost:3000/projects/docs/DOCS-16126-5.0.18-release-notes/documents`);
  try {
    decode.on(`data`, async (_entry) => {
      const entry = _entry.value;
      // if (![`page`, `metadata`, `timestamp`].includes(entry.type)) {
        // console.log(entry);
      // }

      if (entry.type === `timestamp`) {
        cache.set(`lastFetched`, entry.data);
      }

      if (entry.type === `asset`) {
        console.log(`asset`, entry.data.filenames)
        entry.data.filenames.forEach(filePath => {
          fileWritePromises.push(saveFile(filePath, Buffer.from(entry.data.assetData, `base64`)))
        })
      }

      if (entry.type === `metadata`) {
        // Create metadata node.
        const { static_files: staticFiles, ...metadataMinusStatic } = entry.data;

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
      }

      // Pages
      if (entry.type === `page`) {
        if (entry.data?.ast?.options?.template === 'changelog') hasOpenAPIChangelog = true;
        pageCount += 1;
        if (pageCount % 100 === 0) {
          console.log({ pageCount });
        }
        const { source, ...page } = entry.data;
        // console.log({page})
        page.id = createNodeId(page.page_id);
        page.internal = {
          type: `Page`,
          contentDigest: createContentDigest(page),
        };

        createNode(page);
      }
    });

    console.time(`source updates`);
    await pipeline(httpStream, decode);
    console.timeEnd(`source updates`);

    // Wait for HTTP connection to close.
  } catch (error) {
    console.log(`stream-changes error`, { error });
    throw error;
  }

  // Wait for all assets to be written.
  await Promise.all(fileWritePromises)
  console.time(`old source nodes`)
  await sourceNodes({hasOpenAPIChangelog, createNode, createContentDigest, createNodeId})
  console.timeEnd(`old source nodes`)
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
          siteBasePrefix: `/`,
        },
        associatedReposInfo: null,
        isAssociatedProduct: null,
        // template: pageNodes?.options?.template,
        // page: pageNodes,
      },
    });
  });
};
