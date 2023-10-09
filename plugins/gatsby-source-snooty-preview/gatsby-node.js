const { getDataStore } = require('gatsby/dist/datastore');
const path = require('path');
const stream = require('stream');
const { promisify } = require('util');
const pipeline = promisify(stream.pipeline);
const got = require(`got`);
const { parser } = require(`stream-json/jsonl/Parser`);
const { sourceNodes } = require(`./other-things-to-source`);
const { fetchClientAccessToken } = require('./utils/kanopy-auth.js');
const { callPostBuildWebhook } = require('./utils/post-build.js');
const { consumeData, KEY_LAST_FETCHED, KEY_LAST_CLIENT_ACCESS_TOKEN } = require('./utils/data-consumer.js');

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

const APIBase = process.env.API_BASE || `https://snooty-data-api.mongodb.com`;
const GATSBY_CLOUD_SITE_USER = process.env.GATSBY_CLOUD_SITE_USER;

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
  const { createNode, touchNode } = actions;

  const fileWritePromises = [];
  const lastFetched = (await cache.get(KEY_LAST_FETCHED)) || 0;
  const lastClientAccessToken = await cache.get(KEY_LAST_CLIENT_ACCESS_TOKEN);
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
    if (!GATSBY_CLOUD_SITE_USER) {
      throw new Error('Missing GATSBY_CLOUD_SITE_USER');
    }

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

    let pageCount = 0;
    // Callback function to be ran after a valid page has been found and handled.
    // Tracks and updates information that spans across several data entries
    const onHandlePage = (pageTemplate, pageId, pageNodeId) => {
      if (pageTemplate === 'changelog') hasOpenAPIChangelog = true;
      pageCount += 1;
      if (pageCount % 1000 === 0) {
        console.log({ pageCount, page_id: pageId, id: pageNodeId });
      }
    };

    // Since there's a lot of data incoming from the Snooty Data API, we stream
    // the data in chunks and parse them as they come instead of fetching everything
    // as a single JSON response
    const decode = parser();
    decode.on('data', async (_entry) => {
      // Un-nest data
      const entry = _entry.value;
      await consumeData(entry, {
        actions,
        cache,
        clientAccessToken,
        createContentDigest,
        createNodeId,
        fileWritePromises,
        getNode,
        onHandlePage,
      });
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
exports.onCreateWebpackConfig = ({ plugins, actions }) => {
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
  const templatePath = path.join(__dirname, `../../src/components/DocumentBodyPreview.js`);
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
      const pagePath = path.join(node.project, node.branch, node.page_id);
      let slug = node.page_id;
      // Slices off leading slash to ensure slug matches an entry within the toctreeOrder and renders InternalPageNav components
      if (slug !== '/' && slug[0] === '/') slug = slug.slice(1);

      createPage({
        path: pagePath,
        component: templatePath,
        context: {
          id: node.pageNodeId,
          slug,
          // Hardcode static/safe values to prevent incremental builds from rebuilding versioned preview pages
          repoBranches: {},
          associatedReposInfo: {},
          isAssociatedProduct: false,
          project: node.project,
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
