const { siteMetadata } = require('../../src/utils/site-metadata');

const createProductNodes = async ({ db, createNode, createNodeId, createContentDigest }) => {
  // Get all MongoDB products for the sidenav
  const res = await fetch(`${process.env.GATSBY_NEXT_API_BASE_URL}/api/products?dbName=${siteMetadata.database}`);
  const products = await res.json();

  products.forEach((product) => {
    createNode({
      children: [],
      id: createNodeId(`Product-${product.title}`),
      internal: {
        contentDigest: createContentDigest(product),
        type: 'Product',
      },
      parent: null,
      title: product.title,
      url: product.baseUrl + product.slug,
    });
  });
};

module.exports = {
  createProductNodes,
};
