const { createStore } = require('redoc');
const fetch = require('node-fetch');

const fetchData = async (url, errMsg) => {
  const res = await fetch(url);
  if (!res.ok) {
    // Error should be caught when creating pages.
    throw new Error(`${errMsg}; ${res.statusText}`);
  }
  return res.text();
};

/**
 * @param {string} specString
 * @returns Serialized Redoc spec store
 */
const createSerializedStore = async (specString) => {
  const spec = JSON.parse(specString);
  const store = await createStore(spec);
  return store.toJS();
};

/**
 * @param {string} apiKeyword
 * @returns Serialized Redoc spec store specific to Atlas APIs
 */
const getAtlasSourceStore = async (apiKeyword) => {
  // Currently, the only expected API fetched programmatically is the Cloud Admin API,
  // but it's possible to have more in the future with varying processes.
  if (apiKeyword !== 'cloud') {
    throw new Error(`${apiKeyword} is not a supported API for building.`);
  }

  const versionURL = 'https://cloud.mongodb.com/version';
  const gitHash = await fetchData(versionURL, 'Could not find current version or git hash.');
  const oasFileURL = `https://mongodb-mms-prod-build-server.s3.amazonaws.com/openapi/${gitHash}.json`;
  const oasFileContent = await fetchData(oasFileURL, `Unable to find spec from ${oasFileURL}.`);

  return createSerializedStore(oasFileContent);
};

/**
 * @param {object} openapiMetadata
 * @returns A mapping of OpenAPI content pages and their parsed spec stores
 */
const constructOpenAPIPageMapping = async (openapiMetadata) => {
  const mapping = {};
  const entries = Object.entries(openapiMetadata);

  for (const [slug, data] of entries) {
    const { source_type: sourceType, source } = data;

    if (sourceType === 'url' || sourceType === 'local') {
      mapping[slug] = await createSerializedStore(source);
    } else if (sourceType === 'atlas') {
      mapping[slug] = await getAtlasSourceStore(source);
    }
  }

  return mapping;
};

module.exports = { constructOpenAPIPageMapping };
