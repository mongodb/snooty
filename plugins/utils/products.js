const { siteMetadata } = require('../../src/utils/site-metadata');

// Helper function with fallback to ensure first App Services Function migration to Nextjs does not break app
const fetchProducts = async () => {
  try {
    const res = await fetch(`${process.env.GATSBY_NEXT_API_BASE_URL}/products/?dbName=${siteMetadata.database}`);
    const products = await res.json();
    return products;
  } catch (err) {
    console.error('Nextjs API has responded with error, will use fallback App Services Function ', err);
    throw err;
  }
};

const createProductNodes = async ({ createNode, createNodeId, createContentDigest }) => {
  // Get all MongoDB products for the sidenav
  const products = await fetchProducts();

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
