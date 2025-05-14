const assertTrailingSlash = (url) => {
  if (url && url.match(/\/$/)) {
    return url;
  }
  return `${url}/`;
};

module.exports.assertTrailingSlash = assertTrailingSlash;
