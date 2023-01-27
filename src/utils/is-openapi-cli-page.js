const isOpenApiCliPage = (filename, manifestMetadata) => {
  const openapi_pages = Object.keys(manifestMetadata.openapi_pages);
  const trimmedFilename = filename.slice(0, -4);
  return openapi_pages.some((name) => name === trimmedFilename);
};

module.exports.isOpenApiCliPage = isOpenApiCliPage;
