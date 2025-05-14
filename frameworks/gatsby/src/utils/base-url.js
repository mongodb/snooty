const { assertTrailingSlash } = require('./assert-trailing-slash');
const DOTCOM_BASE_URL = 'https://www.mongodb.com';
const DOTCOM_BASE_PREFIX = `docs`;

// Used to validate and match product mappings to legacy prefixes
const productToPrefixMapping = (product) => {
  const mapping = {
    opsmanager: 'ops-manager',
    cloudmanager: 'cloud-manager',
    atlas: 'atlas',
  };
  return mapping[product] ? mapping[product] : product;
};

// Used to safely join together a url (or subpath) with another path
const joinUrlAndPath = (url, path) => {
  const needsTrim = url.endsWith('/') && path.startsWith('/');
  const needsSlash = !url.endsWith('/') && !path.startsWith('/');

  return needsTrim ? url.slice(0, -1) + path : needsSlash ? url + '/' + path : url + path;
};

// Attempts to detect a subdomain product for a subset of legacy format urls
// e.g. docs.atlas.mongodb.com or docs.opsmanager.mongodb.com
const decomposeProductPrefixAndPath = (url) => {
  const decomposedUrl = url.toString().split('.');
  const subdomainProduct = decomposedUrl.length > 2 && decomposedUrl[1] !== 'mongodb' ? decomposedUrl[1] : '';
  const productPrefix = productToPrefixMapping(subdomainProduct);
  const { pathname } = url;
  return { productPrefix, pathname };
};

// Used to handle various needs to validate format of snooty-content urls, e.g.
// ensuring protocol is present, or proper prefixing
// Highly assumptive on being used only on `*.mongodb.com` domains.
const baseUrl = (url = DOTCOM_BASE_URL, options = {}) => {
  // Any invalid inputs get assigned to DOTCOM_BASE_URL
  try {
    new URL(url);
  } catch (err) {
    url = DOTCOM_BASE_URL;
  }

  const { needsProtocol = true, needsPrefix = true } = options;
  const { productPrefix, pathname } = decomposeProductPrefixAndPath(new URL(url));

  // Check that our pathname doesn't already include the base prefix.
  const hasDuplicatePrefix = pathname.replace('/', '').startsWith(DOTCOM_BASE_PREFIX);
  let baseUrl = new URL(
    needsPrefix && !hasDuplicatePrefix ? joinUrlAndPath(DOTCOM_BASE_URL, DOTCOM_BASE_PREFIX) : `${DOTCOM_BASE_URL}`
  );

  if (productPrefix && needsPrefix) {
    baseUrl.pathname = joinUrlAndPath(baseUrl.pathname, productPrefix);
  }

  if (pathname.length >= 1) baseUrl.pathname = joinUrlAndPath(baseUrl.pathname, pathname);

  return assertTrailingSlash(needsProtocol ? baseUrl.toString() : baseUrl.toString().split('//')[1]);
};

module.exports = { joinUrlAndPath, baseUrl, DOTCOM_BASE_PREFIX, DOTCOM_BASE_URL };
