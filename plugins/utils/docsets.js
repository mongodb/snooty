const createDocsetNodes = async ({ db, createNode, createNodeId, createContentDigest }) => {
  // Get all MongoDB products for the sidenav
  const docsets = await db.realmInterface.fetchDocsets();
  docsets.forEach((docset) => {
    createNode({
      children: [],
      id: createNodeId(`docsetInfo-${docset.displayName}`),
      internal: {
        contentDigest: createContentDigest(docset),
        type: 'Docset',
      },
      displayName: docset.displayName,
      search: docset.search,
      prefix: docset.prefix,
      project: docset.project,
      url: docset.url,
    });
  });
};

module.exports = {
  createDocsetNodes,
};
