const removeTrailingSlash = (url) => {
  if (url && url.match(/\/$/)) {
    return url.slice(0, -1);
  }
  return url;
};

module.exports.removeTrailingSlash = removeTrailingSlash;
