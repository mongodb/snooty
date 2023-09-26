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
const { manifestDocumentDatabase, realmDocumentDatabase } = require('./src/init/DocumentDatabase.js');

// different types of references
const PAGES = [];

// in-memory object with key/value = filename/document
let RESOLVED_REF_DOC_MAPPING = {};

const assets = new Map();

let db;

let isAssociatedProduct = false;
const associatedReposInfo = {};

// Creates node for RemoteMetadata, mostly used for Embedded Versions. If no associated products
// or data are found, the node will be null
const createRemoteMetadataNode = async ({ createNode, createNodeId, createContentDigest }) => {
  // fetch associated child products
  const productList = manifestMetadata?.associated_products || [];
  await Promise.all(
    productList.map(async (product) => {
      associatedReposInfo[product.name] = await db.realmInterface.fetchRepoBranches(product.name);
    })
  );
  // check if product is associated child product
  try {
    const umbrellaProduct = await db.realmInterface.getMetadata({
      'associated_products.name': siteMetadata.project,
    });
    isAssociatedProduct = !!umbrellaProduct;
  } catch (e) {
    console.log('No umbrella product found. Not an associated product.');
    isAssociatedProduct = false;
  }

  // get remote metadata for updated ToC in Atlas
  try {
    const filter = {
      project: manifestMetadata.project,
      branch: manifestMetadata.branch,
    };
    if (isAssociatedProduct || manifestMetadata?.associated_products?.length) {
      filter['is_merged_toc'] = true;
    }
    const findOptions = {
      sort: { build_id: -1 },
    };
    const remoteMetadata = await db.realmInterface.getMetadata(filter, findOptions);

    createNode({
      children: [],
      id: createNodeId('remoteMetadata'),
      internal: {
        contentDigest: createContentDigest(remoteMetadata),
        type: 'RemoteMetadata',
      },
      parent: null,
      remoteMetadata: remoteMetadata,
    });
  } catch (e) {
    console.error('Error while fetching metadata from Atlas, falling back to manifest metadata');
    console.error(e);
  }
};

const atlasAdminProdChangelogS3Prefix = 'https://mongodb-mms-prod-build-server.s3.amazonaws.com/openapi/changelog';
const atlasAdminDevChangelogS3Prefix = 'https://mongodb-mms-build-server.s3.amazonaws.com/openapi/changelog';

const fetchChangelogData = async (runId, versions, s3Prefix) => {
  try {
    /* Using metadata runId, fetch OpenAPI Changelog full change list */
    const changelogResp = await fetch(`${s3Prefix}/${runId}/changelog.json`);
    const unfilteredChangelog = await changelogResp.json();

    const hideChanges = (changelog) => {
      const versionUpdate = (version) => {
        if (version !== null && version.changes !== null) {
          version.changes = version.changes.filter((change) => !change.hideFromChangelog);
        }
        return version;
      };

      //pathUpdate takes the array of versions from the specific path passed in and takes each version and runs versionUpdate on it
      const pathUpdate = (path) => {
        path.versions = path.versions.map(versionUpdate);
        path.versions = path.versions.filter(
          (version) => version && version.changes !== null && version.changes.length !== 0
        );
        return path;
      };

      //dateUpdate takes the array of paths from the specific date section passed in and takes each path and runs pathUpdate on it
      const dateUpdate = (dateSection) => {
        dateSection.paths = dateSection.paths.map(pathUpdate);
        dateSection.paths = dateSection.paths.filter(
          (path) => path !== null && path.versions !== null && path.versions.length !== 0
        );
        return dateSection;
      };

      //changelog is the json file with everything in it. Map at this level takes each date section and runs dateUpdate on it
      changelog = changelog.map(dateUpdate);
      return changelog.filter(
        (dateSection) => dateSection !== null && dateSection.paths !== null && dateSection.paths.length !== 0
      );
    };

    //console.log(hideChanges(unfilteredChangelog)[0].paths[0].versions);
    //console.log(hideChanges(unfilteredChangelog)[0].paths);

    const changelog = hideChanges(unfilteredChangelog);

    /* Aggregate all Resources in changelog for frontend filter */
    const resourcesListSet = new Set();
    changelog.forEach((release) =>
      release.paths.forEach(({ httpMethod, path }) => resourcesListSet.add(`${httpMethod} ${path}`))
    );
    const changelogResourcesList = Array.from(resourcesListSet);

    /* Fetch most recent Resource Versions' diff */
    const mostRecentResourceVersions = versions.slice(-2);
    const mostRecentDiffLabel = mostRecentResourceVersions.join('_');
    const mostRecentDiffResp = await fetch(`${s3Prefix}/${runId}/${mostRecentDiffLabel}.json`);
    const mostRecentDiffData = await mostRecentDiffResp.json();

    return {
      changelog,
      changelogResourcesList,
      mostRecentDiff: {
        mostRecentDiffLabel,
        mostRecentDiffData,
      },
    };
  } catch (error) {
    console.warn('Changelog error: Most recent runId not successful. Using last successful runId to build Changelog.');
    throw error;
  }
};

/* Creates node for ChangelogData, cuyrrently only used for OpenAPI Changelog in cloud-docs. */
const createOpenAPIChangelogNode = async ({ createNode, createNodeId, createContentDigest, siteMetadata }) => {
  try {
    const { snootyEnv } = siteMetadata;
    let atlasAdminChangelogS3Prefix;
    let indexLocation;
    switch (snootyEnv) {
      case 'staging':
      case 'development':
        atlasAdminChangelogS3Prefix = atlasAdminDevChangelogS3Prefix;
        indexLocation = 'dev.json';
        break;
      case 'production':
      default:
        atlasAdminChangelogS3Prefix = atlasAdminProdChangelogS3Prefix;
        indexLocation = 'prod.json';
    }
    /* Fetch OpenAPI Changelog metadata */
    const indexResp = await fetch(`${atlasAdminChangelogS3Prefix}/${indexLocation}`);
    const index = await indexResp.json();

    const { runId, versions } = index;

    if (!runId || typeof runId !== 'string')
      throw new Error('OpenAPI Changelog Error: `runId` not available in S3 index.json!');

    let changelogData = {
      index,
    };
    try {
      const receivedChangelogData = await fetchChangelogData(runId, versions, atlasAdminChangelogS3Prefix);
      changelogData = { ...changelogData, ...receivedChangelogData };
      if (snootyEnv === 'production') await db.realmInterface.updateOAChangelogMetadata(index);
    } catch (error) {
      /* If any error occurs, fetch last successful metadata and build changelog node */
      const lastSuccessfulIndex = await db.realmInterface.fetchDocument(
        'openapi_changelog',
        'atlas_admin_metadata',
        {}
      );
      const { runId: lastRunId, versions: lastVersions } = lastSuccessfulIndex;
      const receivedChangelogData = fetchChangelogData(lastRunId, lastVersions, atlasAdminProdChangelogS3Prefix);
      changelogData = { index: lastSuccessfulIndex, ...receivedChangelogData };
    }

    /* Create Node for useStaticQuery with all Changelog data */
    createNode({
      children: [],
      id: createNodeId('changelogData'),
      internal: {
        contentDigest: createContentDigest(changelogData),
        type: 'ChangelogData',
      },
      parent: null,
      changelogData: changelogData,
    });
  } catch (e) {
    console.error('Error while fetching OpenAPI Changelog data from S3');
    console.error(e);

    /* Create empty Node for useStaticQuery to ensure successful build */
    createNode({
      children: [],
      id: createNodeId('changelogData'),
      internal: {
        contentDigest: createContentDigest({}),
        type: 'ChangelogData',
      },
      parent: null,
      changelogData: {},
    });
  }
};

exports.sourceNodes = async ({ actions, createContentDigest, createNodeId }) => {
  let hasOpenAPIChangelog = false;
  const { createNode } = actions;

  // setup and validate env variables
  const envResults = validateEnvVariables(manifestMetadata);
  if (envResults.error) {
    throw Error(envResults.message);
  }

  // wait to connect to stitch

  if (siteMetadata.manifestPath) {
    console.log('Loading documents from manifest');
    db = manifestDocumentDatabase;
  } else {
    console.log('Loading documents from realm');
    db = realmDocumentDatabase;
  }

  await db.connect();

  const documents = await db.getDocuments();

  if (documents.length === 0) {
    console.error(
      'Snooty could not find AST entries for the',
      siteMetadata.parserBranch,
      'branch of',
      siteMetadata.project,
      'within',
      siteMetadata.database
    );
    process.exit(1);
  }
  const pageIdPrefix = constructPageIdPrefix(siteMetadata);
  documents.forEach((doc) => {
    const { page_id, ...rest } = doc;
    RESOLVED_REF_DOC_MAPPING[page_id.replace(`${pageIdPrefix}/`, '')] = rest;
  });

  // Identify page documents and parse each document for images
  Object.entries(RESOLVED_REF_DOC_MAPPING).forEach(([key, val]) => {
    const pageNode = getNestedValue(['ast', 'children'], val);
    const filename = getNestedValue(['filename'], val) || '';

    // Parse each document before pages are created via createPage
    // to remove all positions fields as it is only used in the parser for logging
    removeNestedValue('position', 'children', [val?.ast]);

    if (pageNode) {
      val.static_assets.forEach((asset) => {
        const checksum = asset.checksum;
        if (assets.has(checksum)) {
          assets.set(checksum, new Set([...assets.get(checksum), asset.key]));
        } else {
          assets.set(checksum, new Set([asset.key]));
        }
      });
    }

    if (filename.endsWith('.txt') && !manifestMetadata.openapi_pages?.[key]) {
      PAGES.push(key);
    }
    if (val?.ast?.options?.template === 'changelog') hasOpenAPIChangelog = true;
  });

  // Get all MongoDB products for the sidenav
  const products = await db.fetchAllProducts();
  products.forEach((product) => {
    const url = baseUrl(product.baseUrl + product.slug);

    createNode({
      children: [],
      id: createNodeId(`Product-${product.title}`),
      internal: {
        contentDigest: createContentDigest(product),
        type: 'Product',
      },
      parent: null,
      title: product.title,
      url,
    });
  });

  await createRemoteMetadataNode({ createNode, createNodeId, createContentDigest });
  if (siteMetadata.project === 'cloud-docs' && hasOpenAPIChangelog)
    await createOpenAPIChangelogNode({ createNode, createNodeId, createContentDigest, siteMetadata });

  await saveAssetFiles(assets, db);
  const { static_files: staticFiles, ...metadataMinusStatic } = await db.getMetadata();

  const { parentPaths, slugToTitle } = metadataMinusStatic;
  if (parentPaths) {
    transformBreadcrumbs(parentPaths, slugToTitle);
  }

  //Save files in the static_files field of metadata document, including intersphinx inventories
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
};

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;

  let repoBranches = null;
  try {
    const repoInfo = await db.realmInterface.fetchRepoBranches();
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

  return new Promise((resolve, reject) => {
    PAGES.forEach((page) => {
      const pageNodes = RESOLVED_REF_DOC_MAPPING[page]?.ast;
      const slug = getPageSlug(page);

      // TODO: Gatsby v4 will enable code splitting automatically. Delete duplicate component, add conditional for consistent-nav UnifiedFooter
      const isFullBuild =
        siteMetadata.snootyEnv !== 'production' || process.env.PREVIEW_BUILD_ENABLED?.toUpperCase() !== 'TRUE';
      const mainComponentRelativePath = `./src/components/DocumentBody${isFullBuild ? '' : 'Preview'}.js`;

      if (RESOLVED_REF_DOC_MAPPING[page] && Object.keys(RESOLVED_REF_DOC_MAPPING[page]).length > 0) {
        createPage({
          path: assertTrailingSlash(slug),
          component: path.resolve(__dirname, mainComponentRelativePath),
          context: {
            slug,
            repoBranches,
            associatedReposInfo,
            isAssociatedProduct,
            template: pageNodes?.options?.template,
            page: pageNodes,
          },
        });
      }
    });

    resolve();
  });
};

// Prevent errors when running gatsby build caused by browser packages run in a node environment.
exports.onCreateWebpackConfig = ({ stage, loaders, plugins, actions }) => {
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

// Remove type inference, as our schema is too ambiguous for this to be useful.
// https://www.gatsbyjs.com/docs/scaling-issues/#switch-off-type-inference-for-sitepagecontext
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type SitePage implements Node @dontInfer {
      path: String!
    }

    type SnootyMetadata implements Node @dontInfer {
      metadata: JSON!
    }

    type RemoteMetadata implements Node @dontInfer {
      remoteMetadata: JSON
    }

    type ChangelogData implements Node @dontInfer {
      changelogData: JSON
    }
  `);
};

// const unfilteredChangelog = [
//   {
//     date: '2023-08-10',
//     paths: [
//       {
//         path: '/api/atlas/v2/groups/{groupId}/events',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "ADDED the new 'CLUSTER_CONNECTION_GET_NAMESPACES_WITH_UUID' enum value to the 'results/items/oneOf[#/components/schemas/DefaultEventViewForNdsGroup]/eventTypeName/oneOf[#4]/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//                 hideFromChangelog: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listProjectEvents',
//         tag: 'Events',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/events/{eventId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'CLUSTER_CONNECTION_GET_NAMESPACES_WITH_UUID' enum value to the '/oneOf[#/components/schemas/DefaultEventViewForNdsGroup]/eventTypeName/oneOf[#4]/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//                 hideFromChangelog: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getProjectEvent',
//         tag: 'Events',
//       },
//     ],
//   },
//   {
//     date: '2023-08-09',
//     paths: [
//       {
//         path: '/api/atlas/v2/groups/{groupId}/events',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'PUSH_BASED_LOG_EXPORT_CONFIGURATION_UPDATED, PUSH_BASED_LOG_EXPORT_DISABLED, PUSH_BASED_LOG_EXPORT_ENABLED' enum values to the 'results/items/oneOf[#/components/schemas/NDSAuditViewForNdsGroup]/eventTypeName' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//                 hideFromChangelog: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listProjectEvents',
//         tag: 'Events',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/events/{eventId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'PUSH_BASED_LOG_EXPORT_CONFIGURATION_UPDATED, PUSH_BASED_LOG_EXPORT_DISABLED, PUSH_BASED_LOG_EXPORT_ENABLED' enum values to the '/oneOf[#/components/schemas/NDSAuditViewForNdsGroup]/eventTypeName' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//                 hideFromChangelog: false,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getProjectEvent',
//         tag: 'Events',
//       },
//     ],
//   },
//   {
//     date: '2023-08-08',
//     paths: [
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'Sample' enum value to the 'results/items/connections/items/type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//                 hideFromChangelog: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listStreamInstances',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new 'Sample' enum value to the request property 'connections/items/type'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new 'Sample' enum value to the 'connections/items/type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'createStreamInstance',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams/{tenantName}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new 'Sample' enum value to the 'connections/items/type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getStreamInstance',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams/{tenantName}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new 'Sample' enum value to the 'connections/items/type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'updateStreamInstance',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams/{tenantName}/connections',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new 'Sample' enum value to the 'results/items/type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listStreamConnections',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams/{tenantName}/connections',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new 'Sample' enum value to the request property 'type'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new 'Sample' enum value to the 'type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'createStreamConnection',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams/{tenantName}/connections/{connectionName}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new 'Sample' enum value to the 'type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getStreamConnection',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams/{tenantName}/connections/{connectionName}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new 'Sample' enum value to the request property 'type'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new 'Sample' enum value to the 'type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'updateStreamConnection',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/users/{userId}/roles',
//         httpMethod: 'PUT',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'updateProjectRoles',
//         tag: 'Projects',
//       },
//       {
//         path: '/api/atlas/v2/orgs/{orgId}/users/{userId}/roles',
//         httpMethod: 'PUT',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'updateOrganizationRoles',
//         tag: 'Organizations',
//       },
//     ],
//   },
//   {
//     date: '2023-08-05',
//     paths: [
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/backup/restoreJobs',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "the request property 'targetClusterName' became optional",
//                 changeCode: 'request-property-became-optional',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "the request property 'targetGroupId' became optional",
//                 changeCode: 'request-property-became-optional',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'createBackupRestoreJob',
//         tag: 'Cloud Backups',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/events',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'AZURE_CLUSTER_PREFERRED_STORAGE_TYPE_UPDATED' enum value to the 'results/items/oneOf[#/components/schemas/NDSAuditViewForNdsGroup]/eventTypeName' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listProjectEvents',
//         tag: 'Events',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/events/{eventId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'AZURE_CLUSTER_PREFERRED_STORAGE_TYPE_UPDATED' enum value to the '/oneOf[#/components/schemas/NDSAuditViewForNdsGroup]/eventTypeName' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getProjectEvent',
//         tag: 'Events',
//       },
//     ],
//   },
//   {
//     date: '2023-08-04',
//     paths: [
//       {
//         path: '/api/atlas/v2/federationSettings/{federationSettingsId}/connectedOrgConfigs',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'GLOBAL_EVENT_ADMIN' enum value to the '/items/postAuthRoleGrants/items/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listConnectedOrgConfigs',
//         tag: 'Federated Authentication',
//       },
//       {
//         path: '/api/atlas/v2/federationSettings/{federationSettingsId}/connectedOrgConfigs/{orgId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'GLOBAL_EVENT_ADMIN' enum value to the 'postAuthRoleGrants/items/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getConnectedOrgConfig',
//         tag: 'Federated Authentication',
//       },
//       {
//         path: '/api/atlas/v2/federationSettings/{federationSettingsId}/connectedOrgConfigs/{orgId}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'GLOBAL_EVENT_ADMIN' enum value to the request property 'postAuthRoleGrants/items/'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'GLOBAL_EVENT_ADMIN' enum value to the 'postAuthRoleGrants/items/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'updateConnectedOrgConfig',
//         tag: 'Federated Authentication',
//       },
//       {
//         path: '/api/atlas/v2/federationSettings/{federationSettingsId}/identityProviders',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'GLOBAL_EVENT_ADMIN' enum value to the '/items/associatedOrgs/items/postAuthRoleGrants/items/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listIdentityProviders',
//         tag: 'Federated Authentication',
//       },
//       {
//         path: '/api/atlas/v2/federationSettings/{federationSettingsId}/identityProviders/{identityProviderId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'GLOBAL_EVENT_ADMIN' enum value to the 'associatedOrgs/items/postAuthRoleGrants/items/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getIdentityProvider',
//         tag: 'Federated Authentication',
//       },
//       {
//         path: '/api/atlas/v2/federationSettings/{federationSettingsId}/identityProviders/{identityProviderId}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'GLOBAL_EVENT_ADMIN' enum value to the 'associatedOrgs/items/postAuthRoleGrants/items/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'updateIdentityProvider',
//         tag: 'Federated Authentication',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/alertConfigs',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the 'results/items/oneOf[#/components/schemas/DefaultAlertConfigViewForNdsGroup]/eventTypeName/oneOf[#3]/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listAlertConfigurations',
//         tag: 'Alert Configurations',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/alertConfigs',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the request property '/oneOf[#/components/schemas/DefaultAlertConfigViewForNdsGroup]/eventTypeName/oneOf[#3]/'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the '/oneOf[#/components/schemas/DefaultAlertConfigViewForNdsGroup]/eventTypeName/oneOf[#3]/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'createAlertConfiguration',
//         tag: 'Alert Configurations',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/alertConfigs/{alertConfigId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the '/oneOf[#/components/schemas/DefaultAlertConfigViewForNdsGroup]/eventTypeName/oneOf[#3]/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getAlertConfiguration',
//         tag: 'Alert Configurations',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/alertConfigs/{alertConfigId}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the '/oneOf[#/components/schemas/DefaultAlertConfigViewForNdsGroup]/eventTypeName/oneOf[#3]/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'toggleAlertConfiguration',
//         tag: 'Alert Configurations',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/alertConfigs/{alertConfigId}',
//         httpMethod: 'PUT',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the request property '/oneOf[#/components/schemas/DefaultAlertConfigViewForNdsGroup]/eventTypeName/oneOf[#3]/'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the '/oneOf[#/components/schemas/DefaultAlertConfigViewForNdsGroup]/eventTypeName/oneOf[#3]/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'updateAlertConfiguration',
//         tag: 'Alert Configurations',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/alertConfigs/{alertConfigId}/alerts',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the 'results/items/oneOf[#/components/schemas/DefaultAlertViewForNdsGroup]/eventTypeName/oneOf[#4]/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listAlertsByAlertConfigurationId',
//         tag: 'Alerts',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/alerts',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the 'results/items/oneOf[#/components/schemas/DefaultAlertViewForNdsGroup]/eventTypeName/oneOf[#4]/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listAlerts',
//         tag: 'Alerts',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/alerts/{alertId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the '/oneOf[#/components/schemas/DefaultAlertViewForNdsGroup]/eventTypeName/oneOf[#4]/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getAlert',
//         tag: 'Alerts',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/alerts/{alertId}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "the request optional property '/oneOf[#/components/schemas/HostMetricAlert]/currentValue/units' became read-only",
//                 changeCode: 'request-optional-property-became-read-only',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the request property '/oneOf[#/components/schemas/DefaultAlertViewForNdsGroup]/eventTypeName/oneOf[#4]/'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the '/oneOf[#/components/schemas/DefaultAlertViewForNdsGroup]/eventTypeName/oneOf[#4]/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'acknowledgeAlert',
//         tag: 'Alerts',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/alerts/{alertId}/alertConfigs',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the 'results/items/oneOf[#/components/schemas/DefaultAlertConfigViewForNdsGroup]/eventTypeName/oneOf[#3]/' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listAlertConfigurationsByAlertId',
//         tag: 'Alert Configurations',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/cloudProviderAccess',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'PUSH_BASED_LOG_EXPORT' enum value to the 'awsIamRoles/items/allOf[#2]/featureUsages/items/featureType' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listCloudProviderAccessRoles',
//         tag: 'Cloud Provider Access',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/cloudProviderAccess',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'PUSH_BASED_LOG_EXPORT' enum value to the request property '/oneOf[#/components/schemas/CloudProviderAccessAWSIAMRole]/allOf[#2]/featureUsages/items/featureType'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'PUSH_BASED_LOG_EXPORT' enum value to the request property '/oneOf[#/components/schemas/CloudProviderAccessAzureServicePrincipal]/allOf[#2]/featureUsages/items/featureType'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'PUSH_BASED_LOG_EXPORT' enum value to the '/oneOf[#/components/schemas/CloudProviderAccessAWSIAMRole]/allOf[#2]/featureUsages/items/featureType' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'PUSH_BASED_LOG_EXPORT' enum value to the '/oneOf[#/components/schemas/CloudProviderAccessAzureServicePrincipal]/allOf[#2]/featureUsages/items/featureType' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'createCloudProviderAccessRole',
//         tag: 'Cloud Provider Access',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/cloudProviderAccess/{roleId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added 'CloudProviderAccessAWSIAMRole, CloudProviderAccessAzureServicePrincipal' to the response body 'oneOf' list for the response",
//                 changeCode: 'response-body-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the required property 'providerName' to the response",
//                 changeCode: 'response-required-property-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getCloudProviderAccessRole',
//         tag: 'Cloud Provider Access',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/cloudProviderAccess/{roleId}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'PUSH_BASED_LOG_EXPORT' enum value to the request property '/oneOf[#/components/schemas/CloudProviderAccessAWSIAMRole]/allOf[#2]/featureUsages/items/featureType'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'PUSH_BASED_LOG_EXPORT' enum value to the request property '/oneOf[#/components/schemas/CloudProviderAccessAzureServicePrincipal]/allOf[#2]/featureUsages/items/featureType'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'PUSH_BASED_LOG_EXPORT' enum value to the '/oneOf[#/components/schemas/CloudProviderAccessAWSIAMRole]/allOf[#2]/featureUsages/items/featureType' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'PUSH_BASED_LOG_EXPORT' enum value to the '/oneOf[#/components/schemas/CloudProviderAccessAzureServicePrincipal]/allOf[#2]/featureUsages/items/featureType' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'authorizeCloudProviderAccessRole',
//         tag: 'Cloud Provider Access',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "api tag 'Clusters' added",
//                 changeCode: 'api-tag-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new optional 'query' request parameter 'includeDeletedWithRetainedBackups'",
//                 changeCode: 'new-optional-request-parameter',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new '7.0' enum value to the 'results/items/mongoDBMajorVersion' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listClusters',
//         tag: 'Clusters',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "api tag 'Clusters' added",
//                 changeCode: 'api-tag-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new optional request property 'acceptDataRisksAndForceReplicaSetReconfig'",
//                 changeCode: 'new-optional-request-property',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new '7.0' enum value to the request property 'mongoDBMajorVersion'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new '7.0' enum value to the 'mongoDBMajorVersion' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'createCluster',
//         tag: 'Clusters',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/provider/regions',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "removed 'BaseSchema[0], BaseSchema[1], BaseSchema[2]' from the 'results/items/instanceSizes/items/' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-removed',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listCloudProviderRegions',
//         tag: 'Clusters',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/tenantUpgrade',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new optional request property 'acceptDataRisksAndForceReplicaSetReconfig'",
//                 changeCode: 'new-optional-request-property',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new '7.0' enum value to the request property 'mongoDBMajorVersion'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new '7.0' enum value to the 'mongoDBMajorVersion' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'upgradeSharedCluster',
//         tag: 'Clusters',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/tenantUpgradeToServerless',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "removed the enum value DELETED of the request property 'stateName'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'upgradeSharedClusterToServerless',
//         tag: 'Clusters',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}',
//         httpMethod: 'DELETE',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "api tag 'Clusters' added",
//                 changeCode: 'api-tag-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'deleteCluster',
//         tag: 'Clusters',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "api tag 'Clusters' added",
//                 changeCode: 'api-tag-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new '7.0' enum value to the 'mongoDBMajorVersion' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getCluster',
//         tag: 'Clusters',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "api tag 'Clusters' added",
//                 changeCode: 'api-tag-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new optional request property 'acceptDataRisksAndForceReplicaSetReconfig'",
//                 changeCode: 'new-optional-request-property',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new '7.0' enum value to the request property 'mongoDBMajorVersion'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new '7.0' enum value to the 'mongoDBMajorVersion' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'updateCluster',
//         tag: 'Clusters',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/backup/snapshots',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'replicaSet, shardedCluster' enum values to the 'results/items/type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listReplicaSetBackups',
//         tag: 'Cloud Backups',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/backup/snapshots',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new 'replicaSet, shardedCluster' enum values to the 'type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'takeSnapshot',
//         tag: 'Cloud Backups',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/backup/snapshots/shardedCluster/{snapshotId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new 'replicaSet, shardedCluster' enum values to the 'type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getShardedClusterBackup',
//         tag: 'Cloud Backups',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/backup/snapshots/shardedClusters',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'replicaSet, shardedCluster' enum values to the 'results/items/type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listShardedClusterBackups',
//         tag: 'Cloud Backups',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/backup/snapshots/{snapshotId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new 'replicaSet, shardedCluster' enum values to the 'type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getReplicaSetBackup',
//         tag: 'Cloud Backups',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/backup/snapshots/{snapshotId}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new 'replicaSet, shardedCluster' enum values to the 'type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'updateSnapshotRetention',
//         tag: 'Cloud Backups',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/onlineArchives',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'DAILY, DEFAULT, MONTHLY, WEEKLY' enum values to the 'results/items/schedule/type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listOnlineArchives',
//         tag: 'Online Archive',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/onlineArchives',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new optional request property 'dataProcessRegion'",
//                 changeCode: 'new-optional-request-property',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new optional request property 'dataProcessRegion'",
//                 changeCode: 'new-optional-request-property',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new 'DAILY' enum value to the request property 'schedule/type'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new 'DEFAULT' enum value to the request property 'schedule/type'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new 'MONTHLY' enum value to the request property 'schedule/type'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new 'WEEKLY' enum value to the request property 'schedule/type'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'DAILY, DEFAULT, MONTHLY, WEEKLY' enum values to the 'schedule/type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'createOnlineArchive',
//         tag: 'Online Archive',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/onlineArchives/{archiveId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'DAILY, DEFAULT, MONTHLY, WEEKLY' enum values to the 'schedule/type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getOnlineArchive',
//         tag: 'Online Archive',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/onlineArchives/{archiveId}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new optional request property 'dataProcessRegion'",
//                 changeCode: 'new-optional-request-property',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new optional request property 'dataProcessRegion'",
//                 changeCode: 'new-optional-request-property',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new 'DAILY' enum value to the request property 'schedule/type'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new 'DEFAULT' enum value to the request property 'schedule/type'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new 'MONTHLY' enum value to the request property 'schedule/type'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new 'WEEKLY' enum value to the request property 'schedule/type'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'DAILY, DEFAULT, MONTHLY, WEEKLY' enum values to the 'schedule/type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'updateOnlineArchive',
//         tag: 'Online Archive',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/processArgs',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new optional request property 'chunkMigrationConcurrency'",
//                 changeCode: 'new-optional-request-property',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'updateClusterAdvancedConfiguration',
//         tag: 'Clusters',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/restartPrimaries',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "api tag 'Clusters' added",
//                 changeCode: 'api-tag-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'testFailover',
//         tag: 'Clusters',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/dataFederation',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added 'ApiAtlasDataLakeAWSRegionView, ApiAtlasDataLakeAzureRegionView' to the '/items/dataProcessRegion/region' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added 'DataLakeDLSAWSStore, DataLakeDLSAzureStore' to the '/items/storage/stores/items/' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "removed 'DataLakeOnlineArchiveStore' from the '/items/storage/stores/items/' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-removed',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listFederatedDatabases',
//         tag: 'Data Federation',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/dataFederation',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "removed the enum value DUBLIN_IRL of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value FRANKFURT_DEU of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value LONDON_GBR of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value MUMBAI_IND of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value OREGON_USA of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value SAOPAULO_BRA of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value SINGAPORE_SGP of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value SYDNEY_AUS of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value VIRGINIA_USA of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change:
//                   "added the new optional request property 'storage/stores/items/oneOf[#/components/schemas/DataLakeAtlasStoreInstance]/allOf[#2]/readConcern'",
//                 changeCode: 'new-optional-request-property',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added 'ApiAtlasDataLakeAWSRegionView, ApiAtlasDataLakeAzureRegionView' to the 'dataProcessRegion/region' request property 'oneOf' list",
//                 changeCode: 'request-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added 'DataLakeDLSAWSStore, DataLakeDLSAzureStore' to the 'storage/stores/items/' request property 'oneOf' list",
//                 changeCode: 'request-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added 'ApiAtlasDataLakeAWSRegionView, ApiAtlasDataLakeAzureRegionView' to the 'dataProcessRegion/region' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added 'DataLakeDLSAWSStore, DataLakeDLSAzureStore' to the 'storage/stores/items/' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "removed 'DataLakeOnlineArchiveStore' from the 'storage/stores/items/' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-removed',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'createFederatedDatabase',
//         tag: 'Data Federation',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/dataFederation/{tenantName}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added 'ApiAtlasDataLakeAWSRegionView, ApiAtlasDataLakeAzureRegionView' to the 'dataProcessRegion/region' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added 'DataLakeDLSAWSStore, DataLakeDLSAzureStore' to the 'storage/stores/items/' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "removed 'DataLakeOnlineArchiveStore' from the 'storage/stores/items/' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-removed',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getFederatedDatabase',
//         tag: 'Data Federation',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/dataFederation/{tenantName}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "removed the enum value DUBLIN_IRL of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value FRANKFURT_DEU of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value LONDON_GBR of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value MUMBAI_IND of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value OREGON_USA of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value SAOPAULO_BRA of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value SINGAPORE_SGP of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value SYDNEY_AUS of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "removed the enum value VIRGINIA_USA of the request property 'dataProcessRegion/region'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change:
//                   "added the new optional request property 'storage/stores/items/oneOf[#/components/schemas/DataLakeAtlasStoreInstance]/allOf[#2]/readConcern'",
//                 changeCode: 'new-optional-request-property',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added 'ApiAtlasDataLakeAWSRegionView, ApiAtlasDataLakeAzureRegionView' to the 'dataProcessRegion/region' request property 'oneOf' list",
//                 changeCode: 'request-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added 'DataLakeDLSAWSStore, DataLakeDLSAzureStore' to the 'storage/stores/items/' request property 'oneOf' list",
//                 changeCode: 'request-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added 'ApiAtlasDataLakeAWSRegionView, ApiAtlasDataLakeAzureRegionView' to the 'dataProcessRegion/region' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added 'DataLakeDLSAWSStore, DataLakeDLSAzureStore' to the 'storage/stores/items/' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "removed 'DataLakeOnlineArchiveStore' from the 'storage/stores/items/' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-removed',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'updateFederatedDatabase',
//         tag: 'Data Federation',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/events',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added 'RevisionSchema[6], RevisionSchema[16]' to the 'results/items/oneOf[#/components/schemas/DefaultEventViewForNdsGroup]/eventTypeName' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "removed 'BaseSchema[6], BaseSchema[16]' from the 'results/items/oneOf[#/components/schemas/DefaultEventViewForNdsGroup]/eventTypeName' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-removed',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'CLUSTER_OS_UPDATED, CLUSTER_ROLLING_RESYNC_CANCELED, CLUSTER_ROLLING_RESYNC_COMPLETED, CLUSTER_ROLLING_RESYNC_FAILED, CLUSTER_ROLLING_RESYNC_STARTED, NODE_ROLLING_RESYNC_SCHEDULED' enum values to the 'results/items/oneOf[#/components/schemas/NDSAuditViewForNdsGroup]/eventTypeName' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the 'results/items/oneOf[#/components/schemas/FTSIndexAuditView]/eventTypeName' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'GROUP_TAGS_MODIFIED' enum value to the 'results/items/oneOf[#/components/schemas/ResourceEventViewForNdsGroup]/eventTypeName' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listProjectEvents',
//         tag: 'Events',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/events/{eventId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added 'RevisionSchema[6], RevisionSchema[16]' to the '/oneOf[#/components/schemas/DefaultEventViewForNdsGroup]/eventTypeName' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "removed 'BaseSchema[6], BaseSchema[16]' from the '/oneOf[#/components/schemas/DefaultEventViewForNdsGroup]/eventTypeName' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-removed',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'CLUSTER_OS_UPDATED, CLUSTER_ROLLING_RESYNC_CANCELED, CLUSTER_ROLLING_RESYNC_COMPLETED, CLUSTER_ROLLING_RESYNC_FAILED, CLUSTER_ROLLING_RESYNC_STARTED, NODE_ROLLING_RESYNC_SCHEDULED' enum values to the '/oneOf[#/components/schemas/NDSAuditViewForNdsGroup]/eventTypeName' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'FTS_INDEXES_RESTORE_FAILED' enum value to the '/oneOf[#/components/schemas/FTSIndexAuditView]/eventTypeName' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'GROUP_TAGS_MODIFIED' enum value to the '/oneOf[#/components/schemas/ResourceEventViewForNdsGroup]/eventTypeName' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getProjectEvent',
//         tag: 'Events',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/limits/{limitName}',
//         httpMethod: 'DELETE',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new enum value 'atlas.project.deployment.privateServiceConnectionsPerRegionGroup' to the 'path' request parameter 'limitName'",
//                 changeCode: 'request-parameter-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new enum value 'atlas.project.deployment.privateServiceConnectionsSubnetMask' to the 'path' request parameter 'limitName'",
//                 changeCode: 'request-parameter-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'deleteProjectLimit',
//         tag: 'Projects',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/limits/{limitName}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new enum value 'atlas.project.deployment.privateServiceConnectionsPerRegionGroup' to the 'path' request parameter 'limitName'",
//                 changeCode: 'request-parameter-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new enum value 'atlas.project.deployment.privateServiceConnectionsSubnetMask' to the 'path' request parameter 'limitName'",
//                 changeCode: 'request-parameter-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getProjectLimit',
//         tag: 'Projects',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/limits/{limitName}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new enum value 'atlas.project.deployment.privateServiceConnectionsPerRegionGroup' to the 'path' request parameter 'limitName'",
//                 changeCode: 'request-parameter-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new enum value 'atlas.project.deployment.privateServiceConnectionsSubnetMask' to the 'path' request parameter 'limitName'",
//                 changeCode: 'request-parameter-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'setProjectLimit',
//         tag: 'Projects',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/peers',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added 'AwsNetworkPeeringConnectionSettings, AzureNetworkPeeringConnectionSettings, GCPNetworkPeeringConnectionSettings' to the 'results/items/' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "removed 'AWSPeerVpc, AzurePeerNetwork, GCPPeerVpc' from the 'results/items/' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-removed',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listPeeringConnections',
//         tag: 'Network Peering',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/peers',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "removed 'AWSPeerVpc, AzurePeerNetwork, GCPPeerVpc' from the request body 'oneOf' list",
//                 changeCode: 'request-body-one-of-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change:
//                   "added 'AwsNetworkPeeringConnectionSettings, AzureNetworkPeeringConnectionSettings, GCPNetworkPeeringConnectionSettings' to the request body 'oneOf' list",
//                 changeCode: 'request-body-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added 'AwsNetworkPeeringConnectionSettings, AzureNetworkPeeringConnectionSettings, GCPNetworkPeeringConnectionSettings' to the response body 'oneOf' list for the response",
//                 changeCode: 'response-body-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "removed 'AWSPeerVpc, AzurePeerNetwork, GCPPeerVpc' from the response body 'oneOf' list for the response",
//                 changeCode: 'response-body-one-of-removed',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'createPeeringConnection',
//         tag: 'Network Peering',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/peers/{peerId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added 'AwsNetworkPeeringConnectionSettings, AzureNetworkPeeringConnectionSettings, GCPNetworkPeeringConnectionSettings' to the response body 'oneOf' list for the response",
//                 changeCode: 'response-body-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "removed 'AWSPeerVpc, AzurePeerNetwork, GCPPeerVpc' from the response body 'oneOf' list for the response",
//                 changeCode: 'response-body-one-of-removed',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getPeeringConnection',
//         tag: 'Network Peering',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/peers/{peerId}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "removed 'AWSPeerVpc, AzurePeerNetwork, GCPPeerVpc' from the request body 'oneOf' list",
//                 changeCode: 'request-body-one-of-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change:
//                   "added 'AwsNetworkPeeringConnectionSettings, AzureNetworkPeeringConnectionSettings, GCPNetworkPeeringConnectionSettings' to the request body 'oneOf' list",
//                 changeCode: 'request-body-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added 'AwsNetworkPeeringConnectionSettings, AzureNetworkPeeringConnectionSettings, GCPNetworkPeeringConnectionSettings' to the response body 'oneOf' list for the response",
//                 changeCode: 'response-body-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "removed 'AWSPeerVpc, AzurePeerNetwork, GCPPeerVpc' from the response body 'oneOf' list for the response",
//                 changeCode: 'response-body-one-of-removed',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'updatePeeringConnection',
//         tag: 'Network Peering',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/pipelines/{pipelineName}/availableSnapshots',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'replicaSet, shardedCluster' enum values to the 'results/items/type' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listPipelineSnapshots',
//         tag: 'Data Lake Pipelines',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/privateEndpoint/serverless/instance/{instanceName}/endpoint/{endpointId}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added the new 'AWS' enum value to the request property 'providerName'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the new 'AZURE' enum value to the request property 'providerName'",
//                 changeCode: 'request-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "the request required property 'providerName' became write-only",
//                 changeCode: 'request-required-property-became-write-only',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'updateServerlessPrivateEndpoint',
//         tag: 'Serverless Private Endpoints',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/pushBasedLogExport',
//         httpMethod: 'DELETE',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'deletePushBasedLogConfiguration',
//         tag: 'Push-Based Log Export',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/pushBasedLogExport',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'getPushBasedLogConfiguration',
//         tag: 'Push-Based Log Export',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/pushBasedLogExport',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'updatePushBasedLogConfiguration',
//         tag: 'Push-Based Log Export',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/pushBasedLogExport',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'createPushBasedLogConfiguration',
//         tag: 'Push-Based Log Export',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/serverless',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "removed the enum value DELETED of the request property 'stateName'",
//                 changeCode: 'request-property-enum-value-removed',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'createServerlessInstance',
//         tag: 'Serverless Instances',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'listStreamInstances',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'createStreamInstance',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams/{tenantName}',
//         httpMethod: 'DELETE',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'deleteStreamInstance',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams/{tenantName}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'getStreamInstance',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams/{tenantName}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'updateStreamInstance',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams/{tenantName}/connections',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'listStreamConnections',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams/{tenantName}/connections',
//         httpMethod: 'POST',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'createStreamConnection',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams/{tenantName}/connections/{connectionName}',
//         httpMethod: 'DELETE',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'deleteStreamConnection',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams/{tenantName}/connections/{connectionName}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'getStreamConnection',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/streams/{tenantName}/connections/{connectionName}',
//         httpMethod: 'PATCH',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: 'endpoint added',
//                 changeCode: 'endpoint-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'release',
//           },
//         ],
//         operationId: 'updateStreamConnection',
//         tag: 'Streams',
//       },
//       {
//         path: '/api/atlas/v2/orgs/{orgId}/events',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added 'ResourceEventViewForOrg' to the 'results/items/' response property 'oneOf' list for the response",
//                 changeCode: 'response-property-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'LEGACY_REBILL_EXECUTED, TARGETED_REBILL_EXECUTED' enum values to the 'results/items/oneOf[#/components/schemas/BillingEventViewForOrg]/eventTypeName' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listOrganizationEvents',
//         tag: 'Events',
//       },
//       {
//         path: '/api/atlas/v2/orgs/{orgId}/events/{eventId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change: "added 'ResourceEventViewForOrg' to the response body 'oneOf' list for the response",
//                 changeCode: 'response-body-one-of-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "added the new 'LEGACY_REBILL_EXECUTED, TARGETED_REBILL_EXECUTED' enum values to the '/oneOf[#/components/schemas/BillingEventViewForOrg]/eventTypeName' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getOrganizationEvent',
//         tag: 'Events',
//       },
//       {
//         path: '/api/atlas/v2/orgs/{orgId}/invoices',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'ATLAS_AZURE_DATA_TRANSFER_INTER_REGION_INTER_CONTINENT, ATLAS_AZURE_DATA_TRANSFER_INTER_REGION_INTRA_CONTINENT' enum values to the 'results/items/lineItems/items/sku' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listInvoices',
//         tag: 'Invoices',
//       },
//       {
//         path: '/api/atlas/v2/orgs/{orgId}/invoices/pending',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'ATLAS_AZURE_DATA_TRANSFER_INTER_REGION_INTER_CONTINENT, ATLAS_AZURE_DATA_TRANSFER_INTER_REGION_INTRA_CONTINENT' enum values to the 'results/items/lineItems/items/sku' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'listPendingInvoices',
//         tag: 'Invoices',
//       },
//       {
//         path: '/api/atlas/v2/orgs/{orgId}/invoices/{invoiceId}',
//         httpMethod: 'GET',
//         versions: [
//           {
//             version: '2023-02-01',
//             changes: [
//               {
//                 change:
//                   "added the new 'ATLAS_AZURE_DATA_TRANSFER_INTER_REGION_INTER_CONTINENT, ATLAS_AZURE_DATA_TRANSFER_INTER_REGION_INTRA_CONTINENT' enum values to the 'lineItems/items/sku' response property",
//                 changeCode: 'response-property-enum-value-added',
//                 backwardCompatible: true,
//               },
//             ],
//             stabilityLevel: 'stable',
//             changeType: 'update',
//           },
//         ],
//         operationId: 'getInvoice',
//         tag: 'Invoices',
//       },
//     ],
//   },
//   {
//     date: '2023-02-01',
//     paths: [
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters',
//         httpMethod: 'GET',
//         operationId: 'listClusters',
//         tag: 'Multi-Cloud Clusters',
//         versions: [
//           {
//             version: '2023-02-01',
//             stabilityLevel: 'stable',
//             changeType: 'release',
//             changes: [
//               {
//                 change:
//                   "removed the optional properties from the response: 'results.items.mongoURIWithOptions', 'results.items.providerBackupEnabled', 'results.items.mongoURIUpdated', 'results.items.srvAddress', 'results.items.replicationSpec', 'results.items.mongoURI', 'results.items.numShards', 'results.items.autoScaling', 'results.items.providerSettings', 'results.items.replicationFactor', 'results.items.replicationSpecs.regionsConfig'",
//                 changeCode: 'response-optional-property-removed',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added response property 'results.items.replicationSpecs.regionConfigs'",
//                 changeCode: 'response-optional-property-added',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//           {
//             version: '2023-01-01',
//             stabilityLevel: 'stable',
//             changeType: 'deprecate',
//             changes: [
//               {
//                 change:
//                   'new resource added 2023-02-01. Resource version 2023-01-01 deprecated and marked for removal on 2025-06-01',
//                 changeCode: 'resource-version-deprecated',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters',
//         httpMethod: 'POST',
//         operationId: 'createCluster',
//         tag: 'Multi-Cloud Clusters',
//         versions: [
//           {
//             version: '2023-02-01',
//             stabilityLevel: 'stable',
//             changeType: 'release',
//             changes: [
//               {
//                 change:
//                   "removed the request properties: 'mongoURIWithOptions', 'providerBackupEnabled', 'mongoURIUpdated', 'srvAddress', 'replicationSpec', 'mongoURI', 'numShards', 'autoScaling', 'providerSettings', 'replicationFactor', 'replicationSpecs.regionsConfig'",
//                 changeCode: 'request-property-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "added 'replicationSpecs.regionConfigs' request property",
//                 changeCode: 'request-property-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "removed the optional properties from the response: 'mongoURIWithOptions', 'providerBackupEnabled', 'mongoURIUpdated', 'srvAddress', 'replicationSpec', 'mongoURI','numShards', 'autoScaling', 'providerSettings', 'replicationFactor', 'replicationSpecs.regionsConfig'",
//                 changeCode: 'response-optional-property-removed',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added response property 'replicationSpecs.regionConfigs'",
//                 changeCode: 'response-optional-property-added',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//           {
//             version: '2023-01-01',
//             stabilityLevel: 'stable',
//             changeType: 'deprecate',
//             changes: [
//               {
//                 change:
//                   'new resource added 2023-02-01. Resource version 2023-01-01 deprecated and marked for removal on 2025-06-01',
//                 changeCode: 'resource-version-deprecated',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}',
//         httpMethod: 'DELETE',
//         operationId: 'deleteCluster',
//         tag: 'Multi-Cloud Clusters',
//         versions: [
//           {
//             version: '2023-02-01',
//             stabilityLevel: 'stable',
//             changeType: 'release',
//             changes: null,
//           },
//           {
//             version: '2023-01-01',
//             stabilityLevel: 'stable',
//             changeType: 'deprecate',
//             changes: [
//               {
//                 change:
//                   'new resource added 2023-02-01. Resource version 2023-01-01 deprecated and marked for removal on 2025-06-01',
//                 changeCode: 'resource-version-deprecated',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}',
//         httpMethod: 'GET',
//         operationId: 'getCluster',
//         tag: 'Multi-Cloud Clusters',
//         versions: [
//           {
//             version: '2023-02-01',
//             stabilityLevel: 'stable',
//             changeType: 'release',
//             changes: [
//               {
//                 change:
//                   "removed the optional properties from the response: 'mongoURIWithOptions', 'providerBackupEnabled', 'mongoURIUpdated', 'srvAddress', 'replicationSpec', 'mongoURI','numShards', 'autoScaling', 'providerSettings', 'replicationFactor', 'replicationSpecs.regionsConfig'",
//                 changeCode: 'response-optional-property-removed',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added response property 'replicationSpecs.regionConfigs'",
//                 changeCode: 'response-optional-property-added',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//           {
//             version: '2023-01-01',
//             stabilityLevel: 'stable',
//             changeType: 'deprecate',
//             changes: [
//               {
//                 change:
//                   'new resource added 2023-02-01. Resource version 2023-01-01 deprecated and marked for removal on 2025-06-01',
//                 changeCode: 'resource-version-deprecated',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}',
//         httpMethod: 'PATCH',
//         operationId: 'updateCluster',
//         tag: 'Multi-Cloud Clusters',
//         versions: [
//           {
//             version: '2023-02-01',
//             stabilityLevel: 'stable',
//             changeType: 'release',
//             changes: [
//               {
//                 change:
//                   "removed the request properties: 'mongoURIWithOptions', 'providerBackupEnabled', 'mongoURIUpdated', 'srvAddress', 'replicationSpec', 'mongoURI', 'numShards', 'autoScaling', 'providerSettings', 'replicationFactor', 'replicationSpecs.regionsConfig'",
//                 changeCode: 'request-property-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "added 'replicationSpecs.regionConfigs' request property",
//                 changeCode: 'request-property-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change:
//                   "removed the optional properties from the response: 'mongoURIWithOptions', 'providerBackupEnabled', 'mongoURIUpdated', 'srvAddress', 'replicationSpec', 'mongoURI','numShards', 'autoScaling', 'providerSettings', 'replicationFactor', 'replicationSpecs.regionsConfig'",
//                 changeCode: 'response-optional-property-removed',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added response property 'replicationSpecs.regionConfigs'",
//                 changeCode: 'response-optional-property-added',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//           {
//             version: '2023-01-01',
//             stabilityLevel: 'stable',
//             changeType: 'deprecate',
//             changes: [
//               {
//                 change:
//                   'new resource added 2023-02-01. Resource version 2023-01-01 deprecated and marked for removal on 2025-06-01',
//                 changeCode: 'resource-version-deprecated',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/globalWrites',
//         httpMethod: 'GET',
//         operationId: 'getManagedNamespace',
//         tag: 'Global Clusters',
//         versions: [
//           {
//             version: '2023-02-01',
//             stabilityLevel: 'stable',
//             changeType: 'release',
//             changes: null,
//           },
//           {
//             version: '2023-01-01',
//             stabilityLevel: 'stable',
//             changeType: 'deprecate',
//             changes: [
//               {
//                 change:
//                   'new resource added 2023-02-01. Resource version 2023-01-01 deprecated and marked for removal on 2025-06-01',
//                 changeCode: 'resource-version-deprecated',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/globalWrites/customZoneMapping',
//         httpMethod: 'DELETE',
//         operationId: 'deleteAllCustomZoneMappings',
//         tag: 'Global Clusters',
//         versions: [
//           {
//             version: '2023-02-01',
//             stabilityLevel: 'stable',
//             changeType: 'release',
//             changes: null,
//           },
//           {
//             version: '2023-01-01',
//             stabilityLevel: 'stable',
//             changeType: 'deprecate',
//             changes: [
//               {
//                 change:
//                   'new resource added 2023-02-01. Resource version 2023-01-01 deprecated and marked for removal on 2025-06-01',
//                 changeCode: 'resource-version-deprecated',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/globalWrites/customZoneMapping',
//         httpMethod: 'POST',
//         operationId: 'createCustomZoneMapping',
//         tag: 'Global Clusters',
//         versions: [
//           {
//             version: '2023-02-01',
//             stabilityLevel: 'stable',
//             changeType: 'release',
//             changes: [
//               {
//                 change: "removed the request property 'customZoneMappings'",
//                 changeCode: 'request-property-removed',
//                 backwardCompatible: false,
//               },
//               {
//                 change: "added the request property 'customZoneMapping'",
//                 changeCode: 'request-property-added',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "added the request property 'managedNamespaces'",
//                 changeCode: 'request-property-added',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//           {
//             version: '2023-01-01',
//             stabilityLevel: 'stable',
//             changeType: 'deprecate',
//             changes: [
//               {
//                 change:
//                   'new resource added 2023-02-01. Resource version 2023-01-01 deprecated and marked for removal on 2025-06-01',
//                 changeCode: 'resource-version-deprecated',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/globalWrites/managedNamespaces',
//         httpMethod: 'DELETE',
//         operationId: 'deleteManagedNamespace',
//         tag: 'Global Clusters',
//         versions: [
//           {
//             version: '2023-02-01',
//             stabilityLevel: 'stable',
//             changeType: 'release',
//             changes: null,
//           },
//           {
//             version: '2023-01-01',
//             stabilityLevel: 'stable',
//             changeType: 'deprecate',
//             changes: [
//               {
//                 change:
//                   'new resource added 2023-02-01. Resource version 2023-01-01 deprecated and marked for removal on 2025-06-01',
//                 changeCode: 'resource-version-deprecated',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/globalWrites/managedNamespaces',
//         httpMethod: 'POST',
//         operationId: 'createManagedNamespace',
//         tag: 'Global Clusters',
//         versions: [
//           {
//             version: '2023-02-01',
//             stabilityLevel: 'stable',
//             changeType: 'release',
//             changes: [
//               {
//                 change: "the request property 'db' became optional",
//                 changeCode: 'request-property-became-optional',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "the request property 'collection' became optional",
//                 changeCode: 'request-property-became-optional',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "the request property 'customShardKey' became optional",
//                 changeCode: 'request-property-became-optional',
//                 backwardCompatible: true,
//               },
//               {
//                 change: "the 'numInitialChunks' request property's max was removed (from 8192)",
//                 changeCode: 'request-property-max-removed',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//           {
//             version: '2023-01-01',
//             stabilityLevel: 'stable',
//             changeType: 'deprecate',
//             changes: [
//               {
//                 change:
//                   'new resource added 2023-02-01. Resource version 2023-01-01 deprecated and marked for removal on 2025-06-01',
//                 changeCode: 'resource-version-deprecated',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{clusterName}/restartPrimaries',
//         httpMethod: 'POST',
//         operationId: 'testFailover',
//         tag: 'Multi-Cloud Clusters',
//         versions: [
//           {
//             version: '2023-02-01',
//             stabilityLevel: 'stable',
//             changeType: 'release',
//             changes: null,
//           },
//           {
//             version: '2023-01-01',
//             stabilityLevel: 'stable',
//             changeType: 'deprecate',
//             changes: [
//               {
//                 change:
//                   'new resource added 2023-02-01. Resource version 2023-01-01 deprecated and marked for removal on 2025-06-01',
//                 changeCode: 'resource-version-deprecated',
//                 backwardCompatible: true,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: '/api/atlas/v2/groups/{groupId}/clusters/{hostName}/logs/{logName}.gz',
//         httpMethod: 'GET',
//         operationId: 'getHostLogs',
//         tag: 'Monitoring and Logs',
//         versions: [
//           {
//             version: '2023-02-01',
//             stabilityLevel: 'stable',
//             changeType: 'release',
//             changes: null,
//           },
//           {
//             version: '2023-01-01',
//             stabilityLevel: 'stable',
//             changeType: 'deprecate',
//             changes: [
//               {
//                 change:
//                   'new resource added 2023-02-01. Resource version 2023-01-01 deprecated and marked for removal on 2025-06-01',
//                 changeCode: 'resource-version-deprecated',
//                 backwardCompatible: true,
//                 hideFromChangelog: true,
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
// ];
