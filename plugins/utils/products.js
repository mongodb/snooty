const { siteMetadata } = require('../../gatsby-config');
const { baseUrl } = require('../../src/utils/base-url');

const createProductNodes = async ({ db, createNode, createNodeId, createContentDigest }) => {
  // Get all MongoDB products for the sidenav
  const products = await db.fetchAllProducts();
  products.forEach((product) => {
    let url = baseUrl(product.baseUrl + product.slug);
    if (siteMetadata.snootyEnv === 'dotcomstg') url = product.baseUrl + product.slug;

    createNode({
      children: [],
      id: createNodeId(`Product-${product.title}`),
      internal: {
        contentDigest: createContentDigest(product),
        type: 'Product',
      },
      parent: null,
      title: product.title,
      url,
    });
  });
};

module.exports = {
  createProductNodes,
};
