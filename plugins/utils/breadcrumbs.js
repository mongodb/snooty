const { siteMetadata } = require('../../src/utils/site-metadata');

const breadcrumbType = `Breadcrumb`;

const createBreadcrumbNodes = async ({ createNode, createNodeId, createContentDigest }) => {
  const { database, project } = siteMetadata;
  let breadcrumbData;
  try {
    const res = await fetch(
      `${process.env.GATSBY_NEXT_API_BASE_URL}/breadcrumbs?dbName=${database}&project=${project}`
    );
    breadcrumbData = await res.json();
  } catch (e) {
    console.error(`Error while fetching breadcrumb data from Docs Next API: ${e}`);
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
