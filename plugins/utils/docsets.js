const { siteMetadata } = require('../../src/utils/site-metadata');

const createDocsetNodes = async ({ createNode, createNodeId, createContentDigest }) => {
  // Get all MongoDB products for the sidenav
  const res = await fetch(`${process.env.GATSBY_NEXT_API_BASE_URL}/docsets/?dbName=${siteMetadata.reposDatabase}`);
  const docsets = await res.json();

  docsets.forEach((docset) => {
    createNode({
      children: [],
      id: createNodeId(`docsetInfo-${docset.repoName}`),
      internal: {
        contentDigest: createContentDigest(docset),
        type: 'Docset',
      },
      displayName: docset.displayName,
      prefix: docset.prefix,
      project: docset.project,
      groups: docset.groups,
      url: docset.url,
      branches: docset.branches,
      hasEolVersions: docset.hasEolVersions,
    });
  });
};

module.exports = {
  createDocsetNodes,
};
