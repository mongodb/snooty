const { siteMetadata } = require('../../src/utils/site-metadata');

const breadcrumbType = `Breadcrumb`;

const createBreadcrumbNodes = async ({ db, createNode, createNodeId, createContentDigest }) => {
  const { database, project } = siteMetadata;

  const breadcrumbData = await db.fetchBreadcrumbs(database, project);

  return createNode({
    children: [],
    id: createNodeId(`Breadcrumbs-${project}`),
    internal: {
      contentDigest: createContentDigest(breadcrumbData?.breadcrumbs),
      type: breadcrumbType,
    },
    breadcrumbs: breadcrumbData?.breadcrumbs,
    propertyUrl: breadcrumbData?.propertyUrl,
  });
};

module.exports = {
  createBreadcrumbNodes,
  breadcrumbType,
};
