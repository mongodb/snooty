import React, { useEffect } from 'react';
import { useLocation } from '@gatsbyjs/reach-router';
import { UnifiedFooter } from '@mdb/consistent-nav';
import { isBrowser } from '../utils/is-browser';
import { AVAILABLE_LANGUAGES, STORAGE_KEY_PREF_LOCALE, getCurrLocale, localizePath } from '../utils/locale';
import { setLocalValue } from '../utils/browser-storage';

const Footer = () => {
  const location = useLocation();

  const onSelectLocale = (locale) => {
    if (isBrowser) {
      setLocalValue(STORAGE_KEY_PREF_LOCALE, locale);
      const localizedPath = localizePath(location.pathname, locale);
      window.location.href = localizedPath;
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
