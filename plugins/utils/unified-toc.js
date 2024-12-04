const { load } = require('js-toml');

const createTocNodes = async ({ createNode, createNodeId, createContentDigest }) => {
  // Get all MongoDB products for the sidenav

  createNode({
    children: [],
    id: createNodeId('toc'),
    internal: {
      contentDigest: createContentDigest(product),
      type: 'Product',
    },
    parent: null,
    title: product.title,
    url: product.baseUrl + product.slug,
  });
};

module.exports = {
  createTocNodes,
};
