const createProductNodes = async ({ db, createNode, createNodeId, createContentDigest }) => {
  // Get all MongoDB products for the sidenav
  const products = await db.fetchAllProducts();
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
