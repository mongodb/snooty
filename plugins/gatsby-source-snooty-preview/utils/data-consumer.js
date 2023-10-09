const { transformBreadcrumbs } = require('../../../src/utils/setup/transform-breadcrumbs.js');
const { saveStaticFiles, saveFile } = require('../../../src/utils/setup/save-asset-files');
const { getNestedValue } = require('../../../src/utils/get-nested-value');

const KEY_LAST_FETCHED = 'lastFetched';
const KEY_LAST_CLIENT_ACCESS_TOKEN = 'lastClientAccessToken';

function createSnootyMetadataId({ branch, project, createNodeId }) {
  return createNodeId(`metadata-${branch}-${project}`);
}

// Syncs the plugin with timestamp of data being returned from the API.
const handleTimestamp = (data, { cache, clientAccessToken }) => {
  cache.set(KEY_LAST_FETCHED, data);
  cache.set(KEY_LAST_CLIENT_ACCESS_TOKEN, clientAccessToken);
};

const handleAsset = (data, { fileWritePromises }) => {
  const { filenames, assetData } = data;

  // Incorrect asset format should not be acceptable
  if (!filenames || !filenames.length) {
    throw new Error('No filenames found for asset');
  }
  if (!assetData) {
    throw new Error('Missing asset data');
  }

  filenames.forEach((filePath) => {
    // These promises will be resolved once all data is consumed
    fileWritePromises.push(saveFile(filePath, Buffer.from(assetData, 'base64')));
  });
};

const handleMetadata = async (
  data,
  { createContentDigest, createNode, createNodeId, deleteNode, getNode, shouldDeleteContentNode }
) => {
  const { _id, build_id, created_at, static_files: staticFiles, ...metadataMinusStatic } = data;
  const { parentPaths, slugToTitle, branch, project } = metadataMinusStatic;
  const nodeId = createSnootyMetadataId({ createNodeId, branch, project });

  if (shouldDeleteContentNode) {
    deleteNode(getNode(nodeId));
    return;
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
};

const handlePage = (
  data,
  { createContentDigest, createNode, createNodeId, deleteNode, getNode, onHandlePage, shouldDeleteContentNode }
) => {
  // Strip source string, in case it exists. We don't need the raw source of the AST
  const { source, ...page } = data;

  const filename = getNestedValue(['filename'], page) || '';
  // There can be ASTs for included .rst files as well. We should skip these, in case
  // we encounter them
  if (!filename || !filename.endsWith('.txt')) {
    console.warn(`Found an AST that is not for a page: ${filename}`);
    return;
  }

  const branch = page.page_id.split('/')[2];
  const raw_page_id = page.page_id.split('/').slice(3).join('/');
  const page_id = raw_page_id === 'index' ? '/' : `/${raw_page_id}`;
  const project = page.page_id.split('/')[0];

  const pageNodeId = createNodeId(page_id + project + branch);
  const pagePathNodeId = pageNodeId + '/path';

  if (shouldDeleteContentNode) {
    deleteNode(getNode(pageNodeId));
    deleteNode(getNode(pagePathNodeId));
    return;
  }

  page.page_id = page_id;
  page.metadata = createSnootyMetadataId({ createNodeId, branch, project });
  page.id = pageNodeId;
  page.internal = {
    type: 'Page',
    contentDigest: createContentDigest(page),
  };

  const pagePathNode = {
    id: pagePathNodeId,
    page_id,
    branch,
    project,
    pageNodeId: page.id,
    internal: {
      type: 'PagePath',
      contentDigest: page.internal.contentDigest,
    },
  };

  createNode(page);
  createNode(pagePathNode);

  const pageTemplate = data.ast?.options?.template;
  onHandlePage(pageTemplate, page_id, pageNodeId);
};

/**
 * Handles incoming data accordingly based on its data type. Notably, this handles
 * converting build data from the Snooty Data API into nodes and assets that the
 * Gatsby site will need to render pages.
 * @param {*} entry - A single data entry obtained from the Snooty Data API
 * @param {*} options - Gatsby functions and other utilities to be used by handlers
 */
const consumeData = async (
  entry,
  { actions, cache, createNodeId, createContentDigest, getNode, fileWritePromises, clientAccessToken, onHandlePage }
) => {
  const { type, data } = entry;

  // Shape and format should be consistent across all data
  if (!type) {
    throw new Error('Data entry is missing data type');
  }
  if (!data) {
    throw new Error('Data entry is missing data');
  }

  const shouldDeleteContentNode = data.deleted;
  const { createNode, deleteNode } = actions;

  if (entry.type === 'timestamp') {
    handleTimestamp(data, { cache, clientAccessToken });
  } else if (entry.type === 'asset') {
    handleAsset(data, { fileWritePromises });
  } else if (entry.type === 'metadata') {
    await handleMetadata(data, {
      createContentDigest,
      createNode,
      createNodeId,
      deleteNode,
      getNode,
      shouldDeleteContentNode,
    });
  } else if (entry.type === 'page') {
    handlePage(data, {
      createContentDigest,
      createNode,
      createNodeId,
      deleteNode,
      getNode,
      onHandlePage,
      shouldDeleteContentNode,
    });
  } else {
    // Shouldn't affect current builds
    console.warn(`Unexpected data type: ${entry.type}`);
  }
};

module.exports = { consumeData, KEY_LAST_FETCHED, KEY_LAST_CLIENT_ACCESS_TOKEN };
