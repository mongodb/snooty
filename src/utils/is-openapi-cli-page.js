const isOpenApiCliPage = (pageNode, filename) => {
  return pageNode?.ast?.options?.template === 'openapi' && !filename.match(/openapi\/preview/);
};

module.exports.isOpenApiCliPage = isOpenApiCliPage;
