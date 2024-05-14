import { useEffect } from 'react';
import { withPrefix } from 'gatsby';
import { AVAILABLE_LANGUAGES, getCurrLocale, localizePath } from '../utils/locale';
import { STORAGE_KEY_PREF_LOCALE, getLocalValue } from '../utils/browser-storage';

/**
 * Attempts to perform a redirect based on the browser's locale
 * @param {string} slug The raw slug of the site page. Does not include the site's path prefix
 */
export const useLocaleRedirect = (slug) => {
  // Determine if a redirect is needed based on browser language
  useEffect(() => {
    if (typeof navigator === undefined) {
      return;
    }

    const { languages } = navigator;
    const currLocale = getCurrLocale();
    const storedPrefLocale = getLocalValue(STORAGE_KEY_PREF_LOCALE);
    // Only redirect based on language if site is in English
    if (currLocale !== 'en-us' || !languages || storedPrefLocale === 'en-us') {
      return;
    }

    // languages should be in order of browser priority
    for (const lang of languages) {
      // Normalize lang code in case of same language, but different region. For example:
      // "zh-CN" is used for Simplified Chinese, but "zh-TW" is used for Traditional Chinese.
      // Both should be treated as "zh" for now. Same applies to different regions for English
      const normalizedLang = lang.split('-')[0];
      // English is already a preferred language, so we should not attempt to redirect
      if (normalizedLang === 'en') {
        break;
      }

      const foundLanguage = AVAILABLE_LANGUAGES.find(({ langCode }) => normalizedLang === langCode);
      if (foundLanguage) {
        // Redirect user to expected page
        const fullPageSlug = withPrefix(slug);
        const targetRedirect = localizePath(fullPageSlug, foundLanguage.localeCode);
        window.location.href = targetRedirect;
        break;
      }
    }
  }, [slug]);
};
