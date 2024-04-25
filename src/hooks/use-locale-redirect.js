import { useEffect } from "react";
import { AVAILABLE_LANGUAGES, getCurrLocale, getLocaleMapping } from "../utils/locale";
import { useSiteMetadata } from "./use-site-metadata";
import { useCookies } from "react-cookie";

const COOKIE_LOCALE_KEY = 'avoid_en_redirect';

export const useLocaleRedirect = (slug) => {
  const { siteUrl } = useSiteMetadata();
  const [cookies, _setCookie] = useCookies([COOKIE_LOCALE_KEY]);

  console.log(cookies);

  useEffect(() => {
    if (typeof navigator === undefined) {
      return;
    }

    const { languages } = navigator;
    const currLocale = getCurrLocale();
    // Only redirect languages for now if site is in English
    if (currLocale !== 'en-us' || !languages || cookies[COOKIE_LOCALE_KEY]) {
      return;
    }
  
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
        const targetRedirect = getLocaleMapping(siteUrl, slug)[foundLanguage.code];
        window.location.href = targetRedirect;
        break;
      }
    }
  }, [siteUrl, slug]);


};
