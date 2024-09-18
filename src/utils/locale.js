import { withPrefix } from 'gatsby';
import { SIDE_NAV_CONTAINER_ID, TEMPLATE_CONTAINER_ID } from '../constants';
import { assertTrailingSlash } from './assert-trailing-slash';
import { isBrowser } from './is-browser';
import { normalizePath } from './normalize-path';
import { removeLeadingSlash } from './remove-leading-slash';
import { setLocalValue } from './browser-storage';

// Prevents Smartling from translating content within HTML block
// (https://help.smartling.com/hc/en-us/articles/13274689281307-Default-Translatable-Content-In-The-GDN)
export const NOTRANSLATE_CLASS = 'notranslate';

/**
 * Key used to access browser storage for user's preferred locale
 */
export const STORAGE_KEY_PREF_LOCALE = 'preferredLocale';

// Update this as more languages are introduced
// Because the client-side redirect script cannot use an import, PLEASE remember to update the list of supported languages
// in redirect-based-on-lang.js
const AVAILABLE_LANGUAGES = [
  { language: 'English', localeCode: 'en-us' },
  { language: '简体中文', localeCode: 'zh-cn', fontFamily: 'Noto Sans SC' },
  { language: '한국어', localeCode: 'ko-kr', fontFamily: 'Noto Sans KR' },
  { language: 'Português', localeCode: 'pt-br' },
];

// Languages in current development that we do not want displayed publicly yet
const HIDDEN_LANGUAGES = [{ language: '日本語', localeCode: 'ja-jp', fontFamily: 'Noto Sans JP' }];

/**
 * @param {boolean} forceAll - Bypasses feature flag requirements if necessary
 * @returns An array of languages supported for translation
 */
export const getAvailableLanguages = (forceAll = false) => {
  const langs = [...AVAILABLE_LANGUAGES];

  if (forceAll || process.env.GATSBY_FEATURE_SHOW_HIDDEN_LOCALES === 'true') {
    langs.push(...HIDDEN_LANGUAGES);
  }

  return langs;
};

const validateLocaleCode = (potentialCode) =>
  !!getAvailableLanguages().find(({ localeCode }) => potentialCode === localeCode);

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

export const getAllLocaleCssStrings = () => {
  const strings = [];
  // We want to bypass feature flag requirements to ensure fonts for hidden languages are always included
  const allLangs = getAvailableLanguages(true);

  allLangs.forEach(({ localeCode, fontFamily }) => {
    if (!fontFamily) {
      return;
    }
    const [languageCode] = localeCode.split('-');
    // Only check that languageCode is in the beginning to be flexible when region code is capitalized
    // For example: zh-cn and zh-CN will be treated the same.
    // We want to target everything except for inline code, code blocks, and the consistent-nav components
    strings.push(`
      html[lang^=${languageCode}] {
        #${TEMPLATE_CONTAINER_ID} *:not(:is(code, code *)),
        #${SIDE_NAV_CONTAINER_ID} * {
          font-family: ${fontFamily};
        }
      }
    `);
  });

  return strings;
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

  getAvailableLanguages().forEach(({ localeCode }) => {
    const localizedPath = localizePath(slugForUrl, localeCode);
    const targetUrl = normalizedSiteUrl + localizedPath;
    localeHrefMap[localeCode] = assertTrailingSlash(targetUrl);
  });

  return localeHrefMap;
};

export const onSelectLocale = (locale) => {
  const location = window.location;
  setLocalValue(STORAGE_KEY_PREF_LOCALE, locale);
  const localizedPath = localizePath(location.pathname, locale);
  window.location.href = localizedPath;
};

/**
 * Ensures that a locale code has an all lowercase language code with an all uppercase region code,
 * as described in https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang#region_subtag.
 * @param {string} localeCode - A valid locale code with either 1 or 2 parts. Example: `zh-cn` or `zh`
 * @returns {string | undefined}
 */
export const getHtmlLangFormat = (localeCode) => {
  const parts = localeCode.split('-');
  if (parts.length < 2) {
    return localeCode;
  }

  const [langCode, regionCode] = parts;
  return `${langCode.toLowerCase()}-${regionCode.toUpperCase()}`;
};
