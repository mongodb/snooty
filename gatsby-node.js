const path = require('path');
const stream = require('stream');
const { promisify } = require('util');
const fs = require('fs').promises;
const { transformBreadcrumbs } = require('./src/utils/setup/transform-breadcrumbs.js');
const { saveStaticFiles } = require('./src/utils/setup/save-asset-files');
const { siteMetadata } = require('./src/utils/site-metadata');
const { getNestedValue } = require('./src/utils/get-nested-value');
const { constructPageIdPrefix } = require('./src/utils/setup/construct-page-id-prefix');
const pipeline = promisify(stream.pipeline);
const got = require(`got`);
const { parser } = require(`stream-json/jsonl/Parser`);
const { sourceNodes } = require(`./other-things-to-source`);

let isAssociatedProduct = false;
let associatedReposInfo = {};
let db;

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

const saveFile = async (file, data) => {
  await fs.mkdir(path.join('static', path.dirname(file)), {
    recursive: true,
  });
  await fs.writeFile(path.join('static', file), data, 'binary');
};

const pageIdPrefix = constructPageIdPrefix(siteMetadata);
let manifestMetadata

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest, cache }) => {
  let hasOpenAPIChangelog = false;
  const { createNode } = actions;

  let pageCount = 0;
  const fileWritePromises = [];
  const lastFetched = await cache.get(`lastFetched`);
  console.log({ lastFetched });
  const httpStream = got.stream(
    `http://localhost:3000/projects/${process.env.GATSBY_SITE}/${process.env.GATSBY_PARSER_BRANCH}/documents`
  );
  try {
    const decode = parser();
    decode.on(`data`, async (_entry) => {
      const entry = _entry.value;
      // if (![`page`, `metadata`, `timestamp`].includes(entry.type)) {
      // console.log(entry);
      // }

      if (entry.type === `timestamp`) {
        cache.set(`lastFetched`, entry.data);
      } else if (entry.type === `asset`) {
        entry.data.filenames.forEach((filePath) => {
          fileWritePromises.push(saveFile(filePath, Buffer.from(entry.data.assetData, `base64`)));
        });
      } else if (entry.type === `metadata`) {
        // Create metadata node.
        const { static_files: staticFiles, ...metadataMinusStatic } = entry.data;
        manifestMetadata = metadataMinusStatic

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
      } else if (entry.type === `page`) {
        if (entry.data?.ast?.options?.template === 'changelog') hasOpenAPIChangelog = true;
        pageCount += 1;
        const { source, ...page } = entry.data;

        const filename = getNestedValue(['filename'], page) || '';
        // The old gatsby sourceNodes has this code — I'm not sure it actually
        // is a concern (I couldn't find any page documents that didn't end in .txt)
        // but Chesterton's Fence and all.
        if (filename.endsWith('.txt')) {
          const page_id = page.page_id.replace(`${pageIdPrefix}/`, '');
          page.page_id = page_id;
          if (pageCount % 100 === 0) {
            console.log({ pageCount, page_id });
          }
          page.id = createNodeId(page_id);
          page.internal = {
            type: `Page`,
            contentDigest: createContentDigest(page),
          };

          const pagePathNode = {
            id: page.id + `/path`,
            page_id: page_id,
            pageNodeId: page.id,
            internal: {
              type: `PagePath`,
              contentDigest: page.internal.contentDigest,
            },
          };

          createNode(page);
          createNode(pagePathNode);
        }
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
  await Promise.all(fileWritePromises);

  // Source old nodes.
  console.time(`old source nodes`);
  const { _db, _isAssociatedProduct, _associatedReposInfo } = await sourceNodes({
    metadata: manifestMetadata,
    hasOpenAPIChangelog,
    createNode,
    createContentDigest,
    createNodeId,
  });
  db = _db;
  isAssociatedProduct = _isAssociatedProduct;
  associatedReposInfo = _associatedReposInfo;
  console.timeEnd(`old source nodes`);
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
      allPagePath {
        totalCount
        nodes {
          pageNodeId
          page_id
        }
      }
    }
  `);

  let repoBranches = null;
  try {
    const repoInfo = await db.stitchInterface.fetchRepoBranches();
    let errMsg;

    if (!repoInfo) {
      errMsg = `Repo data for ${siteMetadata.project} could not be found.`;
    }

    // We should expect the number of branches for a docs repo to be 1 or more.
    if (!repoInfo.branches?.length) {
      errMsg = `No version information found for ${siteMetadata.project}`;
    }

    if (errMsg) {
      throw errMsg;
    }

    // Handle inconsistent env names. Default to 'dotcomprd' when possible since this is what we will most likely use.
    // dotcom environments seem to be consistent.
    let envKey = siteMetadata.snootyEnv;
    if (!envKey || envKey === 'development') {
      envKey = 'dotcomprd';
    } else if (envKey === 'production') {
      envKey = 'prd';
    } else if (envKey === 'staging') {
      envKey = 'stg';
    }

    // We're overfetching data here. We only need branches and prefix at the least
    repoBranches = {
      branches: repoInfo.branches,
      siteBasePrefix: repoInfo.prefix[envKey],
    };

    if (repoInfo.groups?.length > 0) {
      repoBranches.groups = repoInfo.groups;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }

  result.data.allPagePath.nodes.forEach((node) => {
    const slug = node.page_id === `index` ? `/` : node.page_id;
    createPage({
      path: slug,
      component: templatePath,
      context: {
        id: node.pageNodeId,
        slug,
        repoBranches,
        associatedReposInfo,
        isAssociatedProduct,
      },
    });
  });
};
