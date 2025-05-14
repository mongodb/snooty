const { siteMetadata } = require('../../src/utils/site-metadata');

const breadcrumbType = `Breadcrumb`;

const createBreadcrumbNodes = async ({ db, createNode, createNodeId, createContentDigest }) => {
  const { database, project } = siteMetadata;
  let breadcrumbData;
  try {
    breadcrumbData = await db.fetchBreadcrumbs(database, project);
  } catch (e) {
    console.error(`Error while fetching breadcrumb data from Atlas: ${e}`);
  }
  const [breadcrumbs, propertyUrl] = breadcrumbData
    ? [breadcrumbData.breadcrumbs, breadcrumbData.propertyUrl]
    : [null, ''];

  return createNode({
    children: [],
    id: createNodeId(`Breadcrumbs-${project}`),
    internal: {
      contentDigest: createContentDigest(breadcrumbs),
      type: breadcrumbType,
    },
    breadcrumbs: breadcrumbs,
    propertyUrl: propertyUrl,
  });
};

module.exports = {
  createBreadcrumbNodes,
  breadcrumbType,
};
