const _ = require(`lodash`);
const path = require('path');
const stream = require('stream');
const { promisify } = require('util');
const fs = require('fs').promises;
const { transformBreadcrumbs } = require('../../src/utils/setup/transform-breadcrumbs.js');
const { saveStaticFiles } = require('../../src/utils/setup/save-asset-files');
const { siteMetadata } = require('../../src/utils/site-metadata');
const { getNestedValue } = require('../../src/utils/get-nested-value');
const pipeline = promisify(stream.pipeline);
const got = require(`got`);
const { parser } = require(`stream-json/jsonl/Parser`);
const { sourceNodes } = require(`./other-things-to-source`);
const { fetchClientAccessToken } = require('./utils/kanopy-auth.js');
const { callPostBuildWebhook } = require('./utils/post-build.js');

let isAssociatedProduct = false;
let associatedReposInfo = {};
let db;
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
  await fs.mkdir(path.join('static', path.dirname(file)), {
    recursive: true,
  });
  await fs.writeFile(path.join('static', file), data, 'binary');
};

let manifestMetadata;

const APIBase = process.env.API_BASE || `https://snooty-data-api.mongodb.com`;
const GATSBY_CLOUD_SITE_USER = process.env.GATSBY_CLOUD_SITE_USER || `mmeigs`;

function createSnootyMetadataId({ branch, project, createNodeId }) {
  return createNodeId(`metadata-${branch}-${project}`);
}

exports.sourceNodes = async ({ actions, createNodeId, reporter, createContentDigest, cache, webhookBody }) => {
  console.log({ webhookBody });
  currentWebhookBody = webhookBody;
  let hasOpenAPIChangelog = false;
  let hasCloudDocsProject = false;
  const { createNode } = actions;

  let pageCount = 0;
  const fileWritePromises = [];
  const lastFetched = (await cache.get(`lastFetched`)) || 0;
  const lastClientAccessToken = await cache.get('lastClientAccessToken');
  console.log({ lastFetched });

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
        manifestMetadata = metadataMinusStatic;

        const { parentPaths, slugToTitle, branch, project } = metadataMinusStatic;
        if (project === `cloud-docs`) {
          hasCloudDocsProject = true;
        }
        if (parentPaths) {
          transformBreadcrumbs(parentPaths, slugToTitle);
        }

        // Save files in the static_files field of metadata document, including intersphinx inventories.
        if (staticFiles) {
          await saveStaticFiles(staticFiles);
        }

        createNode({
          children: [],
          id: createSnootyMetadataId({ createNodeId, branch, project }),
          internal: {
            contentDigest: createContentDigest(metadataMinusStatic),
            type: 'SnootyMetadata',
          },
          branch,
          project,
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
          const branch = page.page_id.split(`/`)[2];
          const page_id = `/` + page.page_id.split(`/`).slice(3).join(`/`);
          const project = page.page_id.split(`/`)[0];

          page.page_id = page_id;
          page.metadata = createSnootyMetadataId({ createNodeId, branch, project });
          page.id = createNodeId(page_id + branch);
          page.internal = {
            type: `Page`,
            contentDigest: createContentDigest(page),
          };

          const pagePathNode = {
            id: page.id + `/path`,
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
  const { _db, _isAssociatedProduct, _associatedReposInfo } = await sourceNodes({
    metadata: manifestMetadata,
    hasOpenAPIChangelog,
    hasCloudDocsProject,
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

let perProjectRepoBranches = new Map();
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

  for (const project of result.data.allPagePath.allProjects) {
    let repoBranches = perProjectRepoBranches.get(project);

    if (!repoBranches) {
      try {
        const repoInfo = await db.stitchInterface.fetchRepoBranches(project);
        let errMsg;

        if (!repoInfo) {
          errMsg = `Repo data for ${project} could not be found.`;
        }

        // We should expect the number of branches for a docs repo to be 1 or more.
        if (!repoInfo.branches?.length) {
          errMsg = `No version information found for ${project}`;
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
        // Fetching repoBranches data shouldn't be vital for preview/staging builds,
        // so we do not exit the process
        console.error(err);
        throw err;
      }
    }

    if (repoBranches.groups) {
      repoBranches.groups = repoBranches.groups.map((group) => {
        return _.omit(group, [`id`]);
      });
    } else {
      repoBranches.groups = [];
    }

    if (repoBranches.branches) {
      repoBranches.branches = repoBranches.branches.map((group) => {
        return _.omit(group, [`id`]);
      });
    } else {
      repoBranches.branches = [];
    }

    perProjectRepoBranches.set(project, repoBranches);
  }

  try {
    result.data.allPagePath.nodes.forEach((node) => {
      let slug;
      if (isPreview) {
        slug = path.join(node.project, node.branch, node.page_id);
      } else {
        slug = node.page_id;
      }
      createPage({
        path: slug,
        component: templatePath,
        context: {
          id: node.pageNodeId,
          slug,
          repoBranches: perProjectRepoBranches.get(node.project),
          associatedReposInfo,
          isAssociatedProduct,
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
