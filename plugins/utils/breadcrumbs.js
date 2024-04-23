const { siteMetadata } = require('../../src/utils/site-metadata');

const breadcrumbType = `Breadcrumb`;

const createBreadcrumbNodes = async ({ db, createNode, createNodeId, createContentDigest, getNodesByType }) => {
  const { database, project } = siteMetadata;

  const result = await db.fetchBreadcrumbs(database, project);

  return createNode({
    children: [],
    id: createNodeId(`Breadcrumbs-${project}`),
    internal: {
      contentDigest: createContentDigest(result.breadcrumbs),
      type: breadcrumbType,
    },
    breadcrumbs: result.breadcrumbs,
    propertyUrl: result.propertyUrl,
  });
};

module.exports = {
  createBreadcrumbNodes,
  breadcrumbType,
};
