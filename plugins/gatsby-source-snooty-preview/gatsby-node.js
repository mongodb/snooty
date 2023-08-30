const { getDataStore } = require('gatsby/dist/datastore');
const path = require('path');
const stream = require('stream');
const { promisify } = require('util');
const fs = require('fs').promises;
const { transformBreadcrumbs } = require('../../src/utils/setup/transform-breadcrumbs.js');
const { saveStaticFiles } = require('../../src/utils/setup/save-asset-files');
const { getNestedValue } = require('../../src/utils/get-nested-value');
const pipeline = promisify(stream.pipeline);
const got = require(`got`);
const { parser } = require(`stream-json/jsonl/Parser`);
const { sourceNodes } = require(`./other-things-to-source`);
const { fetchClientAccessToken } = require('./utils/kanopy-auth.js');
const { callPostBuildWebhook } = require('./utils/post-build.js');

const isPreview = process.env.GATSBY_IS_PREVIEW === `true`;

// Global variable to allow webhookBody from sourceNodes step to be passed down
// to other Gatsby build steps that might not pass webhookBody natively.
let currentWebhookBody = {};

exports.createSchemaCustomization = async ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Page implements Node @dontInfer {
      page_id: String
      branch: String
      pagePath: String
      ast: JSON!
      metadata: SnootyMetadata @link
    }

    type PagePath implements Node @dontInfer {
      page_id: String!
      branch: String!
      project: String!
      pageNodeId: String!
    }

    type SnootyMetadata implements Node @dontInfer {
      metadata: JSON
      branch: String
      project: String
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
  await fs.mkdir(path.join('public', path.dirname(file)), {
    recursive: true,
  });
  await fs.writeFile(path.join('public', file), data, 'binary');
};

const APIBase = process.env.API_BASE || `https://snooty-data-api.mongodb.com`;
const GATSBY_CLOUD_SITE_USER = process.env.GATSBY_CLOUD_SITE_USER || `mmeigs`;

function createSnootyMetadataId({ branch, project, createNodeId }) {
  return createNodeId(`metadata-${branch}-${project}`);
}

let isFirstRun = true;
exports.sourceNodes = async ({
  actions,
  createNodeId,
  getNode,
  getNodesByType,
  reporter,
  createContentDigest,
  cache,
  webhookBody,
}) => {
  console.log({ webhookBody });
  currentWebhookBody = webhookBody;
  let hasOpenAPIChangelog = false;
  const { createNode, deleteNode, touchNode } = actions;

  let pageCount = 0;
  const fileWritePromises = [];
  const lastFetched = (await cache.get(`lastFetched`)) || 0;
  const lastClientAccessToken = await cache.get('lastClientAccessToken');
  console.log({ lastFetched });

  if (isFirstRun && lastFetched) {
    // nodes of following types are managed statefully:
    // SnootyMetadata, Page, PagePath
    // we need to touch on them on delta updates on first run of a process to prevent them from being garbage collected
    const datastore = getDataStore();
    for (const nodeType of ['SnootyMetadata', 'Page', 'PagePath']) {
      for (const node of datastore.iterateNodesByType(nodeType)) {
        touchNode(node);
      }
    }
  }

  try {
    // Generate client access token only if trying to access Snooty Data API's staging instance
    const clientAccessToken = APIBase.includes('.staging') ? await fetchClientAccessToken(lastClientAccessToken) : '';
    let url;
    if (lastFetched) {
      url = `${APIBase}/user/${GATSBY_CLOUD_SITE_USER}/documents?updated=${lastFetched}`;
    } else {
      url = `${APIBase}/user/${GATSBY_CLOUD_SITE_USER}/documents`;
    }

    const headers = {};
    if (clientAccessToken) {
      headers['Authorization'] = `Bearer ${clientAccessToken}`;
    }
    const httpStream = got.stream(url, { headers });

    const decode = parser();
    decode.on(`data`, async (_entry) => {
      const entry = _entry.value;
      const shouldDeleteContentNode = entry.data?.deleted;

      if (entry.type === `timestamp`) {
        cache.set(`lastFetched`, entry.data);
        cache.set('lastClientAccessToken', clientAccessToken);
      } else if (entry.type === `asset`) {
        entry.data.filenames.forEach((filePath) => {
          fileWritePromises.push(saveFile(filePath, Buffer.from(entry.data.assetData, `base64`)));
        });
      } else if (entry.type === `metadata`) {
        // Create metadata node.
        const { _id, build_id, created_at, static_files: staticFiles, ...metadataMinusStatic } = entry.data;
        const { parentPaths, slugToTitle, branch, project } = metadataMinusStatic;
        const nodeId = createSnootyMetadataId({ createNodeId, branch, project });

        if (shouldDeleteContentNode) {
          deleteNode(getNode(nodeId));
        } else {
          if (parentPaths) {
            transformBreadcrumbs(parentPaths, slugToTitle);
          }

          // Save files in the static_files field of metadata document, including intersphinx inventories.
          if (staticFiles) {
            await saveStaticFiles(staticFiles);
          }

          createNode({
            children: [],
            id: nodeId,
            internal: {
              contentDigest: createContentDigest(metadataMinusStatic),
              type: 'SnootyMetadata',
            },
            branch,
            project,
            parent: null,
            metadata: metadataMinusStatic,
          });
        }
      } else if (entry.type === `page`) {
        if (entry.data?.ast?.options?.template === 'changelog') hasOpenAPIChangelog = true;
        pageCount += 1;
        const { source, ...page } = entry.data;

        const filename = getNestedValue(['filename'], page) || '';
        // The old gatsby sourceNodes has this code — I'm not sure it actually
        // is a concern (I couldn't find any page documents that didn't end in .txt)
        // but Chesterton's Fence and all.
        if (filename.endsWith('.txt')) {
          const branch = page.page_id.split(`/`)[2];
          const raw_page_id = page.page_id.split(`/`).slice(3).join(`/`);
          const page_id = raw_page_id === `index` ? `/` : `/${raw_page_id}`;
          const project = page.page_id.split(`/`)[0];

          const pageNodeId = createNodeId(page_id + project + branch);
          const pagePathNodeId = pageNodeId + `/path`;

          if (shouldDeleteContentNode) {
            deleteNode(getNode(pageNodeId));
            deleteNode(getNode(pagePathNodeId));
          } else {
            page.page_id = page_id;
            page.metadata = createSnootyMetadataId({ createNodeId, branch, project });
            page.id = pageNodeId;
            page.internal = {
              type: `Page`,
              contentDigest: createContentDigest(page),
            };

            const pagePathNode = {
              id: pagePathNodeId,
              page_id: page_id,
              branch,
              project,
              pageNodeId: page.id,
              internal: {
                type: `PagePath`,
                contentDigest: page.internal.contentDigest,
              },
            };

            createNode(page);
            createNode(pagePathNode);

            if (pageCount % 1000 === 0) {
              console.log({ pageCount, page_id, id: page.id });
            }
          }
        }
      }
    });

    console.time(`source updates`);
    // Wait for HTTP connection to close.
    await pipeline(httpStream, decode);
    console.timeEnd(`source updates`);
  } catch (error) {
    callPostBuildWebhook(webhookBody, 'failed');
    reporter.panic('There was an issue sourcing nodes', error);
  }

  // Wait for all assets to be written.
  await Promise.all(fileWritePromises);

  // Source old nodes.
  console.time(`old source nodes`);
  await sourceNodes({
    hasOpenAPIChangelog,
    github_username: GATSBY_CLOUD_SITE_USER,
    createNode,
    createContentDigest,
    createNodeId,
    getNodesByType,
  });
  console.timeEnd(`old source nodes`);
  isFirstRun = false;
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
    process: require.resolve('../../stubs/process.js'),
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

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;
  const templatePath = isPreview
    ? path.join(__dirname, `../../src/components/DocumentBodyPreview.js`)
    : path.join(__dirname, `../../src/components/DocumentBody.js`);
  const result = await graphql(`
    query {
      allPagePath {
        totalCount
        nodes {
          pageNodeId
          branch
          page_id
          project
        }
        allProjects: distinct(field: { project: SELECT })
      }
    }
  `);

  if (result.errors) {
    await callPostBuildWebhook(currentWebhookBody, 'failed');
    reporter.panic('There was an error in the graphql query', result.errors);
  }

  try {
    result.data.allPagePath.nodes.forEach((node) => {
      let pagePath;
      if (isPreview) {
        pagePath = path.join(node.project, node.branch, node.page_id);
      } else {
        pagePath = node.page_id;
      }

      createPage({
        path: pagePath,
        component: templatePath,
        context: {
          id: node.pageNodeId,
          slug: node.page_id,
          // Hardcode static/safe values to prevent incremental builds from rebuilding versioned preview pages
          repoBranches: {},
          associatedReposInfo: {},
          isAssociatedProduct: false,
        },
      });
    });
  } catch (err) {
    await callPostBuildWebhook(currentWebhookBody, 'failed');
    reporter.panic('Could not build pages off of graphl query', err);
  }
};

// `onPostBuild` is run by Gatsby Cloud after everything is built, but before the
// content is deployed to the preview site. This can result in a short delay between
// when the post-build webhook is called and when the content is updated.
// Ideally, we would use Gatsby Cloud's Outgoing Notifications feature once it can
// support passing through custom data from the preview webhook's body (to include the
// Autobuilder job ID associated with the GC build).
exports.onPostBuild = async () => {
  await callPostBuildWebhook(currentWebhookBody, 'completed');
};
