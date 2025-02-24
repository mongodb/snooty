// If we're on a translated site and the current page is not part of the pilot, we want to redirect the user back to the English page
function handleLimitedTranslationSite(limitedTranslationSite, localeSlug) {
  
}

/**
 * Redirect a user based on browser's language settings. This function is only expected to be called within
 * a head script tag to encourage immediate execution, which is faster than typical JS performed after React hydration.
 * Consequently, the trade-off is that no imports are included due to how Webpack parses the JS. This might result in
 * repetitive code.
 * 
 * Ideally, this is all handled server-side to enforce HTTP redirects, but since we statically host everything and 
 * Kanopy doesn't currently support Edge functions, this was the most straightforward way without creating and maintaining 
 * a dedicated server.
 */
function redirectBasedOnLang(limitedTranslations) {
  console.log('HELLO???');
  console.log({ internalFoo: 'hyuck', limitedTranslations });

  try {
    // No need to check for preferred lang if local storage saves user's lang preference
    // to English from interaction with the locale selector
    const storedPrefLocale = JSON.parse(localStorage.getItem('mongodb-docs'))?.['preferredLocale'];

    // Based on locale utils; couldn't figure out how to use imports due to how webpack attempts to resolve them
    // PLEASE make sure this matches the AVAILABLE_LANGUAGES object, excluding English and other hidden languages
    const supportedLocaleCodes = ['zh-cn', 'ko-kr', 'pt-br', 'ja-jp'];
    // No need to redirect if user is on a fully translated site
    const isFullyTranslatedSite = supportedLocaleCodes.find((localeCode) =>
      window.location.pathname.startsWith('/' + localeCode)
    );

    if (isFullyTranslatedSite || storedPrefLocale === 'en-us') {
      console.log({ supportedLocaleCodes });
      return;
    }

    if (limitedTranslations?.length) {
      const localeSlug = window.location.pathname.split('/')[1];
      const limitedTranslationSite = limitedTranslations.find(({ locale }) => localeSlug === locale);

      // Prevent users from accessing pages on a limited translation site that are not intended to be translated yet
      if (limitedTranslationSite) {
        // Function reference error?
        // handleLimitedTranslationSite(limitedTranslationSite, localeSlug);
        
        // TODO-5322: Maybe we can pass in the pathPrefix and pass it into this function? Assuming the pathname's ending should
        // match the slug may be problematic if there are two pages that have similar endings 
        // (example: if "/alerts" is in the array, but the pathname is "/unrelated-page/alerts/")
        // This may need revisiting when sites are built with monorepo
        const foundPage = limitedTranslationSite.pages?.find((slug) => window.location.pathname.includes(`${slug}/`));
        if (!foundPage) {
          const newPathname = window.location.pathname.replace(`/${localeSlug}`, '');
          window.location.pathname = newPathname;
        }
        return;
      }

      for (const limitedTranslation of limitedTranslations) {
        console.log({ limitedTranslation });
        // TODO-5322: Maybe we can pass in the pathPrefix and pass it into this function? Assuming the pathname's ending should
        // match the slug may be problematic if there are two pages that have similar endings 
        // (example: if "/alerts" is in the array, but the pathname is "/unrelated-page/alerts/")
        // This may need revisiting when sites are built with monorepo
        const foundPage = limitedTranslation.pages?.find((slug) => window.location.pathname.includes(`${slug}/`));

        if (localeSlug === limitedTranslation.locale) {
          console.log(`localeSlug matches: ${localeSlug} === ${limitedTranslation.locale}`);
          // Prevent users from accessing pages on a limited translation site that are not intended to be translated yet
          if (!foundPage) {
            console.log('Found no page. Should redirect');
            const newPathname = window.location.pathname.replace(`/${localeSlug}`, '');
            console.log(`New one: ${newPathname}`);
            window.location.pathname = newPathname;
          }
          // Similar behavior to fully supported localized sites: No need to do additional redirection
          return;
        }

        // We support the limited translated locale for the CURRENT page and may need to redirect to it
        if (foundPage) {
          console.log(`Found a page! ${foundPage}`);
          supportedLocaleCodes.push(limitedTranslation.locale);
          console.log({ supportedLocaleCodes });
        }
      }
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
        window.location.href = targetPath;
      }
    }
  } catch (e) {
    console.error(e);
  }
}

export default redirectBasedOnLang;
