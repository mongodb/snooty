import { withPrefix } from 'gatsby';
import { assertTrailingSlash } from './assert-trailing-slash';
import { isBrowser } from './is-browser';
import { normalizePath } from './normalize-path';

// Update this as more languages are introduced
export const AVAILABLE_LANGUAGES = [
  { language: 'English', code: 'en-us' },
  { language: '简体中文', code: 'zh-cn' },
  { language: '한국어', code: 'ko-kr' },
  { language: 'Português', code: 'pt-br' },
];

const validateCode = (potentialCode) => !!AVAILABLE_LANGUAGES.find(({ code }) => potentialCode === code);

/**
 * Returns the locale code based on the current location pathname of the page.
 * @returns {string}
 */
const getCurrLocale = () => {
  const defaultLang = 'en-us';

  if (!isBrowser) {
    return defaultLang;
  }

  // This currently needs to be client-side because the source page doesn't know about locale at
  // build time. Smartling's GDN handles localization
  // Example on https://www.mongodb.com/zh-cn/docs/manual/introduction:
  // expected pathname - /zh-cn/docs/manual/introduction; expected locale - "zh-cn"
  const pathname = window.location.pathname;
  const expectedDocsPrefixes = ['docs', 'docs-qa'];
  const firstPathSlug = pathname.split('/', 2)[1];
  if (expectedDocsPrefixes.includes(firstPathSlug)) {
    return defaultLang;
  }

  const slugMatchesCode = validateCode(firstPathSlug);
  return slugMatchesCode ? firstPathSlug : defaultLang;
};

/**
 * Returns the pathname with its locale code prepended. Leading slashes are preserved, if they exist.
 * @param {string} pathname - Path name or slug of the page
 * @param {string?} localeCode - Optional locale code. By default, the code is determined based on the current location of the page
 * @returns {string}
 */
export const localizePath = (pathname, localeCode) => {
  if (!pathname) {
    return '';
  }

  const code = localeCode && validateCode(localeCode) ? localeCode : getCurrLocale();
  const languagePrefix = code === 'en-us' ? '' : `${code}/`;
  let newPath = languagePrefix + pathname;
  if (pathname.startsWith('/')) {
    newPath = `/${newPath}`;
  }
  return assertTrailingSlash(normalizePath(newPath));
};

/**
 * Returns a mapping of a page's URL and its equivalent URLs for different languages.
 * @param {string} siteUrl
 * @param {string} slug
 * @returns {object}
 */
export const getLocaleMapping = (siteUrl, slug) => {
  // handle the `/` path
  const slugForUrl = slug === '/' ? withPrefix('') : withPrefix(slug);
  const normalizedSiteUrl = siteUrl?.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
  const localeHrefMap = {};

  AVAILABLE_LANGUAGES.forEach(({ code }) => {
    const localizedPath = localizePath(slugForUrl, code);
    const targetUrl = normalizedSiteUrl + localizedPath;
    localeHrefMap[code] = targetUrl;
  });

  return localeHrefMap;
};
