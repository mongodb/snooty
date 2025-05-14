const createDocsetNodes = async ({ db, createNode, createNodeId, createContentDigest }) => {
  // Get all MongoDB products for the sidenav
  const docsets = await db.realmInterface.fetchDocsets();
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
      url: docset.url,
      branches: docset.branches,
      hasEolVersions: docset.hasEolVersions,
    });
  });
};

module.exports = {
  createDocsetNodes,
};
