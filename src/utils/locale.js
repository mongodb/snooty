import { withPrefix } from 'gatsby';
import { assertTrailingSlash } from './assert-trailing-slash';

// Update this as more languages are introduced
export const AVAILABLE_LANGUAGES = [
  { language: 'English', code: 'en-us' },
  { language: '简体中文', code: 'zh-cn' },
  { language: '한국어', code: 'ko-kr' },
  { language: 'Português', code: 'pt-br' },
];

/**
 * Returns a mapping of a page's URL and its equivalent URLs for different languages.
 * @param {string} siteUrl
 * @param {string} slug
 * @returns {object}
 */
export const getLocaleMapping = (siteUrl, slug) => {
  // handle the `/` path
  const slugForUrl = slug === '/' ? withPrefix('') : withPrefix(slug);
  const normalizedSiteUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
  const localeHrefMap = {};

  AVAILABLE_LANGUAGES.forEach(({ code }) => {
    const langPrefix = code === 'en-us' ? '' : `/${code}`;
    const targetUrl = `${normalizedSiteUrl}${langPrefix}${slugForUrl}`;
    localeHrefMap[code] = assertTrailingSlash(targetUrl);
  });

  return localeHrefMap;
};
