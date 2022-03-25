// Why duplicate this from utils/isBrowser? ES imports vs. requires impacting usage in gatsby-node.js
// Contents of this file are temporal regardless, and logic is somewhat universal regardless.
const isBrowser = typeof window !== 'undefined';

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

// Used to convert a 'docs.mongodb.com' or 'docs.<product>.mongodb.com' url to the new dotcom format
// this *should* be removed post consolidation, or alternatively, made to use `new URL(url)` and polyfilled for safari
// with relevant string split-slice-join logic turned into URL.pathname, and etc.
const dotcomifyUrl = (url, options = {}) => {
  const { needsProtocol = true, needsPrefix = true } = options;
  const decomposedUrl = url.split('.');
  const subdomainProduct = decomposedUrl[1] !== 'mongodb' ? decomposedUrl[1] : '';
  let pathname = url.split('.mongodb.com')[1];
  let baseUrl = needsPrefix ? `${DOTCOM_BASE_URL}/${DOTCOM_BASE_PREFIX}` : `${DOTCOM_BASE_URL}`;

  if (needsProtocol) baseUrl = `https://${baseUrl}`;
  if (subdomainProduct && needsPrefix) {
    baseUrl = `${baseUrl}/${productToPrefixMapping(subdomainProduct)}`;
  }

  pathname = pathname.split('/').slice(1).join('/');
  return pathname.length >= 1 ? `${baseUrl}/${pathname}` : `${baseUrl}`;
};

const isDotCom = () => {
  if (!isBrowser) return !!process.env.GATSBY_BASE_URL?.includes('www');
  return window.location.hostname.split('.')[0] === 'www';
};

// Used for accessing what our base url should be, differentiating between environs
// and adding sensible defaults in the event the base variable is not present.
const baseUrl = (needsProtocol = false) => {
  const url = (isBrowser && window.location.hostname) || 'docs.mongodb.com';
  return isDotCom() ? dotcomifyUrl(url, { needsProtocol }) : `${needsProtocol ? 'https://' : ''}${url}`;
};

module.exports = { dotcomifyUrl, isDotCom, baseUrl, productToPrefixMapping, DOTCOM_BASE_URL, DOTCOM_BASE_PREFIX };
