const DOTCOM_BASE_URL = 'www.mongodb.com';
const DOTCOM_BASE_PREFIX = `docs`;

// Used for any product mappings that won't match prefix pathing 1:1
const productToPrefixMapping = (product) => {
  const mapping = {
    opsmanager: 'ops-manager',
    cloudmanager: 'cloud-manager',
  };
  return mapping[product] ? mapping[product] : product;
};

const joinUrlAndPath = (url, path) => {
  const needsTrim = url.endsWith('/') && path.startsWith('/');
  const needsSlash = !url.endsWith('/') && !path.startsWith('/');

  return needsTrim ? url.slice(-1) + path : needsSlash ? url + '/' + path : url + path;
};

const splitUrlBaseAndPath = (url) => {
  const decomposedUrl = url.split('.');
  const subdomainProduct = decomposedUrl[1] !== 'mongodb' ? decomposedUrl[1] : '';
  let pathname = url.split('.mongodb.com')[1];
  return { subdomainProduct, pathname };
};

// Used to handle various needs to validate format of snooty-content urls, e.g.
// ensuring protocol is present, or proper prefixing
// Highly assumptive on being used only on `*.mongodb.com` domains.
const baseUrl = (url = DOTCOM_BASE_URL, options = {}) => {
  const { needsProtocol = true, needsPrefix = true } = options;
  const { subdomainProduct, pathname } = splitUrlBaseAndPath(url);

  // Check that our pathname doesn't already include the base prefix.
  const hasDuplicatePrefix = DOTCOM_BASE_PREFIX === (pathname.split('/')[0] || pathname.split('/')[1]);

  let baseUrl =
    needsPrefix && !hasDuplicatePrefix ? joinUrlAndPath(DOTCOM_BASE_URL, DOTCOM_BASE_PREFIX) : `${DOTCOM_BASE_URL}`;

  if (needsProtocol && !baseUrl.startsWith('https://')) baseUrl = `https://${baseUrl}`;
  if (subdomainProduct && needsPrefix) {
    baseUrl = `${baseUrl}/${productToPrefixMapping(subdomainProduct)}`;
  }

  return pathname.length >= 1 ? joinUrlAndPath(baseUrl, pathname) : `${baseUrl}`;
};

module.exports = { baseUrl, DOTCOM_BASE_PREFIX, DOTCOM_BASE_URL };
