import { baseUrl } from '../../src/utils/base-url.js';

const createProductNodes = async ({ db, createNode, createNodeId, createContentDigest }) => {
  // Get all MongoDB products for the sidenav
  const products = await db.fetchAllProducts();
  products.forEach((product) => {
    const url = baseUrl(product.baseUrl + product.slug);

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

export default createProductNodes;
