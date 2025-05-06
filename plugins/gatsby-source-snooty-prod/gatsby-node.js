const swc = require('@swc/core');
const path = require('path');
const fs = require('fs/promises');
const { transformBreadcrumbs } = require('../../src/utils/setup/transform-breadcrumbs.js');
const { getPageComponents } = require('../../src/utils/setup/get-page-components.js');
const {
  saveAssetFiles,
  saveStaticFiles,
  GATSBY_IMAGE_EXTENSIONS,
} = require('../../src/utils/setup/save-asset-files.js');
const { validateEnvVariables } = require('../../src/utils/setup/validate-env-variables.js');
const { getNestedValue } = require('../../src/utils/get-nested-value.js');
const { removeNestedValue } = require('../../src/utils/remove-nested-value.js');
const { getPageSlug } = require('../../src/utils/get-page-slug.js');
const { removeLeadingSlash } = require('../../src/utils/remove-leading-slash.js');
const { manifestMetadata, siteMetadata } = require('../../src/utils/site-metadata.js');
const { assertTrailingSlash } = require('../../src/utils/assert-trailing-slash.js');
const { constructPageIdPrefix } = require('../../src/utils/setup/construct-page-id-prefix.js');
const { manifestDocumentDatabase, realmDocumentDatabase } = require('../../src/init/DocumentDatabase.js');
const { createOpenAPIChangelogNode } = require('../utils/openapi.js');
const { createProductNodes } = require('../utils/products.js');
const { createDocsetNodes } = require('../utils/docsets.js');
const { createBreadcrumbNodes } = require('../utils/breadcrumbs.js');
const { createVersionNodes } = require('../utils/versions-toc.js');
const { generatePathPrefix } = require('../../src/utils/generate-path-prefix.js');
const assets = new Map();
const projectComponents = new Set();

let db;

// Creates node for RemoteMetadata, mostly used for Embedded Versions. If no associated products
// or data are found, the node will be null
const createRemoteMetadataNode = async ({ createNode, createNodeId, createContentDigest }, umbrellaProduct) => {
  // get remote metadata for updated ToC in Atlas
  try {
    const filter = {
      project: manifestMetadata.project,
      branch: manifestMetadata.branch,
    };
    const isAssociatedProduct = !!umbrellaProduct;
    if (isAssociatedProduct || manifestMetadata?.associated_products?.length) {
      filter['is_merged_toc'] = true;
    }
    const findOptions = {
      sort: { build_id: -1 },
    };
    const remoteMetadata = await db.realmInterface.getMetadata(filter, undefined, findOptions);

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

/**
 * Creates graphql nodes on metadata for associated products
 * Association can be an umbrella product, associated product (in snooty.toml),
 * or sibling products
 */
const createAssociatedProductNodes = async ({ createNode, createNodeId, createContentDigest }, umbrellaProduct) => {
  try {
    const associatedProducts = manifestMetadata?.associated_products || [];
    if (umbrellaProduct) {
      associatedProducts.push(...(umbrellaProduct.associated_products || []));
    }

    return await Promise.all(
      associatedProducts.map(async (product) =>
        createNode({
          children: [],
          id: createNodeId(`associated-metadata-${product.name}`),
          internal: {
            contentDigest: createContentDigest(product),
            type: 'AssociatedProduct',
          },
          parent: null,
          productName: product.name,
        })
      )
    );
  } catch (e) {
    console.error(`Error while creating associated metadata nodes: ${JSON.stringify(e)}`);
  }
};

exports.sourceNodes = async ({ actions, createContentDigest, createNodeId, getNodesByType }) => {
  let hasOpenAPIChangelog = false;
  const { createNode } = actions;

  // setup and validate env variables
  const envResults = validateEnvVariables(manifestMetadata);
  if (envResults.error) {
    throw Error(envResults.message);
  }

  // wait to connect to Realm

  if (siteMetadata.manifestPath || process.env.GATSBY_BUILD_FROM_JSON === 'true') {
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
    const key = page_id.replace(`${pageIdPrefix}/`, '');
    const val = rest;

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

    const currentPageComponents = getPageComponents(pageNode);

    currentPageComponents.forEach((componentName) => projectComponents.add(componentName));

    if (filename.endsWith('.txt') && !manifestMetadata.openapi_pages?.[key]) {
      createNode({
        id: key,
        page_id: key,
        ast: doc.ast,
        facets: doc.facets,
        internal: {
          type: 'Page',
          contentDigest: createContentDigest(doc),
        },
        componentNames: currentPageComponents,
      });
    }

    const slug = getPageSlug(key);
    const gatsbyImages = val.static_assets.filter((asset) =>
      GATSBY_IMAGE_EXTENSIONS.some((ext) => asset.key.endsWith(ext))
    );
    if (gatsbyImages?.length) {
      createNode({
        children: [],
        id: createNodeId(`page-images-${slug}`),
        internal: {
          type: 'PageImage',
          contentDigest: createContentDigest(gatsbyImages.map((asset) => asset.key)),
        },
        pageAssets: gatsbyImages.map((asset) => removeLeadingSlash(asset.key)),
        parent: null,
        slug: slug,
      });
    }
    if (val?.ast?.options?.template === 'changelog') hasOpenAPIChangelog = true;
  });

  await createDocsetNodes({ db, createNode, createNodeId, createContentDigest });

  await createProductNodes({ db, createNode, createNodeId, createContentDigest });

  await createBreadcrumbNodes({ db, createNode, createNodeId, createContentDigest });

  await createVersionNodes({ createNode, createNodeId, createContentDigest });

  if (process.env['OFFLINE_DOCS'] !== 'true') {
    const umbrellaProduct = await db.realmInterface.getMetadata(
      {
        'associated_products.name': siteMetadata.project,
      },
      { associated_products: 1 }
    );
    await createAssociatedProductNodes({ createNode, createNodeId, createContentDigest }, umbrellaProduct);
    await createRemoteMetadataNode({ createNode, createNodeId, createContentDigest }, umbrellaProduct);
  }

  if (siteMetadata.project === 'cloud-docs' && hasOpenAPIChangelog)
    await createOpenAPIChangelogNode({ createNode, createNodeId, createContentDigest, siteMetadata });

  await saveAssetFiles(assets, db);
  if (!siteMetadata.manifestPath) {
    console.error('Getting metadata from realm without filters');
  }
  const { static_files: staticFiles, ...metadataMinusStatic } = await db.getMetadata();

  const { parentPaths, slugToBreadcrumbLabel } = metadataMinusStatic;
  if (parentPaths) {
    transformBreadcrumbs(parentPaths, slugToBreadcrumbLabel);
  }

  //Save files in the static_files field of metadata document, including intersphinx inventories
  if (staticFiles) {
    await saveStaticFiles(staticFiles);
  }

  const snootyMetadata = {
    ...metadataMinusStatic,
    pathPrefix: generatePathPrefix(siteMetadata),
  };
  createNode({
    children: [],
    id: createNodeId('metadata'),
    internal: {
      contentDigest: createContentDigest(snootyMetadata),
      type: 'SnootyMetadata',
    },
    parent: null,
    metadata: snootyMetadata,
  });
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  let repoBranches = null;
  try {
    const repoInfo = await db.realmInterface.fetchDocset();
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

    // Handle inconsistent env names. Default to 'dotcomstg' for staging data on local builds.
    // dotcom environments seem to be consistent.
    let envKey = siteMetadata.snootyEnv;
    if (!envKey || envKey === 'development') {
      envKey = 'dotcomstg';
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

  if (process.env.USE_FILTER_BRANCH === 'true') {
    const { code } = await swc.transformFile(`${process.cwd()}/src/components/ComponentFactory.js`, {
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
        target: 'esnext',
        parser: { jsx: true, syntax: 'ecmascript' },
        experimental: {
          plugins: [
            [
              `${process.cwd()}/component-factory-transformer/target/wasm32-wasip1/release/component_factory_filter.wasm`,
              { includes: [...Array.from(projectComponents)] },
            ],
          ],
        },
      },
    });

    console.log(code);

    if (process.env.FILTER_DRY_RUN !== 'true')
      await fs.writeFile(`${process.cwd()}/src/components/ComponentFactory.js`, code);
  }

  // DOP-4214: for each page, query the directive/node types
  const pageList = await graphql(`
    {
      allPage {
        nodes {
          page_id
          ast
          componentNames
        }
      }
    }
  `);

  if (pageList.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
  }

  return new Promise((resolve, reject) => {
    pageList?.data?.allPage?.nodes?.forEach((page) => {
      const pageNodes = page.ast;
      const slug = getPageSlug(page.page_id);

      // TODO: Gatsby v4 will enable code splitting automatically. Delete duplicate component, add conditional for consistent-nav UnifiedFooter
      const mainComponentRelativePath = `../../src/components/DocumentBody.js`;

      createPage({
        path: assertTrailingSlash(slug),
        component: path.resolve(__dirname, mainComponentRelativePath),
        context: {
          page_id: page.page_id,
          slug,
          repoBranches,
          template: pageNodes?.options?.template,
        },
      });
    });

    resolve();
  });
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

// Remove type inference, as our schema is too ambiguous for this to be useful.
// https://www.gatsbyjs.com/docs/scaling-issues/#switch-off-type-inference-for-sitepagecontext
exports.createSchemaCustomization = ({ actions }) => {
  actions.createTypes(`
    type Page implements Node @dontInfer {
      page_id: String
      branch: String
      pagePath: String
      ast: JSON!
      facets: [JSON]
      metadata: SnootyMetadata @link
      componentNames: [String!]
    }

    type SnootyMetadata implements Node @dontInfer {
      metadata: JSON
      branch: String
      project: String
      pathPrefix: String
    }

    type PagePath implements Node @dontInfer {
      page_id: String!
      branch: String!
      project: String!
      pageNodeId: String!
    }

    type RemoteMetadata implements Node @dontInfer {
      remoteMetadata: JSON
    }

    type ChangelogData implements Node @dontInfer {
      changelogData: JSON
    }

    type PageImage implements Node @dontInfer {
      slug: String
      images: [File] @link(by: "relativePath", from: "pageAssets")
    }

    type AssociatedProduct implements Node @dontInfer {
      productName: String
    }

    type Breadcrumb implements Node @dontInfer {
      breadcrumbs: JSON
      propertyUrl: String
    }

    type EnvKeys implements Node @dontInfer {
      dev: String
      stg: String
      prd: String
      dotcomprd: String
      dotcomstg: String
      regression: String
    }

    type Branch implements Node @dontInfer {
      active: Boolean
      eol_type: String
      gitBranchName: String
      offlineUrl: String
      urlSlug: String
      urlAliases: [String]
      versionSelectorLabel: String
    }

    type Docset implements Node @dontInfer {
      displayName: String
      prefix: EnvKeys
      project: String
      branches: [Branch]
      hasEolVersions: Boolean
      url: EnvKeys
    }
    type TOC implements Node @dontInfer {
      tocTree: JSON!
    }

    type VersionsData implements Node @dontInfer {
      versionsList: JSON!
    }

  `);
};
