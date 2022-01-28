import { isBrowser } from './is-browser';

// Used to convert a 'docs.mongodb.com' or 'docs.<product>.mongodb.com' url to the new dotcom format
// this *should* be removed post consolidation, or alternatively, made to use `new URL(url)` and polyfilled for safari
// with relevant string split-slice-join logic turned into URL.pathname, and etc.
export const dotcomifyUrl = (url, needsProtocol = false) => {
  const decomposedUrl = url.split('.');
  const subdomainProduct = decomposedUrl[1] !== 'mongodb' ? decomposedUrl[1] : '';
  let pathname = url.split('.mongodb.com')[1];
  let dotcomBaseUrl = `www.mongodb.com/docs`;

  if (needsProtocol) dotcomBaseUrl = `https://${dotcomBaseUrl}`;
  if (subdomainProduct) {
    dotcomBaseUrl = `${dotcomBaseUrl}/${subdomainProduct}`;
  }

  pathname = pathname.split('/').slice(1).join('/');
  return pathname.length >= 1 ? `${dotcomBaseUrl}/${pathname}` : `${dotcomBaseUrl}`;
};

export const isDotCom = () => {
  if (!isBrowser) return !!process.env.GATSBY_BASE_URL?.includes('www');
  return window.location.hostname.split('.')[0] === 'www';
};

// Used for accessing what our base url should be, differentiating between environs
// and adding sensible defaults in the event the base variable is not present.
export const baseUrl = (needsProtocol = false) => {
  if (process.env.GATSBY_BASE_URL) return process.env.GATSBY_BASE_URL;

  const intendedFallback = isDotCom()
    ? dotcomifyUrl(window.location.hostname, needsProtocol)
    : `${needsProtocol ? 'https://' : ''}docs.mongodb.com`;
  return intendedFallback;
};
