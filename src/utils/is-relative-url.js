export const isRelativeUrl = (url) => {
  // Assume that external links begin with http:// or https://
  const external = /^http(s)?:\/\//.test(url) || url.startsWith('mailto:');
  return !external;
};
