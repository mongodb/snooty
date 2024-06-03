import { withPrefix } from 'gatsby';
import { assertTrailingSlash } from './assert-trailing-slash';
import { isBrowser } from './is-browser';
import { normalizePath } from './normalize-path';
import { removeLeadingSlash } from './remove-leading-slash';

/**
 * Key used to access browser storage for user's preferred locale
 */
export const STORAGE_KEY_PREF_LOCALE = 'preferredLocale';

// Update this as more languages are introduced
// Because the client-side redirect script cannot use an import, PLEASE remember to update the list of supported languages
// in redirect-based-on-lang.js
export const AVAILABLE_LANGUAGES = [
  { language: 'English', localeCode: 'en-us' },
  { language: '简体中文', localeCode: 'zh-cn' },
  { language: '한국어', localeCode: 'ko-kr' },
  { language: 'Português', localeCode: 'pt-br' },
];

if (process.env.GATSBY_FEATURE_SHOW_HIDDEN_LOCALES === 'true') {
  AVAILABLE_LANGUAGES.push({ language: '日本語', localeCode: 'ja-jp' });
}

const validateLocaleCode = (potentialCode) =>
  !!AVAILABLE_LANGUAGES.find(({ localeCode }) => potentialCode === localeCode);

/**
 * Strips the first locale code found in the slug. This function should be used to determine the original un-localized path of a page.
 * This assumes that the locale code is the first part of the URL slug. For example: "/zh-cn/docs/foo".
 * @param {string} slug
 * @returns {string}
 */
const stripLocale = (slug) => {
  // Smartling has extensive replace logic for URLs and slugs that follow the pattern of "https://www.mongodb.com/docs". However,
  // there are instances where we can't rely on them for certain components
  if (!slug) {
    return '';
  }

  // Normalize the slug in case any malformed slugs appear like: "//zh-cn/docs"
  const slugWithSlash = slug.startsWith('/') ? slug : `/${slug}`;
  const normalizedSlug = normalizePath(slugWithSlash);
  const firstPathSlug = normalizedSlug.split('/', 2)[1];

  // Replace from the original slug to maintain original form
  const res = validateLocaleCode(firstPathSlug) ? normalizePath(slug.replace(firstPathSlug, '')) : slug;
  if (res.startsWith('/') && !slug.startsWith('/')) {
    return removeLeadingSlash(res);
  } else if (!res.startsWith('/') && slug.startsWith('/')) {
    return `/${res}`;
  } else {
    return res;
  }
};

/**
 * Returns the font-family name or undefined as a value based on the locale code
 * returned from getCurrentLocale, undefined to tell CSS to ignore this and work as
 * normal and use LG's styles.
 *
 * This is currently for overriding font-family from LG.
 */
export const getCurrentLocaleFontFamilyValue = () => {
  const fontFamilyMap = {
    'zh-cn': 'Noto Sans SC',
    'ko-kr': 'Noto Sans KR',
    'ja-jp': 'Noto Sans JP',
  };
  const locale = getCurrLocale();
  return fontFamilyMap[locale] ? `${fontFamilyMap[locale]}` : undefined;
};

/**
 * Returns the locale code based on the current location pathname of the page.
 * @returns {string}
 */
export const getCurrLocale = () => {
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

  const slugMatchesCode = validateLocaleCode(firstPathSlug);
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

  const unlocalizedPath = stripLocale(pathname);
  const code = localeCode && validateLocaleCode(localeCode) ? localeCode : getCurrLocale();
  const languagePrefix = code === 'en-us' ? '' : `${code}/`;
  let newPath = languagePrefix + unlocalizedPath;
  if (pathname.startsWith('/')) {
    newPath = `/${newPath}`;
  }
  return normalizePath(newPath);
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

  AVAILABLE_LANGUAGES.forEach(({ localeCode }) => {
    const localizedPath = localizePath(slugForUrl, localeCode);
    const targetUrl = normalizedSiteUrl + localizedPath;
    localeHrefMap[localeCode] = assertTrailingSlash(targetUrl);
  });

  return localeHrefMap;
};
