import React, { useEffect } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { UnifiedFooter } from '@mdb/consistent-nav';
import { isBrowser } from '../utils/is-browser';
import { AVAILABLE_LANGUAGES, getCurrLocale, getLocaleMapping } from '../utils/locale';
import { useCookies } from 'react-cookie';

const COOKIE_LOCALE_KEY = 'avoid_en_redirect';

const Footer = ({ slug }) => {
  const location = useLocation();
  const [_cookies, setCookie] = useCookies([COOKIE_LOCALE_KEY]);

  const onSelectLocale = (locale) => {
    const localeHrefMap = getLocaleMapping(location.origin, slug);

    if (isBrowser) {
      setCookie(COOKIE_LOCALE_KEY, 'true')
      window.location.href = localeHrefMap[locale];
    }
  };

  // A workaround to remove the other locale options
  useEffect(() => {
    const footer = document.getElementById('footer-container');
    const footerUlElement = footer?.querySelector('ul[role=listbox]');
    if (footerUlElement) {
      // For DOP-4296 we only want to support English, Simple Chinese, Korean, and Portuguese.
      const availableOptions = Array.from(footerUlElement.childNodes).reduce((accumulator, child) => {
        if (AVAILABLE_LANGUAGES.find(({ language }) => child.textContent === language)) {
          accumulator.push(child);
        }
        return accumulator;
      }, []);

      footerUlElement.innerHTML = null;
      availableOptions.forEach((child) => {
        footerUlElement.appendChild(child);
      });
    }
  }, []);

  return <UnifiedFooter onSelectLocale={onSelectLocale} locale={getCurrLocale()} />;
};

export default Footer;
