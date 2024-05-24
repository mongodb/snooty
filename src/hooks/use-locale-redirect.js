import { useEffect, useMemo } from 'react';
import { withPrefix } from 'gatsby';
import { AVAILABLE_LANGUAGES, getCurrLocale, localizePath } from '../utils/locale';
import { STORAGE_KEY_PREF_LOCALE, getLocalValue } from '../utils/browser-storage';

/**
 * Attempts to perform a redirect based on the browser's locale
 * @param {string} slug The raw slug of the site page. Does not include the site's path prefix
 */
export const useLocaleRedirect = (slug) => {
  // Memoize a user's preferred supported non-English language to avoid the need to check it across multiple pages
  const preferredLang = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return undefined;
    }

    const normalizedLangs = new Set();
    // Normalize lang code in case of same language, but different region. For example:
    // "zh-CN" is used for Simplified Chinese, but "zh-TW" is used for Traditional Chinese.
    // Both should be treated as "zh" for now. Same applies to different regions for English
    navigator.languages.forEach((lang) => {
      const normlizedLang = lang.split('-')[0];
      normalizedLangs.add(normlizedLang);
    });

    // Languages should be in order of browser priority
    for (const lang of normalizedLangs) {
      // English is highly preferred over other languages, so we don't need to return anything
      if (lang === 'en') {
        return undefined;
      }

      // Check to see if browser's language is one that is already translated
      const foundLanguage = AVAILABLE_LANGUAGES.find(({ langCode }) => lang === langCode);
      if (foundLanguage) {
        return foundLanguage;
      }
    }
  }, []);

  // Determine if a redirect is needed based on browser language
  useEffect(() => {
    const currLocale = getCurrLocale();
    const storedPrefLocale = getLocalValue(STORAGE_KEY_PREF_LOCALE);
    // Only redirect based on language if site is in English
    if (currLocale !== 'en-us' || storedPrefLocale === 'en-us') {
      return;
    }

    // preferredLang should be a non-English language
    if (preferredLang) {
      // Redirect user to expected page
      const fullPageSlug = withPrefix(slug);
      const targetRedirect = localizePath(fullPageSlug, preferredLang.localeCode);
      window.location.href = targetRedirect;
    }
  }, [slug, preferredLang]);
};
