const assertTrailingSlash = (url) => {
  if (url && url.match(/\/$/)) {
    return url;
  }
  return `${url}/`;
};

export { assertTrailingSlash };
