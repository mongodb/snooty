/**
 * Redirect a user based on browser's language settings. This function is only expected to be called within
 * a head script tag to encourage immediate execution, which is faster than typical JS performed after React hydration.
 * Consequently, the trade-off is that no imports are included due to how Webpack parses the JS. This might result in
 * repetitive code.
 */
function redirectBasedOnLang() {
  try {
    const storedPrefLocale = JSON.parse(localStorage.getItem('mongodb-docs'))?.['preferredLocale'];

    // Based on locale utils; couldn't figure out how to use imports due to how webpack attempts to resolve them
    // PLEASE make sure this matches the AVAILABLE_LANGUAGES object, excluding English and other hidden languages
    const supportedLocaleCodes = ['zh-cn', 'ko-kr', 'pt-br', 'ja-jp'];
    const isEnglishSite = !supportedLocaleCodes.find((localeCode) =>
      window.location.pathname.startsWith('/' + localeCode)
    );

    // No need to check for preferred lang if local storage saves user's lang preference
    // to English from interaction with the locale selector
    if (!isEnglishSite || storedPrefLocale === 'en-us') {
      return;
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
      // English is highly preferred over other languages, we don't need to check the other langs
      if (lang === 'en') {
        return;
      }

      // Check to see if browser's language is one that is already translated
      const matchedLocale = supportedLocaleCodes.find((localeCode) => localeCode.startsWith(lang));
      if (matchedLocale) {
        const targetPath = '/' + matchedLocale + window.location.pathname;
        window.location.pathname = targetPath;
      }
    }
  } catch (e) {
    console.error(e);
  }
}

export default redirectBasedOnLang;
